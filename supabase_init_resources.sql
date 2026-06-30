-- 刪除舊表單（由於無真實資料，這可以確保清理乾淨，注意 CASCADE 會一併清除依賴）
DROP TABLE IF EXISTS public.task_queue CASCADE;
DROP TABLE IF EXISTS public.devices_status CASCADE;
DROP TABLE IF EXISTS public.authorization_codes CASCADE;
DROP TABLE IF EXISTS public.resources CASCADE;
DROP TABLE IF EXISTS public.characters CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. Profiles (使用者基本資料 - 平台登入帳號)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Authorization Codes (授權碼)
CREATE TABLE public.authorization_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    code TEXT NOT NULL UNIQUE,
    plan_type TEXT NOT NULL DEFAULT 'monthly', -- 'daily', 'weekly', 'monthly', 'infinite'
    allowed_devices INTEGER NOT NULL DEFAULT 1,
    auth_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Characters (遊戲角色與資源)
CREATE TABLE public.characters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    game_account TEXT NOT NULL, -- 遊戲帳號 (用來讓腳本辨識)
    server_name TEXT NOT NULL,  -- 伺服器
    char_slot INTEGER NOT NULL, -- 角色序
    character_name TEXT NOT NULL,
    profession TEXT,
    level INTEGER DEFAULT 1,
    dispatch_current INTEGER DEFAULT 0,
    dispatch_max INTEGER DEFAULT 3,
    vitality INTEGER DEFAULT 100, -- 活力值 (取代了 Zeny)
    crystal INTEGER DEFAULT 0,
    special_items JSONB DEFAULT '[]'::jsonb,
    crystal_updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    profile_updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    vitality_dispatch_updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    -- 確保同一使用者底下的同一個遊戲帳號、伺服器、角色序不會重複，方便我們做 Upsert
    UNIQUE(user_id, game_account, server_name, char_slot)
);

-- 4. Devices Status (設備/掛機狀態)
CREATE TABLE public.devices_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL,
    device_index INTEGER NOT NULL,
    auth_code TEXT REFERENCES public.authorization_codes(code) ON DELETE SET NULL,
    current_task TEXT DEFAULT '閒置中',
    logs TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, device_index)
);

