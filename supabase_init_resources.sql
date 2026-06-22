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
    current_task TEXT DEFAULT '閒置中',
    logs TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
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
    p_dispatch_current INTEGER DEFAULT 0,
    p_dispatch_max INTEGER DEFAULT 3,
    p_vitality INTEGER DEFAULT 100
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
        user_id, game_account, server_name, char_slot, character_name, profession,
        dispatch_current, dispatch_max, vitality
    ) VALUES (
        v_user_id, p_game_account, p_server_name, p_char_slot, COALESCE(p_character_name, '未知角色'), p_profession,
        p_dispatch_current, p_dispatch_max, p_vitality
    )
    ON CONFLICT (user_id, game_account, server_name, char_slot) 
    DO UPDATE SET 
        character_name = COALESCE(EXCLUDED.character_name, characters.character_name),
        profession = COALESCE(EXCLUDED.profession, characters.profession),
        dispatch_current = EXCLUDED.dispatch_current,
        dispatch_max = EXCLUDED.dispatch_max,
        vitality = EXCLUDED.vitality,
        updated_at = now()
    RETURNING id INTO v_char_id;

    RETURN json_build_object('success', true, 'message', '角色資料已更新', 'character_id', v_char_id);
END;
$$;

-- ==========================================
-- 設定 Row Level Security (RLS) 與 Policies
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authorization_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all auth_codes" ON public.authorization_codes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all characters" ON public.characters FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all devices" ON public.devices_status FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all tasks" ON public.task_queue FOR ALL USING (true) WITH CHECK (true);

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
