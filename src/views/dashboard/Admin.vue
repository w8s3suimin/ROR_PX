<template>
  <div class="h-full pb-8">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          後台管理
          <span class="px-2.5 py-1 bg-green-500/10 text-green-400 text-sm rounded-lg border border-green-500/20 flex items-center gap-1.5 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            <span class="font-bold tracking-wider">管理員限定</span>
          </span>
        </h1>
        <p class="text-ror-muted mt-2">授權碼後台管理與派發中心</p>
      </div>
    </div>

    <div class="bg-ror-surface border-2 border-ror-accent/50 rounded-xl p-6 shadow-[0_0_20px_rgba(234,179,8,0.05)]">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- 區塊1：產生新的授權碼 -->
        <div class="bg-black/30 rounded-xl p-5 border border-white/5">
          <h3 class="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">產生新授權碼</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-ror-muted mb-1">方案類型</label>
              <select v-model="genPlan" @change="onGenPlanChange" class="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ror-accent">
                <option value="daily">日卡 (PXD)</option>
                <option value="weekly">周卡 (PXW)</option>
                <option value="monthly">月卡 (PXM)</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-ror-muted mb-1">授權天數</label>
                <input type="number" v-model="genDays" class="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ror-accent" min="1">
              </div>
              <div>
                <label class="block text-sm text-ror-muted mb-1">機台上限</label>
                <input type="number" v-model="genDevices" class="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ror-accent" min="1">
              </div>
            </div>
            <button @click="generateAdminLicense" :disabled="isGenerating" class="w-full mt-2 bg-ror-accent text-black font-bold rounded-lg py-2 hover:bg-ror-accent/90 transition-colors disabled:opacity-50">
              {{ isGenerating ? '產生中...' : '產生授權碼' }}
            </button>
            
            <div v-if="generatedCode" class="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-center cursor-pointer hover:bg-green-500/20 transition-colors" @click="copyCode(generatedCode)">
              <div class="text-xs text-green-400 mb-1">成功產生 (點擊複製)</div>
              <div class="text-white font-mono font-bold tracking-wider">{{ generatedCode }}</div>
            </div>
          </div>
        </div>
        
        <!-- 區塊2：手動綁定與調整 -->
        <div class="bg-black/30 rounded-xl p-5 border border-white/5">
          <h3 class="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">調整與綁定現有授權碼</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-ror-muted mb-1">授權碼</label>
              <div class="flex gap-2">
                <div class="relative flex-1">
                  <input type="text" v-model="updateCode" placeholder="請輸入欲修改的授權碼..." class="w-full bg-[#1a1a1a] border border-white/10 rounded-lg pl-3 pr-10 py-2 text-white font-mono focus:outline-none focus:border-ror-accent">
                  <button v-if="isCodeVerified" @click="verifyCode" class="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors focus:outline-none" title="重新讀取資料 (復原修改)">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                  </button>
                </div>
                <button @click="verifyCode" :disabled="isValidating || isCodeVerified" :class="isCodeVerified ? 'bg-white/10 text-white opacity-50 cursor-not-allowed' : 'bg-yellow-500 text-black hover:bg-yellow-400 font-bold'" class="px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                  {{ isValidating ? '驗證中...' : '驗證' }}
                </button>
              </div>
            </div>
            <div>
              <label class="block text-sm text-ror-muted mb-1">綁定至使用者信箱</label>
              <input type="email" v-model="updateEmail" placeholder="輸入使用者信箱..." class="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ror-accent">
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-ror-muted mb-1">重新指定到期日</label>
                <div class="flex flex-col gap-2">
                  <input v-if="!pendingExtensionText" type="datetime-local" step="1" v-model="updateExpireDate" class="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ror-accent">
                  <div v-else class="w-full bg-[#1a1a1a] border border-yellow-500/50 rounded-lg px-3 py-2 text-yellow-500 font-bold flex items-center justify-between">
                    <span>{{ pendingExtensionText }}</span>
                    <button @click="cancelPending" class="text-xs text-ror-muted hover:text-white underline">取消</button>
                  </div>
                  
                  <div class="flex gap-2">
                    <button @click="quickAddDays(30, 'monthly')" :disabled="!canExtend('monthly')" :class="canExtend('monthly') ? 'bg-yellow-500 text-black hover:bg-yellow-400 font-bold' : 'bg-white/5 text-white/30 cursor-not-allowed'" class="flex-1 text-xs py-1.5 rounded transition-colors">+月</button>
                    <button @click="quickAddDays(7, 'weekly')" :disabled="!canExtend('weekly')" :class="canExtend('weekly') ? 'bg-yellow-500 text-black hover:bg-yellow-400 font-bold' : 'bg-white/5 text-white/30 cursor-not-allowed'" class="flex-1 text-xs py-1.5 rounded transition-colors">+周</button>
                    <button @click="quickAddDays(1, 'daily')" :disabled="!canExtend('daily')" :class="canExtend('daily') ? 'bg-yellow-500 text-black hover:bg-yellow-400 font-bold' : 'bg-white/5 text-white/30 cursor-not-allowed'" class="flex-1 text-xs py-1.5 rounded transition-colors">+日</button>
                  </div>
                </div>
              </div>
              <div>
                <label class="block text-sm text-ror-muted mb-1">重新指定上限</label>
                <input type="number" v-model="updateDevices" placeholder="留空不改" class="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ror-accent" min="1">
              </div>
            </div>
            
            <button @click="updateAdminLicense" :disabled="isUpdating || !isCodeVerified" :class="isCodeVerified ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-white/5 text-white/30 cursor-not-allowed'" class="w-full py-2.5 rounded-lg font-bold transition-colors">
              {{ isUpdating ? '處理中...' : '送出更新' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../utils/supabase'
import { isAdminRole } from '../../utils/adminState'

const router = useRouter()

onMounted(async () => {
  // 防護機制，雙重確認為 Admin 否則踢回 Dashboard
  if (!isAdminRole.value) {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).single()
      if (!profile || !profile.is_admin) {
        router.push('/dashboard')
      }
    } else {
      router.push('/login')
    }
  }
})

