<template>
  <div class="space-y-6 animate-fade-in relative">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-ror-accent to-white">交易所操作</h1>
        <p class="text-ror-muted mt-2">管理與紀錄交易所相關活動</p>
      </div>

      <div class="flex items-center gap-3">
        <!-- Settings Gear Icon -->
        <button @click="showSettings = true" class="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-ror-muted hover:text-white transition-all duration-300">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        </button>

        <button v-if="isAdmin" @click="showAddTarget = true" class="flex items-center px-4 py-2 bg-ror-accent/10 text-ror-accent hover:bg-ror-accent/20 rounded-xl transition-all duration-300 font-medium">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          新增標的
        </button>
      </div>
    </div>

    <!-- Date Info -->
    <div class="bg-white/5 border border-ror-border rounded-xl p-4 flex items-center justify-between">
      <div class="text-sm">
        <span class="text-ror-muted">A: </span><span class="text-white font-medium mr-4">{{ dateAFormatted }}</span>
        <span class="text-ror-muted">B: </span><span class="text-white font-medium">{{ dateBFormatted }}</span>
      </div>
      <div class="flex items-center gap-2">
        <button @click="changeDate(-1)" class="p-1 rounded bg-white/5 hover:bg-white/10 text-ror-muted transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <span class="text-white font-medium min-w-[3rem] text-center">{{ dateOffset === 0 ? '今日' : `${Math.abs(dateOffset)}天前` }}</span>
        <button @click="changeDate(1)" :disabled="dateOffset === 0" class="p-1 rounded bg-white/5 hover:bg-white/10 text-ror-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="w-10 h-10 border-4 border-ror-accent/30 border-t-ror-accent rounded-full animate-spin"></div>
    </div>

    <!-- Cards Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div v-for="target in targets" :key="target.id" 
           class="relative rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col"
           :class="target.is_active ? 'bg-ror-card border-ror-border hover:border-ror-accent/30 shadow-lg' : 'bg-black/60 border-black/80 opacity-70 grayscale'">
        
        <!-- Card Header -->
        <div class="p-4 border-b border-ror-border/50 flex justify-between items-center" :class="target.is_active ? 'bg-white/5' : 'bg-black/40'">
          <h2 class="text-xl font-bold text-white">{{ target.name }}</h2>
          <div class="flex items-center gap-2">
            <span class="text-sm px-3 py-1 rounded-full" :class="target.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'">
              {{ target.is_active ? '啟用中' : '已停用' }}
            </span>
            <button v-if="isAdmin" @click="toggleTarget(target)" class="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-ror-muted transition-colors">
              <svg v-if="target.is_active" class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
              <svg v-else class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            </button>
          </div>
        </div>

        <!-- Duty Officer -->
        <div v-if="target.is_active" class="px-4 py-2 bg-black/20 flex items-center justify-between border-b border-ror-border/50">
          <span class="text-sm text-ror-muted font-medium">值班人員</span>
          <div class="flex items-center gap-2">
            <input v-if="isAdmin" :value="getDutyOfficer(target.id)" @change="updateDutyOfficer(target.id, $event.target.value)" class="bg-black/50 border border-ror-border rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-ror-accent" placeholder="未指派" />
            <span v-else class="text-white text-sm font-medium">{{ getDutyOfficer(target.id) || '未指派' }}</span>
          </div>
        </div>

        <!-- Slots Grid -->
        <div class="p-4 grid grid-cols-2 gap-3 flex-1">
          <div v-for="slot in timeSlots" :key="slot" class="flex flex-col p-2 rounded-lg bg-black/40 border border-ror-border/30 hover:border-ror-accent/50 transition-colors group relative justify-between">
            <div class="flex justify-between items-center text-xs mb-1">
              <span class="text-white font-bold tracking-wide">{{ slot }}</span>
              <span class="text-ror-muted">{{ getSlotData(target.id, slot)?.status || '-' }}</span>
            </div>
            <div class="flex justify-between items-end">
              <span class="text-sm font-medium truncate max-w-[4.5rem]" :class="getSlotData(target.id, slot)?.user_id ? 'text-ror-accent' : 'text-gray-500'">
                {{ getSlotData(target.id, slot)?.user_id ? getUserName(getSlotData(target.id, slot).user_id) : '未登記' }}
              </span>
              <button v-if="target.is_active" @click="updateSlot(target.id, slot)" class="md:opacity-0 group-hover:opacity-100 text-xs px-2 py-0.5 bg-ror-accent/20 hover:bg-ror-accent/40 rounded text-ror-accent transition-all">
                登記
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="targets.length === 0" class="col-span-full py-12 text-center text-ror-muted bg-white/5 rounded-xl border border-ror-border border-dashed">
        目前沒有任何標的。
      </div>
    </div>

    <!-- Settings Modal -->
    <div v-if="showSettings" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-ror-card border border-ror-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
        <div class="p-6 border-b border-ror-border/50 flex justify-between items-center">
          <h3 class="text-xl font-bold text-white">設定您的顯示名稱</h3>
          <button @click="showSettings = false" class="text-ror-muted hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-ror-muted mb-2">交易所名稱 (Exchange Name)</label>
            <input v-model="settingsName" type="text" class="w-full bg-black/50 border border-ror-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ror-accent transition-colors" placeholder="請輸入您的顯示名稱" />
          </div>
          <button @click="saveSettings" class="w-full py-3 bg-ror-accent text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors" :disabled="savingSettings">
            {{ savingSettings ? '儲存中...' : '儲存' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Add Target Modal -->
    <div v-if="showAddTarget" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-ror-card border border-ror-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
        <div class="p-6 border-b border-ror-border/50 flex justify-between items-center">
          <h3 class="text-xl font-bold text-white">新增標的</h3>
          <button @click="showAddTarget = false" class="text-ror-muted hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-ror-muted mb-2">標的名稱</label>
            <input v-model="newTargetName" type="text" class="w-full bg-black/50 border border-ror-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ror-accent transition-colors" placeholder="例如：阿修羅" />
          </div>
          <button @click="addTarget" class="w-full py-3 bg-ror-accent text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors" :disabled="savingTarget || !newTargetName">
            {{ savingTarget ? '新增中...' : '確認新增' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../../utils/supabase'

const loading = ref(true)
const isAdmin = ref(false)
const currentUser = ref(null)
const targets = ref([])
const schedules = ref([])
const userProfiles = ref({}) // { 'uuid': 'name' }

const showSettings = ref(false)
const settingsName = ref('')
const savingSettings = ref(false)

const showAddTarget = ref(false)
const newTargetName = ref('')
const savingTarget = ref(false)

const dateOffset = ref(0) // 0 = current cycle (Yesterday/Today), -1 = previous cycle, etc.

const getBaseDateObj = () => {
  const d = new Date()
  d.setDate(d.getDate() - 1 + dateOffset.value)
  return d
}

const getBaseDateString = () => {
  const d = getBaseDateObj()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const dateAFormatted = computed(() => {
  const d = getBaseDateObj()
  return `${d.getMonth() + 1}/${d.getDate()}`
})

const dateBFormatted = computed(() => {
  const d = getBaseDateObj()
  d.setDate(d.getDate() + 1)
  return `${d.getMonth() + 1}/${d.getDate()}`
})

const baseDate = computed(() => getBaseDateString())

const changeDate = (delta) => {
  if (dateOffset.value + delta > 0) return // Don't go into the future
  dateOffset.value += delta
  fetchSchedules() // refetch schedules for new date
}

const fetchProfiles = async () => {
  const { data } = await supabase.from('profiles').select('id, exchange_name')
  if (data) {
    const map = {}
    data.forEach(p => {
      map[p.id] = p.exchange_name || '未命名'
    })
    userProfiles.value = map
  }
}

const fetchData = async () => {
  loading.value = true
  
  // Get current user session
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    currentUser.value = session.user
    
    // Check if admin and get current name
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin, exchange_name')
      .eq('id', session.user.id)
      .single()
      
    if (profile) {
      isAdmin.value = profile.is_admin
      settingsName.value = profile.exchange_name || ''
      if (!profile.exchange_name) {
        showSettings.value = true // Prompt to set name first time
      }
    }
  }

  await fetchProfiles()

  // Fetch targets
  let targetQuery = supabase.from('exchange_targets').select('*').order('created_at')
  if (!isAdmin.value) {
    targetQuery = targetQuery.eq('is_active', true)
  }
  const { data: tData } = await targetQuery
  if (tData) targets.value = tData

  await fetchSchedules()
  loading.value = false
}

const fetchSchedules = async () => {
  const { data: sData } = await supabase
    .from('exchange_schedules')
    .select('*')
    .eq('base_date', baseDate.value)
    
  if (sData) {
    schedules.value = sData
  } else {
    schedules.value = []
  }
}

onMounted(() => {
  fetchData()
})

const saveSettings = async () => {
  if (!settingsName.value.trim() || !currentUser.value) return
  savingSettings.value = true
  
  const { error } = await supabase
    .from('profiles')
    .update({ exchange_name: settingsName.value })
    .eq('id', currentUser.value.id)
    
  if (!error) {
    userProfiles.value[currentUser.value.id] = settingsName.value
    showSettings.value = false
  } else {
    alert('儲存失敗: ' + error.message)
  }
  savingSettings.value = false
}

const addTarget = async () => {
  if (!newTargetName.value.trim()) return
  savingTarget.value = true
  
  const { data, error } = await supabase
    .from('exchange_targets')
    .insert([{ name: newTargetName.value }])
    .select()
    
  if (data && data.length > 0) {
    targets.value.push(data[0])
    showAddTarget.value = false
    newTargetName.value = ''
  } else if (error) {
    alert('新增失敗: ' + error.message)
  }
  savingTarget.value = false
}

const toggleTarget = async (target) => {
  const newStatus = !target.is_active
  target.is_active = newStatus // Optimistic UI update
  
  const { error } = await supabase
    .from('exchange_targets')
    .update({ is_active: newStatus })
    .eq('id', target.id)
    
  if (error) {
    target.is_active = !newStatus // Revert on failure
    alert('更新狀態失敗: ' + error.message)
  }
}

const getDutyOfficer = (targetId) => {
  const schedule = schedules.value.find(s => s.target_id === targetId)
  return schedule?.duty_officer || ''
}

const updateDutyOfficer = async (targetId, value) => {
  let scheduleIndex = schedules.value.findIndex(s => s.target_id === targetId)
  let schedule = scheduleIndex >= 0 ? schedules.value[scheduleIndex] : null
  
  if (schedule) {
    schedule.duty_officer = value
  } else {
    schedule = {
      target_id: targetId,
      base_date: baseDate.value,
      slots_data: {},
      duty_officer: value
    }
    schedules.value.push(schedule)
  }

  const { error } = await supabase
    .from('exchange_schedules')
    .upsert({
      target_id: targetId,
      base_date: baseDate.value,
      slots_data: schedule.slots_data,
      duty_officer: value,
      updated_at: new Date().toISOString()
    }, { onConflict: 'target_id,base_date' })

  if (error) {
    console.error("更新失敗", error)
    alert("紀錄更新失敗: " + error.message)
  }
}

const getSlotData = (targetId, slotName) => {
  const schedule = schedules.value.find(s => s.target_id === targetId)
  if (!schedule) return null
  return schedule.slots_data[slotName] || null
}

const getUserName = (userId) => {
  return userProfiles.value[userId] || '未知用戶'
}

const updateSlot = async (targetId, slotName) => {
  if (!currentUser.value) return
  if (!userProfiles.value[currentUser.value.id]) {
    alert("請先點擊右上角齒輪設定您的交易所名稱！")
    showSettings.value = true
    return
  }

  // Find or create schedule in local state
  let scheduleIndex = schedules.value.findIndex(s => s.target_id === targetId)
  let schedule = scheduleIndex >= 0 ? schedules.value[scheduleIndex] : null
  
  let newSlotsData = schedule ? { ...schedule.slots_data } : {}
  newSlotsData[slotName] = {
    user_id: currentUser.value.id,
    status: '📈',
    updated_at: new Date().toISOString()
  }

  // Optimistic UI update
  if (schedule) {
    schedule.slots_data = newSlotsData
  } else {
    schedule = {
      target_id: targetId,
      base_date: baseDate.value,
      slots_data: newSlotsData
    }
    schedules.value.push(schedule)
  }

  // Upsert to Supabase
  const { error } = await supabase
    .from('exchange_schedules')
    .upsert({
      target_id: targetId,
      base_date: baseDate.value,
      slots_data: newSlotsData,
      updated_at: new Date().toISOString()
    }, { onConflict: 'target_id,base_date' })

  if (error) {
    console.error("更新失敗", error)
    alert("紀錄更新失敗: " + error.message)
    // Real app might want to revert the optimistic update here
  }
}

</script>
