<template>
  <div class="h-full">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-white tracking-tight">角色管理</h1>
      <p class="text-ror-muted mt-1">集中監控所有帳號角色的狀態、物資與資產</p>
    </div>

    <!-- Error/Loading States -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-ror-accent mx-auto"></div>
      <p class="text-ror-muted mt-4">正在同步伺服器資料...</p>
    </div>
    <div v-else-if="error" class="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-500">
      {{ error }}
    </div>

    <!-- Resource List -->
    <div v-else class="space-y-4">
      <!-- List Header -->
      <div class="hidden md:grid grid-cols-7 gap-4 pl-6 pr-12 py-3 bg-ror-card/50 rounded-lg text-sm font-bold text-ror-muted border border-ror-border/50">
        <div class="col-span-1">平台/遊戲帳號</div>
        <div class="col-span-1">伺服器</div>
        <div class="col-span-1 text-center">角色名稱</div>
        <div class="col-span-1 text-center">等級</div>
        <div class="col-span-1 text-center">派遣數量</div>
        <div class="col-span-1 text-right text-blue-400">活力值</div>
        <div class="col-span-1 text-right text-pink-400">水晶</div>
      </div>

      <!-- List Items -->
      <div 
        v-for="char in characters" 
        :key="char.id"
        class="bg-ror-card border border-ror-border rounded-xl overflow-hidden transition-all duration-300 hover:border-ror-accent"
      >
        <!-- Main Row (Click to toggle) -->
        <div 
          class="grid grid-cols-2 md:grid-cols-7 gap-4 pl-6 pr-12 py-4 cursor-pointer items-center relative"
          @click="toggleRow(char.id)"
        >
          <div class="col-span-1 truncate">
            <div class="font-bold text-white">{{ char.profiles?.email || '未綁定' }}</div>
            <div class="text-xs text-ror-muted">{{ char.game_account }}</div>
          </div>
          <div class="col-span-1 text-sm text-gray-300">
            <span class="inline-block px-2 py-1 rounded bg-white/5 border border-white/10">{{ char.server_name }}</span>
          </div>
          <div class="col-span-1 text-center truncate">
            <div class="text-white font-bold">{{ char.character_name }}</div>
            <div class="text-xs text-ror-muted">角 {{ char.char_slot }}</div>
          </div>
          <div class="col-span-1 text-center text-white font-mono">Lv.{{ char.level }}</div>
          
          <div class="col-span-1 text-center">
            <span class="px-2 py-1 rounded text-xs font-bold" :class="char.dispatch_current >= char.dispatch_max ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'">
              {{ char.dispatch_current }} / {{ char.dispatch_max }}
            </span>
          </div>

          <div class="col-span-1 text-right font-mono text-blue-400 relative group">
            {{ formatNumber(char.vitality) }}
            <!-- Tooltip -->
            <div class="absolute right-0 bottom-full mb-2 hidden md:group-hover:block whitespace-nowrap bg-black text-gray-300 text-xs px-2 py-1 rounded border border-ror-border z-10 pointer-events-none shadow-lg">
              最後更新: {{ formatTime(char.updated_at) }}
            </div>
          </div>
          <div class="col-span-1 text-right font-mono text-pink-400">{{ formatNumber(char.crystal) }}</div>
          
          <!-- Expand Indicator -->
          <div class="absolute right-4 top-1/2 -translate-y-1/2 text-ror-muted transition-transform duration-300" :class="{ 'rotate-180 text-ror-accent': expandedRow === char.id }">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        <!-- Expanded Detail Row (Special Items) -->
        <div 
          class="bg-[#151515] overflow-hidden transition-all duration-300"
          :class="expandedRow === char.id ? 'max-h-96 border-t border-ror-border/50' : 'max-h-0'"
        >
          <div class="p-6">
            <h4 class="text-sm font-bold text-ror-accent mb-3 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
              特殊高價物列表
            </h4>
            
            <div v-if="char.special_items && char.special_items.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div 
                v-for="(item, idx) in char.special_items" 
                :key="idx"
                class="bg-black/40 border border-white/5 rounded-lg p-3 flex items-center gap-3"
              >
                <div class="w-10 h-10 rounded bg-white/5 flex items-center justify-center shrink-0 border" :class="getQualityBorder(item.quality)">
                  <span class="text-xs font-bold">{{ item.qty }}x</span>
                </div>
                <div class="flex-1 truncate">
                  <div class="text-sm text-white truncate" :class="getQualityTextColor(item.quality)">{{ item.name }}</div>
                  <div class="text-xs text-ror-muted">{{ translateQuality(item.quality) }}</div>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-6 text-ror-muted text-sm border border-dashed border-ror-border/50 rounded-lg">
              此角色目前沒有特殊高價物
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="characters.length === 0" class="text-center py-12 bg-ror-card border border-ror-border rounded-xl">
        <p class="text-ror-muted">目前還沒有任何角色資料。</p>
        <p class="text-xs text-ror-muted mt-2">請確保已經在資料庫中初始化資料表或等候系統派發任務。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../../utils/supabase'

const characters = ref([])
const loading = ref(true)
const error = ref(null)
const expandedRow = ref(null)

const toggleRow = (id) => {
  if (expandedRow.value === id) {
    expandedRow.value = null
  } else {
    expandedRow.value = id
  }
}

const formatNumber = (num) => {
  if (!num) return '0'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const formatTime = (dateStr) => {
  if (!dateStr) return '未知'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-TW', {
    month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false
  })
}

const getQualityBorder = (quality) => {
  switch(quality) {
    case 'epic': return 'border-purple-500 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
    case 'rare': return 'border-blue-500 text-blue-400'
    default: return 'border-gray-500 text-gray-400'
  }
}

const getQualityTextColor = (quality) => {
  switch(quality) {
    case 'epic': return 'text-purple-400'
    case 'rare': return 'text-blue-400'
    default: return 'text-gray-300'
  }
}

const translateQuality = (quality) => {
  switch(quality) {
    case 'epic': return '史詩 (Epic)'
    case 'rare': return '稀有 (Rare)'
    default: return '普通 (Normal)'
  }
}

onMounted(async () => {
  try {
    loading.value = true
    // Fetch characters and join with profiles to get the email
    const { data, error: err } = await supabase
      .from('characters')
      .select(`
        *,
        profiles (
          email
        )
      `)
      .order('server_name', { ascending: true })
      .order('character_name', { ascending: true })

    if (err) {
      throw err
    }
    
    characters.value = data || []
  } catch (err) {
    console.error('Error fetching characters:', err)
    error.value = `無法拉取角色資料：${err.message}。如果尚未建立資料表，請先至 Supabase 執行初始化 SQL 指令。`
  } finally {
    loading.value = false
  }
})
</script>
