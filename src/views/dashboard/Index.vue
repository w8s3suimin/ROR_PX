<template>
  <div class="h-full pb-8">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          管理總覽
          <span v-if="isAdminRole" class="px-2.5 py-1 bg-green-500/10 text-green-400 text-sm rounded-lg border border-green-500/20 flex items-center gap-1.5 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            <span class="font-bold tracking-wider">管理員</span>
          </span>
        </h1>
        <p class="text-ror-muted mt-2">設備整體狀態總覽與授權資訊</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-ror-card border border-ror-border rounded-xl p-6">
        <h2 class="text-xl font-bold text-ror-accent mb-4">帳號資訊</h2>
        <div class="grid grid-cols-1 sm:grid-cols-[40%_60%] gap-6 sm:gap-0">
          <div class="flex justify-center sm:pr-8">
            <div class="w-36 sm:w-40 h-full bg-[#1a1a1a] rounded-xl p-4 flex flex-col items-center justify-center border border-white/5 relative overflow-hidden group">
              <div class="absolute inset-0 bg-ror-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="text-3xl font-bold text-ror-accent mb-1">{{ userPxp }}</div>
              <div class="text-xs text-ror-muted font-bold tracking-wider">PX點數</div>
            </div>
          </div>
          <div class="space-y-4 flex flex-col justify-center">
            <div class="flex items-center justify-between border-b border-white/5 pb-2">
              <span class="text-ror-muted text-sm flex-shrink-0">註冊信箱</span>
              <span class="text-white font-medium break-all text-right">{{ userEmail }}</span>
            </div>
            <div class="flex items-center justify-between border-b border-white/5 pb-2">
              <span class="text-ror-muted text-sm flex-shrink-0">權限身份</span>
              <span class="font-bold flex items-center gap-1.5 justify-end" :class="isAdminRole ? 'text-green-400' : 'text-blue-400'">
                <svg v-if="isAdminRole" class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                <svg v-else class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                {{ isAdminRole ? '系統管理員' : '一般使用者' }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-ror-muted text-sm flex-shrink-0">註冊時間</span>
              <span class="text-white font-mono text-sm text-right">{{ userCreatedDate }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-ror-card border border-ror-border rounded-xl p-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <h2 class="text-xl font-bold text-ror-accent">授權資訊</h2>
          
          <div class="flex w-full sm:w-auto space-x-1 bg-black/20 p-1 rounded-lg border border-white/5 overflow-x-auto hide-scrollbar">
            <button @click="selectedTab = 'daily'" :class="selectedTab === 'daily' ? 'bg-ror-accent/20 text-white font-bold shadow-sm ring-1 ring-ror-accent/30' : 'text-ror-muted hover:text-white'" class="flex-1 sm:flex-none px-3 py-1.5 text-xs rounded-md transition-colors whitespace-nowrap focus:outline-none text-center">日卡</button>
            <button @click="selectedTab = 'weekly'" :class="selectedTab === 'weekly' ? 'bg-ror-accent/20 text-white font-bold shadow-sm ring-1 ring-ror-accent/30' : 'text-ror-muted hover:text-white'" class="flex-1 sm:flex-none px-3 py-1.5 text-xs rounded-md transition-colors whitespace-nowrap focus:outline-none text-center">周卡</button>
            <button @click="selectedTab = 'monthly'" :class="selectedTab === 'monthly' ? 'bg-ror-accent/20 text-white font-bold shadow-sm ring-1 ring-ror-accent/30' : 'text-ror-muted hover:text-white'" class="flex-1 sm:flex-none px-3 py-1.5 text-xs rounded-md transition-colors whitespace-nowrap focus:outline-none text-center">月卡</button>
            <button v-if="isAdminRole" @click="selectedTab = 'infinite'" :class="selectedTab === 'infinite' ? 'bg-ror-accent/20 text-white font-bold shadow-sm ring-1 ring-ror-accent/30' : 'text-ror-muted hover:text-white'" class="flex-1 sm:flex-none px-3 py-1.5 text-xs rounded-md transition-colors font-bold whitespace-nowrap focus:outline-none text-center">尊榮 ∞ 卡</button>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center mt-2">
          <div class="flex gap-4 flex-1 w-full">
            <div class="flex-1 bg-[#1a1a1a] rounded p-4 text-center border border-white/5 relative overflow-hidden group">
              <div v-if="selectedTab === 'infinite'" class="absolute inset-0 bg-ror-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="text-2xl sm:text-3xl font-bold mb-1" :class="selectedTab === 'infinite' ? 'text-ror-accent' : 'text-yellow-500'">{{ currentLicense.days }}</div>
              <div class="text-xs text-ror-muted">剩餘天數</div>
            </div>
            <div class="flex-1 bg-[#1a1a1a] rounded p-4 text-center border border-white/5 relative overflow-hidden group">
               <div v-if="selectedTab === 'infinite'" class="absolute inset-0 bg-ror-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="text-2xl sm:text-3xl font-bold mb-1" :class="selectedTab === 'infinite' ? 'text-ror-accent' : 'text-blue-400'">{{ currentLicense.limit }}</div>
              <div class="text-xs text-ror-muted">在線數量上限</div>
            </div>
          </div>
          
          <div class="flex-1 w-full space-y-3 mt-4 sm:mt-0 px-2 bg-white/5 sm:bg-transparent rounded-lg p-3 sm:p-0 border border-white/5 sm:border-none">
            <div>
              <p class="text-xs text-ror-muted mb-1 flex items-center justify-between">
                <span>專屬授權碼：</span>
                <span v-if="copied" class="text-green-400 text-[10px] animate-pulse">已複製!</span>
              </p>
              <div @click="copyCode(currentLicense.code)" class="bg-black/30 px-3 py-2 rounded border border-white/5 text-white select-all text-sm font-mono break-all font-semibold flex items-center justify-between group cursor-pointer hover:border-ror-accent/50 transition-colors">
                {{ currentLicense.code }}
                <svg v-if="currentLicense.code !== '尚未配發'" class="w-4 h-4 text-ror-muted group-hover:text-ror-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              </div>
            </div>
            <div class="flex items-center justify-between border-t border-white/5 pt-2">
              <span class="text-xs text-ror-muted">自動續費狀態</span>
              <span v-if="currentLicense.code === '尚未配發'" class="text-xs text-ror-muted">--</span>
              <span v-else class="font-bold text-[10px] px-2 py-0.5 rounded-full border" :class="currentLicense.autoRenew ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-ror-muted bg-white/5 border-white/5'">
                {{ currentLicense.autoRenew ? '已開啟' : '未開啟' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-ror-card border border-ror-border rounded-xl p-6 md:col-span-2">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <h2 class="text-xl font-bold text-ror-accent">設備狀態</h2>
          <div class="flex w-full sm:w-auto space-x-1 bg-black/20 p-1 rounded-lg border border-white/5">
            <button @click="deviceStatusTab = 'overview'" :class="deviceStatusTab === 'overview' ? 'bg-ror-accent/20 text-white font-bold shadow-sm ring-1 ring-ror-accent/30' : 'text-ror-muted hover:text-white'" class="flex-1 sm:flex-none px-3 py-1.5 text-xs rounded-md transition-colors whitespace-nowrap text-center focus:outline-none">總覽</button>
            <button @click="deviceStatusTab = 'by_license'" :class="deviceStatusTab === 'by_license' ? 'bg-ror-accent/20 text-white font-bold shadow-sm ring-1 ring-ror-accent/30' : 'text-ror-muted hover:text-white'" class="flex-1 sm:flex-none px-3 py-1.5 text-xs rounded-md transition-colors whitespace-nowrap text-center focus:outline-none">依授權分類</button>
          </div>
        </div>

        <div v-if="deviceStatusTab === 'overview'" class="flex gap-4 items-center">
          <div class="flex-1 bg-[#1a1a1a] rounded-lg p-5 text-center border border-white/5">
            <div class="text-3xl font-bold text-green-500 mb-1">{{ deviceStats.totalOnline }}</div>
            <div class="text-sm text-ror-muted">總計在線數量</div>
          </div>
          <div class="flex-1 bg-[#1a1a1a] rounded-lg p-5 text-center border border-white/5">
            <div class="text-3xl font-bold text-red-500 mb-1">{{ deviceStats.totalOffline }}</div>
            <div class="text-sm text-ror-muted">總計離線數量</div>
          </div>
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div class="bg-[#1a1a1a] rounded-lg p-3 text-center border border-white/5 flex flex-col justify-center">
            <div class="text-2xl font-bold text-green-500 mb-0.5">{{ deviceStats.byLicense.daily }}</div>
            <div class="text-xs text-ror-muted">日卡 (在線)</div>
          </div>
          <div class="bg-[#1a1a1a] rounded-lg p-3 text-center border border-white/5 flex flex-col justify-center">
            <div class="text-2xl font-bold text-green-500 mb-0.5">{{ deviceStats.byLicense.weekly }}</div>
            <div class="text-xs text-ror-muted">周卡 (在線)</div>
          </div>
          <div class="bg-[#1a1a1a] rounded-lg p-3 text-center border border-white/5 flex flex-col justify-center">
            <div class="text-2xl font-bold text-green-500 mb-0.5">{{ deviceStats.byLicense.monthly }}</div>
            <div class="text-xs text-ror-muted">月卡 (在線)</div>
          </div>
          <div class="bg-[#1a1a1a] rounded-lg p-3 text-center border border-white/5 flex flex-col justify-center">
            <div class="text-2xl font-bold text-red-500 mb-0.5">{{ deviceStats.totalOffline }}</div>
            <div class="text-xs text-ror-muted">總離線</div>
          </div>
        </div>
      </div>
      
      <!-- 管理員專屬：手動派發/綁定/修改中心 -->
      <div v-if="isAdminRole" class="bg-ror-surface border-2 border-ror-accent/50 rounded-xl p-6 md:col-span-2 shadow-[0_0_20px_rgba(234,179,8,0.05)] mt-4">
        <h2 class="text-xl font-bold text-white mb-6 flex items-center">
          <svg class="w-6 h-6 mr-2 text-ror-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
          授權碼後台管理與派發中心
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <!-- 區塊1：產生新的授權碼 -->
          <div class="bg-black/30 rounded-xl p-5 border border-white/5">
            <h3 class="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">產生新授權碼 (手動派發用)</h3>
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
                  <input type="date" v-model="updateExpireDate" class="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ror-accent">
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { supabase } from '../../utils/supabase'
import { isAdminRole } from '../../utils/adminState'

const userEmail = ref('載入中...')
const userCreatedDate = ref('載入中...')
const userPxp = ref(0)

const selectedTab = ref('monthly')
const deviceStatusTab = ref('overview')

const copied = ref(false)
const copyCode = async (code) => {
  if (code === '尚未配發' || !code) return
  try {
    await navigator.clipboard.writeText(code)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (e) {
    console.error('Failed to copy', e)
  }
}

// 預設空的授權狀態
const licenses = ref({
  daily: { days: 0, limit: 0, code: '尚未配發', autoRenew: false },
  weekly: { days: 0, limit: 0, code: '尚未配發', autoRenew: false },
  monthly: { days: 0, limit: 0, code: '尚未配發', autoRenew: false },
  infinite: { days: '∞', limit: '∞', code: '尚未配發', autoRenew: true }
})

const deviceStats = ref({
  totalOnline: 0,
  totalOffline: 0,
  byLicense: {
    daily: 0,
    weekly: 0,
    monthly: 0,
    infinite: 0
  }
})

const currentLicense = computed(() => licenses.value[selectedTab.value] || licenses.value.monthly)

watch(isAdminRole, (newVal) => {
  if (newVal) {
    selectedTab.value = 'infinite'
  } else if (selectedTab.value === 'infinite') {
    selectedTab.value = 'monthly'
  }
})

const currentTime = ref(Date.now())
let timer = null
let fetchedDevices = []

const updateDeviceStats = () => {
  let online = 0
  let offline = 0
  const now = currentTime.value

  deviceStats.value.byLicense = { daily: 0, weekly: 0, monthly: 0, infinite: 0 }

  fetchedDevices.forEach(dev => {
    const isOffline = dev.is_offline || !dev.updated_at || (now - new Date(dev.updated_at).getTime() > 300000)
    if (!isOffline) {
      online++
      const planType = dev.authorization_codes?.plan_type
      if (planType && deviceStats.value.byLicense[planType] !== undefined) {
        deviceStats.value.byLicense[planType]++
      }
    } else {
      offline++
    }
  })

  deviceStats.value.totalOnline = online
  deviceStats.value.totalOffline = offline
}

onMounted(async () => {
  if (isAdminRole.value) {
    selectedTab.value = 'infinite'
  }

  timer = setInterval(() => {
    currentTime.value = Date.now()
    updateDeviceStats()
  }, 10000)

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      userEmail.value = user.email || '未提供'
      userCreatedDate.value = new Date(user.created_at).toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' })
      
      const { data: profile } = await supabase.from('profiles').select('pxp').eq('id', user.id).single()
      if (profile) {
        userPxp.value = profile.pxp || 0
      }
      
      const { data: licenseData } = await supabase
        .from('authorization_codes')
        .select('code, allowed_devices, plan_type, expires_at')
        .eq('user_id', user.id)
      
      if (licenseData && licenseData.length > 0) {
        licenseData.forEach(item => {
          const type = item.plan_type
          if (licenses.value[type]) {
            licenses.value[type].code = item.code
            if (type === 'infinite') {
              licenses.value[type].limit = '∞'
              licenses.value[type].days = '∞'
            } else {
              licenses.value[type].limit = item.allowed_devices
              if (item.expires_at) {
                const diffTime = Math.max(0, new Date(item.expires_at).getTime() - Date.now())
                licenses.value[type].days = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
              } else {
                licenses.value[type].days = 0
              }
            }
          }
        })
      }

      const { data: devData } = await supabase
        .from('devices_status')
        .select(`
          id, 
          updated_at, 
          is_offline,
          authorization_codes ( plan_type )
        `)
        .eq('user_id', user.id)
      
      if (devData) {
        fetchedDevices = devData
        updateDeviceStats()
      }
    }
  } catch (e) {
    console.error('Failed to load user or license info', e)
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

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
      p_allowed_devices: updateDevices.value ? parseInt(updateDevices.value) : null
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

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