const copyCode = async (code) => {
  if (!code) return
  try {
    await navigator.clipboard.writeText(code)
    alert('已複製!')
  } catch (e) {
    console.error('Failed to copy', e)
  }
}

// === Admin 授權碼產生與修改邏輯 ===
const genPlan = ref('monthly')
const genDays = ref(30)
const genDevices = ref(1)
const generatedCode = ref('')
const isGenerating = ref(false)

const onGenPlanChange = () => {
  if (genPlan.value === 'daily') { genDays.value = 1; }
  else if (genPlan.value === 'weekly') { genDays.value = 7; }
  else if (genPlan.value === 'monthly') { genDays.value = 30; }
}

const generateAdminLicense = async () => {
  if (!genDays.value || !genDevices.value) {
    alert('請填寫完整資訊');
    return;
  }
  isGenerating.value = true;
  generatedCode.value = '';
  
  let prefix = 'PXM-';
  if (genPlan.value === 'daily') prefix = 'PXD-';
  if (genPlan.value === 'weekly') prefix = 'PXW-';
  
  try {
    const { data, error } = await supabase.rpc('generate_admin_license', {
      p_plan_type: genPlan.value,
      p_prefix: prefix,
      p_days: genDays.value,
      p_devices: genDevices.value
    });
    
    if (error) throw error;
    if (!data.success) {
      alert(data.message);
    } else {
      generatedCode.value = data.code;
    }
  } catch (err) {
    console.error(err);
    alert('產生失敗');
  } finally {
    isGenerating.value = false;
  }
}

const updateCode = ref('')
const updateEmail = ref('')
const updateExpireDate = ref('')
const updateDevices = ref('')
const updatePlanType = ref('')
const isUpdating = ref(false)
const isValidating = ref(false)
const pendingExtensionText = ref('')
const pendingDaysToAdd = ref(0)
const verifiedCode = ref('')

const isCodeVerified = computed(() => {
  return updateCode.value.trim() !== '' && updateCode.value === verifiedCode.value;
});

const canExtend = (targetPlan) => {
  if (!isCodeVerified.value || !updatePlanType.value) return false;
  return updatePlanType.value === targetPlan;
}

