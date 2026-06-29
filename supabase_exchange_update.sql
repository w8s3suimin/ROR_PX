-- 1. 確保 profiles 有 Exchange_Name 欄位
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS "Exchange_Name" TEXT;

-- 2. 建立交易所標的表 (Targets)
CREATE TABLE public.exchange_targets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true, -- 管理員可切換為 false，非管理員將看不見
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. 建立交易所班表表單 (Schedules)
-- 每一筆資料代表一個標的在某一個「基準日」的排班狀況
-- base_date 對應到 A 的日期，例如 5/31
CREATE TABLE public.exchange_schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    target_id UUID REFERENCES public.exchange_targets(id) ON DELETE CASCADE,
    base_date DATE NOT NULL,
    -- 紀錄 8 個時段的操作資料，存放格式為 JSONB，例如：
    -- { 
    --   "A21-24": { "user_id": "uuid-xxx", "status": "📈", "updated_at": "..." },
    --   "B00-06": { "user_id": "uuid-yyy", "status": "📈", "updated_at": "..." }
    -- }
    slots_data JSONB DEFAULT '{}'::jsonb, 
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(target_id, base_date)
);

-- ==========================================
-- 設定 Row Level Security (RLS) 與 Policies
-- ==========================================

-- 檢查是否為交易所成員或管理員的輔助函數
CREATE OR REPLACE FUNCTION public.is_exchange_member_or_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (SELECT "Exchange_Member" OR is_admin FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$ LANGUAGE sql SECURITY DEFINER;

ALTER TABLE public.exchange_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_schedules ENABLE ROW LEVEL SECURITY;

-- Exchange Targets Policies
-- 查詢：管理員可看全部，成員只能看 is_active = true 的
CREATE POLICY "Targets view policy" ON public.exchange_targets FOR SELECT 
USING ( public.is_admin() OR (public.is_exchange_member_or_admin() AND is_active = true) );

-- 新增/修改/刪除：僅限管理員
CREATE POLICY "Targets insert policy" ON public.exchange_targets FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Targets update policy" ON public.exchange_targets FOR UPDATE USING (public.is_admin());
CREATE POLICY "Targets delete policy" ON public.exchange_targets FOR DELETE USING (public.is_admin());

-- Exchange Schedules Policies
-- 查詢與修改：允許交易所成員與管理員
CREATE POLICY "Schedules view policy" ON public.exchange_schedules FOR SELECT 
USING ( public.is_exchange_member_or_admin() );
CREATE POLICY "Schedules insert policy" ON public.exchange_schedules FOR INSERT 
WITH CHECK ( public.is_exchange_member_or_admin() );
CREATE POLICY "Schedules update policy" ON public.exchange_schedules FOR UPDATE 
USING ( public.is_exchange_member_or_admin() );
CREATE POLICY "Schedules delete policy" ON public.exchange_schedules FOR DELETE 
USING ( public.is_admin() );

-- 寫入範例資料 (可選)
-- INSERT INTO public.exchange_targets (name) VALUES ('阿修羅');
