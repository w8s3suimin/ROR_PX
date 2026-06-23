<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-white tracking-tight">設備監控</h1>
        <p class="text-ror-muted mt-1">即時同步資源、等級、目前任務與日誌</p>
      </div>
      <div class="flex gap-4">
        <div class="bg-[#1a1a1a] border border-ror-border rounded px-4 py-2 flex items-center">
          <div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span class="text-sm font-medium">在線: {{ devices.length }}</span>
        </div>
      </div>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div v-for="dev in devices" :key="dev.id" class="bg-ror-card border border-ror-border rounded-xl p-4 flex flex-col gap-3 hover:border-ror-accent transition-colors group">
        <!-- Header -->
        <div class="flex justify-between items-center border-b border-ror-border/50 pb-2">
          <div class="flex items-center gap-2">
            <span class="text-white font-bold tracking-wider">設備 #{{ dev.device_index }}</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">運行中</span>
          </div>
        </div>

        <!-- Status Details -->
        <div class="flex-1 space-y-2">
          <div class="flex justify-between items-center text-sm">
            <span class="text-ror-muted">授權碼</span>
            <span class="text-white font-mono text-xs">{{ authCode }}</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-ror-muted">目標帳號</span>
            <span class="text-white font-mono">{{ dev.characters?.game_account || '未知' }}</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-ror-muted">伺服器/角色序</span>
            <span class="text-white">{{ dev.characters?.server_name || '未知' }} / {{ dev.characters?.char_slot || '-' }}</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-ror-muted">目前任務</span>
            <span class="text-ror-accent font-medium text-right line-clamp-1 max-w-[120px]" :title="dev.current_task">{{ dev.current_task || '閒置中' }}</span>
          </div>
          <div class="flex justify-between items-center text-sm mt-2 pt-2 border-t border-ror-border/30">
            <span class="text-ror-muted text-xs">更新時間</span>
            <span class="text-ror-muted text-xs font-mono">{{ formatTime(dev.updated_at) }}</span>
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
import { ref, onMounted } from 'vue'
import { supabase } from '../../utils/supabase.js'

const devices = ref([])
const authCode = ref('載入中...')

onMounted(async () => {
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

function formatTime(timestamp) {
  if (!timestamp) return '未知'
  return new Date(timestamp).toLocaleString('zh-TW', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}
</script>
