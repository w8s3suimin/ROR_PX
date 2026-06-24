<template>
  <div class="animate-fade-in">
    <!-- Header -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-white tracking-tight">設備監控</h1>
        <p class="text-ror-muted mt-1">即時同步設備、目前任務的狀態顯示</p>
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
      <div v-for="dev in sortedDevices" :key="dev.id" class="rounded-xl p-4 flex flex-col gap-3 hover:border-ror-accent transition-all duration-300 group" :class="getDeviceStatus(dev) !== 'offline' ? 'bg-ror-card border border-ror-border opacity-100 shadow-[0_4px_20px_rgba(0,0,0,0.5)]' : 'bg-black/80 border border-gray-600 opacity-50 grayscale-[30%]'">
        <!-- Header -->
        <div class="flex justify-between items-center border-b border-ror-border/50 pb-2">
          <div class="flex items-center gap-2">
            <span class="text-white font-bold tracking-wider">設備 #{{ dev.device_index }}</span>
            <span v-if="getDeviceStatus(dev) === 'online'" class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              運行中
            </span>
            <span v-else-if="getDeviceStatus(dev) === 'paused'" class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              暫停中
            </span>
            <span v-else class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              離線中
            </span>
          </div>
        </div>

        <!-- Status Details -->
        <div class="flex-1 space-y-3 mt-3">

          <div class="flex items-center">
            <span class="text-white font-bold text-base w-20 flex-shrink-0 tracking-wide">目標帳號</span>
            <span class="text-gray-400 text-[15px] font-mono truncate ml-2">{{ getDeviceStatus(dev) !== 'offline' && !dev.character_id ? '單角色模式' : (dev.characters?.game_account || '未知') }}</span>
          </div>
          <div class="flex items-center">
            <span class="text-white font-bold text-base w-20 flex-shrink-0 tracking-wide">目標角色</span>
            <span class="text-gray-400 text-[15px] truncate ml-2">{{ getDeviceStatus(dev) !== 'offline' && !dev.character_id ? '-' : (dev.characters ? `${dev.characters.server_name}-角${dev.characters.char_slot}` : '未知') }}</span>
          </div>
          <div class="flex items-center">
            <span class="text-white font-bold text-base w-20 flex-shrink-0 tracking-wide">目前任務</span>
            <span class="text-ror-accent text-[15px] font-bold truncate ml-2" :title="getTaskDisplay(dev)">{{ getTaskDisplay(dev) }}</span>
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
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { supabase } from '../../utils/supabase.js'

const devices = ref([])
const authCode = ref('載入中...')
const currentTime = ref(Date.now())
let timer = null
let fetchTimer = null

const getDeviceStatus = (dev) => {
  if (!dev || !dev.updated_at) return 'offline'
  const lastUpdate = new Date(dev.updated_at).getTime()
  // 5 minutes = 300000 ms
  if (dev.is_offline || (currentTime.value - lastUpdate) > 300000) {
    return 'offline'
  }
  if (dev.is_paused) {
    return 'paused'
  }
  return 'online'
}

const getDisplayDuration = (dev) => {
  const status = getDeviceStatus(dev)
  const baseDuration = dev.task_duration || 0
  
  if (status === 'offline' || status === 'paused') {
    return baseDuration
  }
  
  // Dynamic timer
  const lastUpdate = new Date(dev.updated_at).getTime()
  const elapsedSinceUpdate = Math.max(0, Math.floor((currentTime.value - lastUpdate) / 1000))
  return baseDuration + elapsedSinceUpdate
}

const pad = (n) => n.toString().padStart(2, '0')
const formatDuration = (totalSeconds) => {
  if (!totalSeconds) return ''
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = Math.floor(totalSeconds % 60)
  if (h > 0) return `${h}:${pad(m)}:${pad(s)}`
  return `${pad(m)}:${pad(s)}`
}

const getTaskDisplay = (dev) => {
  const status = getDeviceStatus(dev)
  const duration = getDisplayDuration(dev)
  const durationStr = duration > 0 ? ` (${formatDuration(duration)})` : ''

  if (status === 'offline') {
    return `-`
  }
  
  const baseTask = dev.current_task || '閒置中'
  
  if (status === 'paused') {
    return `${baseTask} (暫停中)${durationStr}`
  }
  
  return `${baseTask}${durationStr}`
}

const onlineCount = computed(() => {
  return devices.value.filter(dev => getDeviceStatus(dev) !== 'offline').length
})

const sortedDevices = computed(() => {
  return [...devices.value].sort((a, b) => {
    const isAOnline = getDeviceStatus(a) !== 'offline' ? 1 : 0
    const isBOnline = getDeviceStatus(b) !== 'offline' ? 1 : 0
    if (isAOnline !== isBOnline) {
      return isBOnline - isAOnline // 1 (online) comes before 0 (offline)
    }
    return a.device_index - b.device_index
  })
})

const fetchDevices = async () => {
  const { data, error } = await supabase
    .from('devices_status')
    .select(`
      id,
      device_index,
      character_id,
      is_offline,
      is_paused,
      task_start_time,
      task_duration,
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
}

onMounted(async () => {
  // Update current time every second to re-evaluate online status and live timer dynamically
  timer = setInterval(() => {
    currentTime.value = Date.now()
  }, 1000)

  // Poll for latest device data every 5 seconds
  fetchTimer = setInterval(() => {
    fetchDevices()
  }, 5000)

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

  // Initial fetch
  await fetchDevices()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (fetchTimer) clearInterval(fetchTimer)
})

function formatTime24H(timestamp) {
  if (!timestamp) return '未知'
  const d = new Date(timestamp)
  const pad = (n) => n.toString().padStart(2, '0')
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
</script>