-- 5. Task Queue (任務佇列)
CREATE TABLE public.task_queue (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    device_id UUID REFERENCES public.devices_status(id) ON DELETE CASCADE,
    task_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==========================================
-- 建立讓腳本呼叫的 RPC 函數 (Postgres Function)
-- 這能讓 Auto.js 只需要傳送授權碼與角色資訊，就能安全地更新資料庫
-- ==========================================
CREATE OR REPLACE FUNCTION public.update_character_status_by_auth(
    p_auth_code TEXT,
    p_game_account TEXT,
    p_server_name TEXT,
    p_char_slot INTEGER,
    p_character_name TEXT DEFAULT NULL,
    p_profession TEXT DEFAULT NULL,
    p_level INTEGER DEFAULT NULL,
    p_dispatch_current INTEGER DEFAULT NULL,
    p_dispatch_max INTEGER DEFAULT NULL,
    p_vitality INTEGER DEFAULT NULL,
    p_crystal INTEGER DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER -- 以建立者權限執行，繞過 RLS（因為外部腳本沒有登入 auth）
AS $$
DECLARE
    v_user_id UUID;
    v_char_id UUID;
BEGIN
    -- 1. 驗證授權碼，取得 user_id
    SELECT user_id INTO v_user_id 
    FROM public.authorization_codes 
    WHERE code = p_auth_code;

    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', false, 'message', '無效的授權碼');
    END IF;

    -- 2. 使用 Upsert 更新或新增角色資料
    INSERT INTO public.characters (
        user_id, game_account, server_name, char_slot, character_name, profession, level,
        dispatch_current, dispatch_max, vitality, crystal
    ) VALUES (
        v_user_id, p_game_account, p_server_name, p_char_slot, COALESCE(p_character_name, '未知角色'), p_profession, COALESCE(p_level, 1),
        COALESCE(p_dispatch_current, 0), COALESCE(p_dispatch_max, 3), COALESCE(p_vitality, 100), COALESCE(p_crystal, 0)
    )
    ON CONFLICT (user_id, game_account, server_name, char_slot) 
    DO UPDATE SET 
        character_name = COALESCE(EXCLUDED.character_name, characters.character_name),
        profession = COALESCE(EXCLUDED.profession, characters.profession),
        level = COALESCE(EXCLUDED.level, characters.level),
        profile_updated_at = CASE 
            WHEN characters.character_name IS DISTINCT FROM EXCLUDED.character_name OR
                 characters.profession IS DISTINCT FROM EXCLUDED.profession OR
                 characters.level IS DISTINCT FROM EXCLUDED.level 
            THEN now() 
            ELSE characters.profile_updated_at 
        END,
        
        dispatch_current = COALESCE(EXCLUDED.dispatch_current, characters.dispatch_current),
        dispatch_max = COALESCE(EXCLUDED.dispatch_max, characters.dispatch_max),
        vitality = COALESCE(EXCLUDED.vitality, characters.vitality),
        vitality_dispatch_updated_at = CASE 
            WHEN characters.dispatch_current IS DISTINCT FROM EXCLUDED.dispatch_current OR
                 characters.dispatch_max IS DISTINCT FROM EXCLUDED.dispatch_max OR
                 characters.vitality IS DISTINCT FROM EXCLUDED.vitality 
            THEN now() 
            ELSE characters.vitality_dispatch_updated_at 
        END,
        
        crystal = COALESCE(EXCLUDED.crystal, characters.crystal),
        crystal_updated_at = CASE 
            WHEN characters.crystal IS DISTINCT FROM EXCLUDED.crystal 
            THEN now() 
            ELSE characters.crystal_updated_at 
        END,
        
        updated_at = now()
    RETURNING id INTO v_char_id;

    RETURN json_build_object('success', true, 'message', '角色資料已更新', 'character_id', v_char_id);
END;
$$;

-- ==========================================
-- 設定 Row Level Security (RLS) 與 Policies
-- ==========================================
-- 建立判斷是否為管理員的函數 (繞過 RLS 防止無限迴圈)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$ LANGUAGE sql SECURITY DEFINER;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authorization_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_queue ENABLE ROW LEVEL SECURITY;

-- Profiles: 用戶只能看到/修改自己的，管理員可看全部
CREATE POLICY "Profiles view policy" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Profiles update policy" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Profiles insert policy" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id OR public.is_admin());
CREATE POLICY "Profiles delete policy" ON public.profiles FOR DELETE USING (public.is_admin());

-- Authorization Codes: 用戶只能看到自己的，管理員全權管理
CREATE POLICY "Auth codes view policy" ON public.authorization_codes FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Auth codes insert policy" ON public.authorization_codes FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Auth codes update policy" ON public.authorization_codes FOR UPDATE USING (public.is_admin());
CREATE POLICY "Auth codes delete policy" ON public.authorization_codes FOR DELETE USING (public.is_admin());

-- Characters: 用戶只能看自己的，管理員可看全部。寫入權限僅限管理員或系統腳本 (RPC)
CREATE POLICY "Characters view policy" ON public.characters FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Characters insert policy" ON public.characters FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Characters update policy" ON public.characters FOR UPDATE USING (public.is_admin());
CREATE POLICY "Characters delete policy" ON public.characters FOR DELETE USING (public.is_admin());

-- Devices Status: 用戶只能看自己的設備。寫入權限僅限管理員或系統腳本 (RPC)
CREATE POLICY "Devices view policy" ON public.devices_status FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Devices insert policy" ON public.devices_status FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Devices update policy" ON public.devices_status FOR UPDATE USING (public.is_admin());
CREATE POLICY "Devices delete policy" ON public.devices_status FOR DELETE USING (public.is_admin());

-- Task Queue: 用戶只能管理屬於自己設備的任務
CREATE POLICY "Tasks view policy" ON public.task_queue FOR SELECT USING (
  device_id IN (SELECT id FROM public.devices_status WHERE user_id = auth.uid()) OR public.is_admin()
);
CREATE POLICY "Tasks insert policy" ON public.task_queue FOR INSERT WITH CHECK (
  device_id IN (SELECT id FROM public.devices_status WHERE user_id = auth.uid()) OR public.is_admin()
);
CREATE POLICY "Tasks update policy" ON public.task_queue FOR UPDATE USING (
  device_id IN (SELECT id FROM public.devices_status WHERE user_id = auth.uid()) OR public.is_admin()
);
CREATE POLICY "Tasks delete policy" ON public.task_queue FOR DELETE USING (
  device_id IN (SELECT id FROM public.devices_status WHERE user_id = auth.uid()) OR public.is_admin()
);

-- ==========================================
-- 插入示範用的假資料 (Dummy Data)
-- ==========================================
INSERT INTO public.profiles (id, email, is_admin)
VALUES 
('11111111-1111-1111-1111-111111111111', 'player1@test.com', false),
('22222222-2222-2222-2222-222222222222', 'player2@test.com', false);

INSERT INTO public.authorization_codes (user_id, code, plan_type, allowed_devices)
VALUES 
('11111111-1111-1111-1111-111111111111', 'AUTH-P1-001', 'monthly', 2),
('22222222-2222-2222-2222-222222222222', 'AUTH-P2-001', 'weekly', 1);

INSERT INTO public.characters (id, user_id, game_account, server_name, char_slot, character_name, profession, level, dispatch_current, dispatch_max, vitality, crystal, special_items)
VALUES 
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'game_acc_1', '金玉滿堂', 1, '劍士波波', '騎士', 45, 2, 3, 85, 12000, '[{"name": "波利卡片", "qty": 1, "quality": "rare"}]'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'game_acc_1', '金玉滿堂', 2, '法師莉莉', '巫師', 42, 1, 3, 100, 8500, '[]'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'game_acc_2', '傾城之戰', 1, '刺客阿薩', '十字刺客', 50, 3, 3, 40, 45000, '[{"name": "黃金盜蟲卡片", "qty": 1, "quality": "epic"}]');

INSERT INTO public.devices_status (id, user_id, character_id, device_index, current_task, logs)
VALUES 
('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, '自動打怪 - 普隆德拉原野', '2026-06-22 10:00:00 - 獲得 波利卡片'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 1, '自動採集 - 礦坑', '2026-06-22 10:10:00 - 獲得 煤礦 x5');

INSERT INTO public.task_queue (device_id, task_type, status)
VALUES 
('dddddddd-dddd-dddd-dddd-dddddddddddd', '回城購買藥水', 'pending'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '精煉裝備', 'pending');
