-- 刪除舊表單（由於無真實資料，這可以確保清理乾淨，注意 CASCADE 會一併清除依賴）
DROP TABLE IF EXISTS public.task_queue CASCADE;
DROP TABLE IF EXISTS public.devices_status CASCADE;
DROP TABLE IF EXISTS public.authorization_codes CASCADE;
DROP TABLE IF EXISTS public.resources CASCADE;
DROP TABLE IF EXISTS public.characters CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. Profiles (使用者基本資料)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY, -- 通常綁定 Supabase Auth 的 auth.users.id，測試用可自動產生或手動給予
    email TEXT UNIQUE NOT NULL,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Authorization Codes (授權碼)
CREATE TABLE public.authorization_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    code TEXT NOT NULL UNIQUE,
    allowed_devices INTEGER NOT NULL DEFAULT 1,
    auth_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Characters (遊戲角色與資源) - 原 resources
CREATE TABLE public.characters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    server_name TEXT NOT NULL,
    character_name TEXT NOT NULL,
    level INTEGER DEFAULT 1,
    dispatch_current INTEGER DEFAULT 0,
    dispatch_max INTEGER DEFAULT 3,
    crystal INTEGER DEFAULT 0,
    zeny BIGINT DEFAULT 0,
    special_items JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
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
-- 設定 Row Level Security (RLS) 與 Policies
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authorization_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_queue ENABLE ROW LEVEL SECURITY;

-- 測試用：允許所有人讀寫所有表單 (正式環境應依照 auth.uid() 限制)
CREATE POLICY "Allow all profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all auth_codes" ON public.authorization_codes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all characters" ON public.characters FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all devices" ON public.devices_status FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all tasks" ON public.task_queue FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- 插入示範用的假資料 (Dummy Data)
-- ==========================================
-- 建立兩個使用者
INSERT INTO public.profiles (id, email, is_admin)
VALUES 
('11111111-1111-1111-1111-111111111111', 'player1@test.com', false),
('22222222-2222-2222-2222-222222222222', 'player2@test.com', false);

-- 給予使用者授權碼
INSERT INTO public.authorization_codes (user_id, code, allowed_devices)
VALUES 
('11111111-1111-1111-1111-111111111111', 'AUTH-P1-001', 2),
('22222222-2222-2222-2222-222222222222', 'AUTH-P2-001', 1);

-- 建立三個遊戲角色 (player1 有兩隻，player2 有一隻)
INSERT INTO public.characters (id, user_id, server_name, character_name, level, dispatch_current, dispatch_max, crystal, zeny, special_items)
VALUES 
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '金玉滿堂', '劍士波波', 45, 2, 3, 12000, 1500000, '[{"name": "波利卡片", "qty": 1, "quality": "rare"}, {"name": "神之金屬", "qty": 5, "quality": "normal"}]'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', '金玉滿堂', '法師莉莉', 42, 1, 3, 8500, 800000, '[]'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', '傾城之戰', '刺客阿薩', 50, 3, 3, 45000, 3200000, '[{"name": "黃金盜蟲卡片", "qty": 1, "quality": "epic"}]');

-- 建立設備狀態 (player1 正在掛機劍士波波，player2 正在掛機刺客阿薩)
INSERT INTO public.devices_status (id, user_id, character_id, device_index, current_task, logs)
VALUES 
('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, '自動打怪 - 普隆德拉原野', '2026-06-22 10:00:00 - 獲得 波利卡片\n2026-06-22 10:05:00 - 擊敗 波利 x10'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 1, '自動採集 - 礦坑', '2026-06-22 10:10:00 - 獲得 煤礦 x5');

-- 建立任務佇列
INSERT INTO public.task_queue (device_id, task_type, status)
VALUES 
('dddddddd-dddd-dddd-dddd-dddddddddddd', '回城購買藥水', 'pending'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '精煉裝備', 'pending');
