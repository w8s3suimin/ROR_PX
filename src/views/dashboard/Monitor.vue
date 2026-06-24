<template>
  <div v-if="viewAsAdmin" class="animate-fade-in">
    <!-- Header -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-white tracking-tight">設備監控</h1>
        <p class="text-ror-muted mt-1">即時同步資源、等級、目前任務與日誌</p>
      </div>
      <div class="flex gap-4">
        <div class="bg-[#1a1a1a] border border-ror-border rounded px-4 py-2 flex items-center">
          <div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span class="text-sm font-medium">在線: {{ onlineCount }} / {{ devices.length }}</span>
        </div>
      </div>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div v-for="dev in devices" :key="dev.id" class="rounded-xl p-4 flex flex-col gap-3 hover:border-ror-accent transition-all duration-300 group" :class="isOnline(dev) ? 'bg-ror-card border border-ror-border opacity-100 shadow-[0_4px_20px_rgba(0,0,0,0.5)]' : 'bg-black/80 border border-white/5 opacity-50 grayscale-[30%]'">
        <!-- Header -->
        <div class="flex justify-between items-center border-b border-ror-border/50 pb-2">
          <div class="flex items-center gap-2">
            <span class="text-white font-bold tracking-wider">設備 #{{ dev.device_index }}</span>
            <span v-if="isOnline(dev)" class="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">在線</span>
            <span v-else class="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">離線</span>
          </div>
        </div>

        <!-- Status Details -->
        <div class="flex-1 space-y-3 mt-3">

          <div class="flex items-center">
            <span class="text-white font-bold text-base w-20 flex-shrink-0 tracking-wide">目標帳號</span>
            <span class="text-gray-400 text-[15px] font-mono truncate ml-2">{{ dev.characters?.game_account || '未知' }}</span>
          </div>
          <div class="flex items-center">
            <span class="text-white font-bold text-base w-20 flex-shrink-0 tracking-wide">目標角色</span>
            <span class="text-gray-400 text-[15px] truncate ml-2">{{ dev.characters?.server_name || '未知' }}-角{{ dev.characters?.char_slot || '?' }}</span>
          </div>
          <div class="flex items-center">
            <span class="text-white font-bold text-base w-20 flex-shrink-0 tracking-wide">目前任務</span>
            <span class="text-ror-accent text-[15px] font-bold truncate ml-2" :title="dev.current_task">{{ isOnline(dev) ? (dev.current_task || '閒置中') : '-' }}</span>
          </div>
          <div class="flex justify-end text-xs mt-4 pt-2 border-t border-ror-border/30 text-gray-500 font-mono tracking-wide">
            updated at {{ formatTime24H(dev.updated_at) }}
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="devices.length === 0" class="col-span-full py-12 text-center border-2 border-dashed border-ror-border rounded-xl">
        <p class="text-ror-muted">目前沒有設備資料</p>
      </div>
    </div>
  </div>

  <UnderDevelopment 
    v-else
    title="設備監控頁面<span class='text-blue-400'>開發中</span>"
    description="我們正在努力為您打造視覺化的設備監控頁面。目前正在趕工中，敬請期待！"
  />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { supabase } from '../../utils/supabase.js'
import { viewAsAdmin } from '../../utils/adminState'
import UnderDevelopment from '../../components/common/UnderDevelopment.vue'

const devices = ref([])
const authCode = ref('載入中...')
const currentTime = ref(Date.now())
let timer = null

const isOnline = (dev) => {
  if (!dev || !dev.updated_at) return false
  const lastUpdate = new Date(dev.updated_at).getTime()
  // 2.5 minutes = 150000 ms
  return (currentTime.value - lastUpdate) <= 150000
}

const onlineCount = computed(() => {
  return devices.value.filter(dev => isOnline(dev)).length
})

onMounted(async () => {
  // Update current time every second to re-evaluate online status dynamically
  timer = setInterval(() => {
    currentTime.value = Date.now()
  }, 10000) // update every 10 seconds to save performance

  // Fetch auth code for the current user
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: codes } = await supabase
      .from('authorization_codes')
      .select('code')
      .eq('user_id', user.id)
      .limit(1)
    if (codes && codes.length > 0) {
      authCode.value = codes[0].code
    } else {
      authCode.value = '無授權碼'
    }
  }

  // Fetch devices and their linked character info
  const { data, error } = await supabase
    .from('devices_status')
    .select(`
      id,
      device_index,
      current_task,
      updated_at,
      characters (
        game_account,
        server_name,
        char_slot,
        character_name,
        level,
        crystal
      )
    `)
    .order('device_index', { ascending: true })

  if (data) {
    devices.value = data
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

function formatTime24H(timestamp) {
  if (!timestamp) return '未知'
  const d = new Date(timestamp)
  const pad = (n) => n.toString().padStart(2, '0')
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
</script>
