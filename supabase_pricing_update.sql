-- 1. 新增 PXP 欄位與 expires_at 欄位
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pxp INTEGER DEFAULT 0;
ALTER TABLE public.authorization_codes ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

-- 2. 建立隨機字串產生器
CREATE OR REPLACE FUNCTION public.generate_random_alphanumeric(length integer) 
RETURNS text AS $$
DECLARE
    chars text[] := '{0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z}';
    result text := '';
    i integer := 0;
BEGIN
    FOR i IN 1..length LOOP
        result := result || chars[1+random()*(array_length(chars, 1)-1)];
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- 3. 購買授權碼 RPC
CREATE OR REPLACE FUNCTION public.purchase_license(
    p_plan_type TEXT,
    p_cost INTEGER,
    p_prefix TEXT,
    p_days INTEGER
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_current_pxp INTEGER;
    v_new_code TEXT;
    v_is_unique BOOLEAN := false;
    v_expires_at TIMESTAMP WITH TIME ZONE;
    v_exists BOOLEAN;
BEGIN
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', false, 'message', '請先登入');
    END IF;

    -- 檢查是否已擁有該方案的授權碼
    SELECT EXISTS(
        SELECT 1 FROM public.authorization_codes 
        WHERE user_id = v_user_id AND plan_type = p_plan_type
    ) INTO v_exists;
    
    IF v_exists THEN
        RETURN json_build_object('success', false, 'message', '您已開通此方案，無法重複購買');
    END IF;

    -- 鎖定 profiles 表以防並發扣款
    SELECT pxp INTO v_current_pxp FROM public.profiles WHERE id = v_user_id FOR UPDATE;

    IF v_current_pxp < p_cost THEN
        RETURN json_build_object('success', false, 'message', '餘額不足');
    END IF;

    -- 扣款
    UPDATE public.profiles SET pxp = pxp - p_cost WHERE id = v_user_id;

    -- 產生唯一亂數授權碼
    WHILE NOT v_is_unique LOOP
        v_new_code := p_prefix || public.generate_random_alphanumeric(12);
        IF NOT EXISTS (SELECT 1 FROM public.authorization_codes WHERE code = v_new_code) THEN
            v_is_unique := true;
        END IF;
    END LOOP;

    -- 計算到期日
    v_expires_at := now() + (p_days || ' days')::interval;

    -- 新增授權碼
    INSERT INTO public.authorization_codes (user_id, code, plan_type, allowed_devices, expires_at)
    VALUES (v_user_id, v_new_code, p_plan_type, 1, v_expires_at);

    RETURN json_build_object(
        'success', true, 
        'message', '購買成功', 
        'code', v_new_code,
        'remaining_pxp', v_current_pxp - p_cost
    );
END;
$$;

-- 4. 管理員產生授權碼 RPC (未綁定)
CREATE OR REPLACE FUNCTION public.generate_admin_license(
    p_plan_type TEXT,
    p_prefix TEXT,
    p_days INTEGER,
    p_devices INTEGER
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_new_code TEXT;
    v_is_unique BOOLEAN := false;
    v_expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
    -- 檢查管理員權限
    IF NOT public.is_admin() THEN
        RETURN json_build_object('success', false, 'message', '權限不足');
    END IF;

    WHILE NOT v_is_unique LOOP
        v_new_code := p_prefix || public.generate_random_alphanumeric(12);
        IF NOT EXISTS (SELECT 1 FROM public.authorization_codes WHERE code = v_new_code) THEN
            v_is_unique := true;
        END IF;
    END LOOP;

    v_expires_at := now() + (p_days || ' days')::interval;

    -- 寫入但不綁定 user_id (null)
    INSERT INTO public.authorization_codes (user_id, code, plan_type, allowed_devices, expires_at)
    VALUES (NULL, v_new_code, p_plan_type, p_devices, v_expires_at);

    RETURN json_build_object(
        'success', true,
        'message', '產生成功',
        'code', v_new_code
    );
END;
$$;

-- 5. 管理員手動指派與更新授權碼 RPC
CREATE OR REPLACE FUNCTION public.admin_update_license(
    p_code TEXT,
    p_user_email TEXT, -- 若有值則嘗試綁定到該信箱的帳戶
    p_expires_at TIMESTAMP WITH TIME ZONE,
    p_allowed_devices INTEGER,
    p_add_days INTEGER DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_target_user_id UUID := NULL;
    v_license_record RECORD;
    v_new_expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
    IF NOT public.is_admin() THEN
        RETURN json_build_object('success', false, 'message', '權限不足');
    END IF;

    SELECT * INTO v_license_record FROM public.authorization_codes WHERE code = p_code;
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'message', '找不到該授權碼');
    END IF;

    -- 如果有提供 Email，找出對應的使用者 ID
    IF p_user_email IS NOT NULL AND trim(p_user_email) <> '' THEN
        SELECT id INTO v_target_user_id FROM public.profiles WHERE email = trim(p_user_email);
        IF v_target_user_id IS NULL THEN
            RETURN json_build_object('success', false, 'message', '找不到該信箱的帳號');
        END IF;
    ELSE
        -- 保留原本綁定的 user_id
        v_target_user_id := v_license_record.user_id;
    END IF;

    -- 計算到期日
    IF p_add_days IS NOT NULL THEN
        IF v_license_record.expires_at > now() THEN
            -- 尚未到期，從原到期日往後加
            v_new_expires_at := v_license_record.expires_at + (p_add_days || ' days')::interval;
        ELSE
            -- 已到期或原本沒有到期日，從現在起算
            v_new_expires_at := now() + (p_add_days || ' days')::interval;
        END IF;
    ELSE
        -- 若沒有指定增加天數，則套用指定絕對時間，或者保留原本時間
        v_new_expires_at := COALESCE(p_expires_at, v_license_record.expires_at);
    END IF;

    UPDATE public.authorization_codes 
    SET 
        user_id = v_target_user_id,
        expires_at = v_new_expires_at,
        allowed_devices = COALESCE(p_allowed_devices, allowed_devices),
        updated_at = now()
    WHERE code = p_code;

    RETURN json_build_object('success', true, 'message', '更新成功');
END;
$$;
