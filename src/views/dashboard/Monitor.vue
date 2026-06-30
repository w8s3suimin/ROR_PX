<template>
  <div class="animate-fade-in">
    <!-- Header -->
    <div class="mb-6 flex flex-col gap-4">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">設備監控</h1>
          <p class="text-ror-muted mt-1">即時同步設備、目前任務的狀態顯示</p>
        </div>
        <div class="bg-[#1a1a1a] border border-ror-border rounded px-4 py-2 flex items-center shrink-0">
          <div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span class="text-sm font-medium">在線: {{ onlineCount }} / {{ filteredDevicesList.length }}</span>
        </div>
      </div>
      <div class="flex justify-end">
        <select v-if="viewAsAdmin" v-model="selectedPlatform" class="bg-[#1a1a1a] border border-ror-border rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-ror-accent">
          <option value="">全部平台</option>
          <option v-for="email in uniquePlatforms" :key="email" :value="email">{{ email }}</option>
        </select>
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
              <svg class="w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" /></svg>
              運行中
            </span>
            <span v-else-if="getDeviceStatus(dev) === 'paused'" class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
              <svg class="w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clip-rule="evenodd" /></svg>
              暫停中
            </span>
            <span v-else class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
              <svg class="w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clip-rule="evenodd" /></svg>
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
          <div class="flex justify-between items-center text-xs mt-4 pt-2 border-t border-ror-border/30 text-gray-500 font-mono tracking-wide">
            <span v-if="viewAsAdmin" class="text-ror-muted hover:text-ror-accent cursor-pointer truncate mr-2" @click="selectedPlatform = dev.profiles?.email || ''">
              {{ dev.profiles?.email || '未知平台' }}
            </span>
            <span v-else></span>
            <span>updated at {{ formatTime24H(dev.updated_at) }}</span>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="filteredDevicesList.length === 0" class="col-span-full py-12 text-center border-2 border-dashed border-ror-border rounded-xl">
        <p class="text-ror-muted">目前沒有設備資料</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { supabase } from '../../utils/supabase.js'
import { viewAsAdmin } from '../../utils/adminState.js'

const currentUser = ref(null)
const devices = ref([])
const authCode = ref('載入中...')
const currentTime = ref(Date.now())
const selectedPlatform = ref('')
let timer = null
let fetchTimer = null
let isPolling = false

const pollDevices = async () => {
  if (!isPolling) return
  await fetchDevices()
  if (isPolling) {
    fetchTimer = setTimeout(pollDevices, 5000)
  }
}
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

const uniquePlatforms = computed(() => {
  const emails = devices.value.map(d => d.profiles?.email).filter(Boolean)
  return [...new Set(emails)].sort()
})

const filteredDevicesList = computed(() => {
  let res = devices.value
  if (!viewAsAdmin.value && currentUser.value) {
    res = res.filter(d => d.user_id === currentUser.value.id)
  } else if (viewAsAdmin.value && selectedPlatform.value) {
    res = res.filter(d => d.profiles?.email === selectedPlatform.value)
  }
  return res
})

const onlineCount = computed(() => {
  return filteredDevicesList.value.filter(dev => getDeviceStatus(dev) !== 'offline').length
})

const sortedDevices = computed(() => {
  return [...filteredDevicesList.value].sort((a, b) => {
    const isAOnline = getDeviceStatus(a) !== 'offline' ? 1 : 0
    const isBOnline = getDeviceStatus(b) !== 'offline' ? 1 : 0
    if (isAOnline !== isBOnline) {
      return isBOnline - isAOnline // 1 (online) comes before 0 (offline)
    }
    return a.device_index - b.device_index
  })
})

const fetchDevices = async () => {
  if (!currentUser.value) return // 確保有使用者才查詢
  
  let query = supabase
    .from('devices_status')
    .select(`
      id,
      user_id,
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
      ),
      profiles (
        email
      )
    `)
    .order('device_index', { ascending: true })

  if (!viewAsAdmin.value) {
    query = query.eq('user_id', currentUser.value.id)
  }

  const { data, error } = await query

  if (data) {
    devices.value = data
  }
}

onMounted(async () => {
  // Update current time every second to re-evaluate online status and live timer dynamically
  timer = setInterval(() => {
    currentTime.value = Date.now()
  }, 1000)
  // Start recursive polling instead of setInterval
  isPolling = true

  // Fetch auth code for the current user
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    currentUser.value = user
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

  // Initial fetch and start polling
  await fetchDevices()
  fetchTimer = setTimeout(pollDevices, 5000)
})

onUnmounted(() => {
  isPolling = false
  if (timer) clearInterval(timer)
  if (fetchTimer) clearTimeout(fetchTimer)
})

function formatTime24H(timestamp) {
  if (!timestamp) return '未知'
  const d = new Date(timestamp)
  const pad = (n) => n.toString().padStart(2, '0')
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
</script>
