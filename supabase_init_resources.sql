-- 建立資源管理表
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    account_name TEXT NOT NULL,
    server_name TEXT NOT NULL,
    char_slot INTEGER NOT NULL CHECK (char_slot >= 1 AND char_slot <= 3),
    level INTEGER DEFAULT 1,
    dispatch_current INTEGER DEFAULT 0,
    dispatch_max INTEGER DEFAULT 3,
    crystal INTEGER DEFAULT 0,
    zeny BIGINT DEFAULT 0,
    special_items JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 設定 Row Level Security (RLS)
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- 允許所有人讀取（測試與展示用，後續可依需改成只有 authenticated 使用者可讀取）
CREATE POLICY "Allow read access for all users" ON public.resources
    FOR SELECT USING (true);

-- 允許所有人插入/更新（測試用）
CREATE POLICY "Allow insert for all users" ON public.resources
    FOR INSERT WITH CHECK (true);
    
CREATE POLICY "Allow update for all users" ON public.resources
    FOR UPDATE USING (true);

-- 插入一些示範用的假資料
INSERT INTO public.resources (account_name, server_name, char_slot, level, dispatch_current, dispatch_max, crystal, zeny, special_items)
VALUES 
('ROR_01', '金玉滿堂', 1, 45, 2, 3, 12000, 1500000, '[{"name": "波利卡片", "qty": 1, "quality": "rare"}, {"name": "神之金屬", "qty": 5, "quality": "normal"}]'),
('ROR_01', '金玉滿堂', 2, 42, 1, 3, 8500, 800000, '[]'),
('ROR_02', '傾城之戰', 1, 50, 3, 3, 45000, 3200000, '[{"name": "黃金盜蟲卡片", "qty": 1, "quality": "epic"}]'),
('ROR_03', '普隆德拉', 1, 38, 0, 3, 2000, 450000, '[{"name": "鋁", "qty": 10, "quality": "normal"}]');
