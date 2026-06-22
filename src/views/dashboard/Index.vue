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
        <div class="space-y-4">
          <div class="flex items-center justify-between border-b border-white/5 pb-3">
            <span class="text-ror-muted text-sm">註冊信箱</span>
            <span class="text-white font-medium">{{ userEmail }}</span>
          </div>
          <div class="flex items-center justify-between border-b border-white/5 pb-3">
            <span class="text-ror-muted text-sm">權限身份</span>
            <span class="font-bold flex items-center gap-1.5" :class="isAdminRole ? 'text-green-400' : 'text-blue-400'">
              <svg v-if="isAdminRole" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              {{ isAdminRole ? '系統管理員' : '一般使用者' }}
            </span>
          </div>
          <div class="flex items-center justify-between pb-1">
            <span class="text-ror-muted text-sm">註冊時間</span>
            <span class="text-white font-mono text-sm">{{ userCreatedDate }}</span>
          </div>
        </div>
      </div>

      <div class="bg-ror-card border border-ror-border rounded-xl p-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <h2 class="text-xl font-bold text-ror-accent">授權資訊</h2>
          
          <!-- 授權種類切換 Tabs -->
          <div class="flex space-x-1 bg-black/20 p-1 rounded-lg border border-white/5 overflow-x-auto hide-scrollbar">
            <button @click="selectedTab = 'daily'" :class="selectedTab === 'daily' ? 'bg-ror-surface text-white shadow-sm' : 'text-ror-muted hover:text-white'" class="px-3 py-1.5 text-xs rounded-md transition-colors whitespace-nowrap">日卡</button>
            <button @click="selectedTab = 'weekly'" :class="selectedTab === 'weekly' ? 'bg-ror-surface text-white shadow-sm' : 'text-ror-muted hover:text-white'" class="px-3 py-1.5 text-xs rounded-md transition-colors whitespace-nowrap">周卡</button>
            <button @click="selectedTab = 'monthly'" :class="selectedTab === 'monthly' ? 'bg-ror-surface text-white shadow-sm' : 'text-ror-muted hover:text-white'" class="px-3 py-1.5 text-xs rounded-md transition-colors whitespace-nowrap">月卡</button>
            <button v-if="isAdminRole" @click="selectedTab = 'infinite'" :class="selectedTab === 'infinite' ? 'bg-ror-accent/20 text-ror-accent shadow-sm ring-1 ring-ror-accent/30' : 'text-ror-muted hover:text-ror-accent'" class="px-3 py-1.5 text-xs rounded-md transition-colors font-bold whitespace-nowrap">尊榮無限卡</button>
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
              <p class="text-xs text-ror-muted mb-1">專屬授權碼：</p>
              <div class="bg-black/30 px-3 py-2 rounded border border-white/5 text-white select-all text-sm font-mono break-all font-semibold flex items-center justify-between group cursor-text">
                {{ currentLicense.code }}
                <svg v-if="currentLicense.code !== '尚未配發'" class="w-4 h-4 text-ror-muted group-hover:text-ror-accent opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              </div>
            </div>
            <div class="flex items-center justify-between border-t border-white/5 pt-2">
              <span class="text-xs text-ror-muted">自動續費狀態</span>
              <span v-if="currentLicense.code === '尚未配發'" class="text-xs text-ror-muted">--</span>
              <span v-else :class="currentLicense.autoRenew ? 'text-green-400 bg-green-400/10' : 'text-ror-muted bg-white/5'" class="font-bold text-[10px] px-2 py-0.5 rounded-full border" :class="currentLicense.autoRenew ? 'border-green-400/20' : 'border-white/5'">
                {{ currentLicense.autoRenew ? '已開啟' : '未開啟' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-ror-card border border-ror-border rounded-xl p-6">
        <h2 class="text-xl font-bold text-ror-accent mb-4">設備狀態</h2>
        <div class="flex gap-4 items-center">
          <div class="flex-1 bg-[#1a1a1a] rounded-lg p-5 text-center border border-white/5">
            <div class="text-3xl font-bold text-green-500 mb-1">0</div>
            <div class="text-sm text-ror-muted">當前在線數量</div>
          </div>
          <div class="flex-1 bg-[#1a1a1a] rounded-lg p-5 text-center border border-white/5">
            <div class="text-3xl font-bold text-ror-muted mb-1">{{ currentLicense.limit === '無上限' ? '∞' : (currentLicense.limit === 0 ? 0 : Math.max(0, currentLicense.limit - 0)) }}</div>
            <div class="text-sm text-ror-muted">剩餘可用額度</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { supabase } from '../../utils/supabase'
import { isAdminRole } from '../../utils/adminState'

const userEmail = ref('載入中...')
const userCreatedDate = ref('載入中...')

const selectedTab = ref('monthly')

// 預設空的授權狀態
const licenses = ref({
  daily: {
    days: 0,
    limit: 0,
    code: '尚未配發',
    autoRenew: false
  },
  weekly: {
    days: 0,
    limit: 0,
    code: '尚未配發',
    autoRenew: false
  },
  monthly: {
    days: 0,
    limit: 0,
    code: '尚未配發',
    autoRenew: false
  },
  infinite: {
    days: '無限',
    limit: '無上限',
    code: 'VIP-ADMIN-INFINITE',
    autoRenew: true
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

onMounted(async () => {
  if (isAdminRole.value) {
    selectedTab.value = 'infinite'
  }

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      userEmail.value = user.email || '未提供'
      userCreatedDate.value = new Date(user.created_at).toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' })
      
      // 這裡未來會從資料庫拉取三種卡片的授權碼。目前為了預告版面，我們先抓取舊表的第一筆資料做為示範填入月卡。
      const { data, error } = await supabase
        .from('authorization_codes')
        .select('code, allowed_devices')
        .eq('user_id', user.id)
      
      if (data && data.length > 0) {
        // Mock 範例資料，未來由後端提供
        licenses.value.monthly.code = data[0].code
        licenses.value.monthly.limit = data[0].allowed_devices
        licenses.value.monthly.days = 15 // 範例假資料
        licenses.value.monthly.autoRenew = false
      }
    }
  } catch (e) {
    console.error('Failed to load user or license info', e)
  }
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