const cancelPending = () => {
  pendingExtensionText.value = '';
  pendingDaysToAdd.value = 0;
  // 嘗試恢復先前的到期日（如果有存在 updateExpireDate 內）
}

const formatDatetimeLocal = (date) => {
  const pad = (n) => n.toString().padStart(2, '0')
  const YYYY = date.getFullYear()
  const MM = pad(date.getMonth() + 1)
  const DD = pad(date.getDate())
  const hh = pad(date.getHours())
  const mm = pad(date.getMinutes())
  const ss = pad(date.getSeconds())
  return `${YYYY}-${MM}-${DD}T${hh}:${mm}:${ss}`
}

const verifyCode = async () => {
  if (!updateCode.value) {
    alert('請輸入授權碼'); return;
  }
  isValidating.value = true;
  try {
    const { data: license, error } = await supabase
      .from('authorization_codes')
      .select(`
        *,
        profiles ( email )
      `)
      .eq('code', updateCode.value)
      .single()
      
    if (error || !license) {
      alert('找不到該授權碼');
      return;
    }
    
    updatePlanType.value = license.plan_type;
    updateEmail.value = license.profiles ? license.profiles.email : '';
    updateDevices.value = license.allowed_devices;
    pendingExtensionText.value = '';
    pendingDaysToAdd.value = 0;
    verifiedCode.value = updateCode.value;
    
    if (license.expires_at) {
      updateExpireDate.value = formatDatetimeLocal(new Date(license.expires_at));
    } else {
      updateExpireDate.value = '';
    }
  } catch(e) {
    console.error(e)
    alert('驗證發生錯誤')
  } finally {
    isValidating.value = false;
  }
}

const quickAddDays = (days, plan) => {
  if (updatePlanType.value !== plan) return;
  
  let baseDate;
  if (updateExpireDate.value) {
    baseDate = new Date(updateExpireDate.value);
    // 如果已經到期
    if (baseDate.getTime() < Date.now()) {
      pendingExtensionText.value = `下次執行起 +${days} 天`;
      pendingDaysToAdd.value = days;
      return;
    }
  } else {
    // 若原本沒有到期日
    pendingExtensionText.value = `下次執行起 +${days} 天`;
    pendingDaysToAdd.value = days;
    return;
  }
  
  // 尚未到期的情況，直接往後加
  baseDate.setDate(baseDate.getDate() + days);
  updateExpireDate.value = formatDatetimeLocal(baseDate);
  pendingExtensionText.value = '';
  pendingDaysToAdd.value = 0;
}

const updateAdminLicense = async () => {
  if (!updateCode.value) {
    alert('請輸入授權碼');
    return;
  }
  isUpdating.value = true;
  
  try {
    let expiresAtStr = null;
    
    // 如果是「下次執行起 +N 天」的模式
    if (pendingExtensionText.value && pendingDaysToAdd.value > 0) {
      // 由於目前資料庫無法記錄「等待下次腳本執行」，我們只能在此刻直接將到期日設為 Now() + N天
      const now = new Date();
      now.setDate(now.getDate() + pendingDaysToAdd.value);
      expiresAtStr = now.toISOString();
    } else if (updateExpireDate.value) {
      expiresAtStr = new Date(updateExpireDate.value).toISOString();
    }
    
    const { data, error } = await supabase.rpc('admin_update_license', {
      p_code: updateCode.value,
      p_user_email: updateEmail.value || null,
      p_expires_at: expiresAtStr,
      p_allowed_devices: updateDevices.value ? parseInt(updateDevices.value) : null
    });
    
    if (error) throw error;
    if (!data.success) {
      alert(data.message);
    } else {
      alert('更新成功！');
      updateCode.value = '';
      updateEmail.value = '';
      updateExpireDate.value = '';
      updateDevices.value = '';
      updatePlanType.value = '';
      pendingExtensionText.value = '';
      pendingDaysToAdd.value = 0;
      verifiedCode.value = '';
    }
  } catch (err) {
    console.error(err);
    alert('更新失敗');
  } finally {
    isUpdating.value = false;
  }
}
</script>
