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
              <label class="block text-sm text-ror-muted mb-1">授權碼 (必填)</label>
              <input type="text" v-model="updateCode" placeholder="請輸入欲修改的授權碼..." class="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-ror-accent">
            </div>
            <div>
              <label class="block text-sm text-ror-muted mb-1">綁定至使用者信箱 (選填)</label>
              <input type="email" v-model="updateEmail" placeholder="留空則不更動原綁定..." class="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ror-accent">
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-ror-muted mb-1">重新指定到期日 (選填)</label>
                <div class="flex flex-col gap-2">
                  <input type="date" v-model="updateExpireDate" class="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ror-accent">
                  <div class="flex gap-2">
                    <button @click="quickAddDays(30)" class="flex-1 bg-white/10 hover:bg-white/20 text-xs py-1 rounded transition-colors">+月</button>
                    <button @click="quickAddDays(7)" class="flex-1 bg-white/10 hover:bg-white/20 text-xs py-1 rounded transition-colors">+周</button>
                    <button @click="quickAddDays(1)" class="flex-1 bg-white/10 hover:bg-white/20 text-xs py-1 rounded transition-colors">+日</button>
                  </div>
                </div>
              </div>
              <div>
                <label class="block text-sm text-ror-muted mb-1">重新指定上限 (選填)</label>
                <input type="number" v-model="updateDevices" placeholder="留空不改" class="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ror-accent" min="1">
              </div>
            </div>
            <button @click="updateAdminLicense" :disabled="isUpdating" class="w-full mt-2 bg-blue-500 text-white font-bold rounded-lg py-2 hover:bg-blue-600 transition-colors disabled:opacity-50">
              {{ isUpdating ? '更新中...' : '送出更新' }}
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
const isUpdating = ref(false)

const quickAddDays = async (days) => {
  if (!updateCode.value) {
    alert('請先輸入欲展延的授權碼');
    return;
  }
  isUpdating.value = true;
  try {
    const { data, error } = await supabase.rpc('admin_update_license', {
      p_code: updateCode.value,
      p_user_email: updateEmail.value || null,
      p_expires_at: null,
      p_allowed_devices: updateDevices.value ? parseInt(updateDevices.value) : null,
      p_add_days: days
    });
    
    if (error) throw error;
    if (!data.success) {
      alert(data.message);
    } else {
      alert(`成功展延 ${days} 天！`);
      updateCode.value = '';
      updateEmail.value = '';
      updateExpireDate.value = '';
      updateDevices.value = '';
    }
  } catch (err) {
    console.error(err);
    alert('更新失敗');
  } finally {
    isUpdating.value = false;
  }
}

const updateAdminLicense = async () => {
  if (!updateCode.value) {
    alert('請輸入授權碼');
    return;
  }
  isUpdating.value = true;
  
  try {
    let expiresAtStr = null;
    if (updateExpireDate.value) {
      // 轉成 ISO 時間字串
      expiresAtStr = new Date(updateExpireDate.value).toISOString();
    }
    
    const { data, error } = await supabase.rpc('admin_update_license', {
      p_code: updateCode.value,
      p_user_email: updateEmail.value || null,
      p_expires_at: expiresAtStr,
      p_allowed_devices: updateDevices.value ? parseInt(updateDevices.value) : null,
      p_add_days: null
    });
    
    if (error) throw error;
    if (!data.success) {
      alert(data.message);
    } else {
      alert('更新成功');
      updateCode.value = '';
      updateEmail.value = '';
      updateExpireDate.value = '';
      updateDevices.value = '';
    }
  } catch (err) {
    console.error(err);
    alert('更新失敗');
  } finally {
    isUpdating.value = false;
  }
}
</script>
