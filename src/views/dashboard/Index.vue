<template>
  <div class="h-full">
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
        <div class="grid grid-cols-1 sm:grid-cols-[40%_60%] gap-6 sm:gap-0 h-full">
          <div class="flex items-center justify-center h-full sm:pr-8">
            <div class="w-36 sm:w-40 bg-[#1a1a1a] rounded-xl p-4 flex flex-col items-center justify-center border border-white/5 relative overflow-hidden group">
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
          
          <!-- 授權種類切換 Tabs -->
          <div class="flex space-x-1 bg-black/20 p-1 rounded-lg border border-white/5 overflow-x-auto hide-scrollbar">
            <button @click="selectedTab = 'daily'" :class="selectedTab === 'daily' ? 'bg-ror-accent/20 text-ror-accent shadow-sm ring-1 ring-ror-accent/30' : 'text-ror-muted hover:text-ror-accent'" class="px-3 py-1.5 text-xs rounded-md transition-colors whitespace-nowrap focus:outline-none">日卡</button>
            <button @click="selectedTab = 'weekly'" :class="selectedTab === 'weekly' ? 'bg-ror-accent/20 text-ror-accent shadow-sm ring-1 ring-ror-accent/30' : 'text-ror-muted hover:text-ror-accent'" class="px-3 py-1.5 text-xs rounded-md transition-colors whitespace-nowrap focus:outline-none">周卡</button>
            <button @click="selectedTab = 'monthly'" :class="selectedTab === 'monthly' ? 'bg-ror-accent/20 text-ror-accent shadow-sm ring-1 ring-ror-accent/30' : 'text-ror-muted hover:text-ror-accent'" class="px-3 py-1.5 text-xs rounded-md transition-colors whitespace-nowrap focus:outline-none">月卡</button>
            <button v-if="isAdminRole" @click="selectedTab = 'infinite'" :class="selectedTab === 'infinite' ? 'bg-ror-accent/20 text-ror-accent shadow-sm ring-1 ring-ror-accent/30' : 'text-ror-muted hover:text-ror-accent'" class="px-3 py-1.5 text-xs rounded-md transition-colors font-bold whitespace-nowrap focus:outline-none">尊榮 ∞ 卡</button>
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

      <div class="bg-ror-card border border-ror-border rounded-xl p-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <h2 class="text-xl font-bold text-ror-accent">設備狀態</h2>
          <div class="flex space-x-1 bg-black/20 p-1 rounded-lg border border-white/5">
            <button @click="deviceStatusTab = 'overview'" :class="deviceStatusTab === 'overview' ? 'bg-ror-surface text-white shadow-sm' : 'text-ror-muted hover:text-white'" class="px-3 py-1.5 text-xs rounded-md transition-colors whitespace-nowrap">總覽</button>
            <button @click="deviceStatusTab = 'by_license'" :class="deviceStatusTab === 'by_license' ? 'bg-ror-surface text-white shadow-sm' : 'text-ror-muted hover:text-white'" class="px-3 py-1.5 text-xs rounded-md transition-colors whitespace-nowrap">依授權分類</button>
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

        <div v-else class="grid grid-cols-4 gap-3">
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
  if (code === '尚未配發') return
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

// 當管理員狀態改變時，如果是管理員就自動切換到尊榮卡展示
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
  }, 10000) // 10 seconds

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
        .select('code, allowed_devices, plan_type')
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
              licenses.value[type].days = 15 // Mock data
            }
          }
        })
      }

      // Fetch devices to calculate online/offline stats
      const { data: devData } = await supabase
        .from('devices_status')
        .select(`
          id, 
          updated_at, 
          is_offline,
          authorization_codes ( plan_type )
        `)
      
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
