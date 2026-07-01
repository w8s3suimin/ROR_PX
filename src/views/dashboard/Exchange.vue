<template>
  <div class="space-y-6 animate-fade-in relative">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-ror-accent to-white">交易所操作</h1>
        <p class="text-ror-muted mt-2">管理與紀錄交易所相關活動</p>
      </div>

      <div class="flex items-center gap-3">
        <button v-if="isAdmin" @click="showAddTarget = true" class="flex items-center px-4 py-2 bg-ror-accent/10 text-ror-accent hover:bg-ror-accent/20 rounded-xl transition-all duration-300 font-medium">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          新增標的
        </button>

        <!-- Settings Gear Icon -->
        <button @click="showSettings = true" class="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-ror-muted hover:text-white transition-all duration-300">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
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
        
        <!-- Card Header with Independent Date Switcher -->
        <div class="p-4 border-b border-ror-border/50 flex flex-col gap-3" :class="target.is_active ? 'bg-white/5' : 'bg-black/40'">
          
          <!-- Top Row: Title + Controls -->
          <div class="flex justify-between items-start gap-4 w-full">
            <div class="flex flex-col gap-2 flex-1 overflow-hidden">
              <div class="flex items-center justify-between w-full">
                <h2 class="text-xl font-bold text-white truncate max-w-full" :title="target.name">{{ target.name }}</h2>
                <!-- Admin Toggle (Power button) -->
                <button v-if="isAdmin" @click="toggleTarget(target)" class="p-2 rounded-xl bg-black/40 hover:bg-white/10 transition-colors flex-shrink-0 border border-ror-border/50" title="啟用/停用標的">
                  <svg v-if="target.is_active" class="w-5 h-5 text-ror-accent hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10"></path></svg>
                  <svg v-else class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10"></path></svg>
                </button>
              </div>
              
              <!-- Duty Officer Row & Date Switcher -->
              <div class="flex items-center gap-4 mt-1 w-full">
                <!-- Duty Officer Row -->
                <div class="flex items-center gap-2">
                  <span class="text-sm text-ror-muted font-medium flex-shrink-0">值班人員</span>
                  <select v-if="isAdmin" :value="getDutyOfficer(target.id)" @change="updateDutyOfficer(target.id, $event.target.value)" class="bg-black/50 border border-ror-border rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-ror-accent">
                    <option value="">未指派</option>
                    <option v-for="(name, id) in userProfiles" :key="id" :value="id">{{ name }}</option>
                  </select>
                  <span v-else class="text-white text-sm font-medium truncate max-w-[100px]">{{ getDutyOfficerName(target.id) || '未指派' }}</span>
                </div>

                <!-- Date Switcher (Forced Right) -->
                <div class="flex items-center gap-1 bg-black/40 border border-ror-border/50 rounded-lg px-2 py-1 ml-auto flex-shrink-0">
                  <button @click="changeTargetDate(target.id, -1)" class="p-1 rounded hover:bg-white/10 text-ror-accent transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                  </button>
                  <span class="text-white text-xs font-medium w-10 text-center">{{ getTargetDateLabel(target.id) }}</span>
                  <button @click="changeTargetDate(target.id, 1)" :disabled="getTargetOffset(target.id) >= 1" class="p-1 rounded hover:bg-white/10 text-ror-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Slots List (1 big box layout) -->
        <div class="p-4 flex-1 overflow-y-auto">
          <div class="flex flex-col rounded-xl border border-ror-border/30 bg-black/20 overflow-hidden divide-y divide-white/5">
            <div v-for="slot in getTargetSlots(target.id)" :key="slot.key" class="flex items-stretch p-0 hover:bg-white/5 transition-colors group">
              
              <!-- Left: Time -->
              <div class="w-[95px] flex-shrink-0 py-1.5 px-3 flex items-center text-white font-mono text-sm tracking-tighter whitespace-nowrap">{{ slot.display }}</div>
              
              <!-- Middle: Personnel -->
              <div class="flex-1 py-1.5 px-3 flex items-center justify-between border-l border-r border-white/5">
                <div class="flex-1 text-center truncate relative group/name">
                  <span v-if="getSlotData(target.id, slot.key)?.user_id" 
                        @click="isAdmin ? editSlotName(target.id, slot.key) : null"
                        :class="['text-sm font-medium', isAdmin ? 'cursor-pointer hover:text-white text-ror-accent' : 'text-ror-accent']"
                        :title="isAdmin ? '點擊修改名稱' : ''">
                    {{ getUserName(getSlotData(target.id, slot.key).user_id) }}
                  </span>
                  <span v-else-if="!target.is_active || isSlotLocked(target.id, slot.key)" class="text-gray-500 text-sm">未登記</span>
                  <span v-else class="text-gray-500 text-sm invisible">未登記</span> <!-- Space preservation -->
                </div>
                
                <!-- Action Buttons -->
                <div v-if="target.is_active" class="flex-shrink-0 flex items-center ml-1 w-6 justify-center">
                  <button v-if="!getSlotData(target.id, slot.key)?.user_id" 
                          @click="updateSlot(target.id, slot.key)" 
                          :disabled="isSlotLocked(target.id, slot.key)"
                          class="text-ror-accent hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title="登記">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </button>
                  <button v-else-if="canEditStatus(target.id, slot.key)" 
                          @click="cancelSlot(target.id, slot.key)"
                          :disabled="isSlotLocked(target.id, slot.key)"
                          class="text-ror-accent hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title="取消登記">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </button>
                </div>
              </div>

              <!-- Right: Checkbox -->
              <div class="w-12 py-1.5 flex justify-center items-center">
                <div @click="canEditStatus(target.id, slot.key) ? toggleSlotStatus(target.id, slot.key, !getSlotData(target.id, slot.key)?.completed) : null"
                     class="w-5 h-5 border-2 rounded transition-colors flex items-center justify-center bg-black"
                     :class="{ 
                       'opacity-30 cursor-not-allowed border-gray-600': !canEditStatus(target.id, slot.key), 
                       'cursor-pointer hover:bg-ror-accent/20 border-ror-accent': canEditStatus(target.id, slot.key) 
                     }">
                  <svg v-if="getSlotData(target.id, slot.key)?.completed" class="w-3.5 h-3.5 text-ror-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </div>

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
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../utils/supabase'
import { viewAsAdmin as isAdmin } from '../../utils/adminState'

const router = useRouter()

const loading = ref(true)
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

// Independent date tracking per target
const targetDates = ref({}) // { target_id: offset_integer }

const getTargetOffset = (targetId) => targetDates.value[targetId] || 0

const changeTargetDate = (targetId, delta) => {
  const current = getTargetOffset(targetId)
  if (current + delta > 1) return // Allow up to 1 (Tomorrow)
  targetDates.value[targetId] = current + delta
  fetchSchedulesForTarget(targetId)
}

const getBaseDateObjForTarget = (targetId) => {
  const d = new Date()
  d.setDate(d.getDate() - 1 + getTargetOffset(targetId))
  return d
}

const getBaseDateStringForTarget = (targetId) => {
  const d = getBaseDateObjForTarget(targetId)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const getTargetDateLabel = (targetId) => {
  const offset = getTargetOffset(targetId)
  if (offset === 0) return '今日'
  if (offset === 1) return '明日'
  return `${Math.abs(offset)}天前`
}

const getTargetSlots = (targetId) => {
  const d = getBaseDateObjForTarget(targetId)
  const monthA = d.getMonth() + 1
  const dateA = d.getDate()
  
  const dB = new Date(d)
  dB.setDate(dB.getDate() + 1)
  const monthB = dB.getMonth() + 1
  const dateB = dB.getDate()
  
  return [
    { key: 'A21-24', display: `${monthA}/${dateA} 21-24` },
    { key: 'B00-06', display: `${monthB}/${dateB} 00-06` },
    { key: 'B06-09', display: `${monthB}/${dateB} 06-09` },
    { key: 'B09-12', display: `${monthB}/${dateB} 09-12` },
    { key: 'B12-15', display: `${monthB}/${dateB} 12-15` },
    { key: 'B15-18', display: `${monthB}/${dateB} 15-18` },
    { key: 'B18-21', display: `${monthB}/${dateB} 18-21` },
    { key: 'B21-24', display: `${monthB}/${dateB} 21-24` }
  ]
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
      .select('is_admin, exchange_name, exchange_member')
      .eq('id', session.user.id)
      .single()
      
    if (profile) {
      if (!profile.is_admin && !profile.exchange_member) {
        router.push('/dashboard')
        return
      }
      settingsName.value = profile.exchange_name || ''
      if (!profile.exchange_name) {
        showSettings.value = true // Prompt to set name first time
      }
    } else {
      router.push('/dashboard')
      return
    }
  }

  await fetchProfiles()

  // Fetch targets
  let targetQuery = supabase.from('exchange_targets').select('*').order('created_at')
  if (!isAdmin.value) {
    targetQuery = targetQuery.eq('is_active', true)
  }
  const { data: tData } = await targetQuery
  if (tData) {
    targets.value = tData
  }

  // Fetch schedules for all targets at offset 0
  await fetchAllSchedulesAtOffsetZero()
  
  loading.value = false
}

const fetchAllSchedulesAtOffsetZero = async () => {
  const baseDates = targets.value.map(t => getBaseDateStringForTarget(t.id))
  if (baseDates.length === 0) return

  const { data } = await supabase
    .from('exchange_schedules')
    .select('*')
    .in('target_id', targets.value.map(t => t.id))
    .in('base_date', baseDates)

  if (data) {
    schedules.value = data
  }
}

watch(isAdmin, () => {
  if (!loading.value) {
    fetchData()
  }
})

const fetchSchedulesForTarget = async (targetId) => {
  const bDate = getBaseDateStringForTarget(targetId)
  const { data } = await supabase
    .from('exchange_schedules')
    .select('*')
    .eq('target_id', targetId)
    .eq('base_date', bDate)
    .maybeSingle()
    
  // Remove existing schedule for this target from local state
  schedules.value = schedules.value.filter(s => s.target_id !== targetId)
  if (data) {
    schedules.value.push(data)
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
    targetDates.value[data[0].id] = 0
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
  const bDate = getBaseDateStringForTarget(targetId)
  const schedule = schedules.value.find(s => s.target_id === targetId && s.base_date === bDate)
  return schedule?.duty_officer || ''
}

const getDutyOfficerName = (targetId) => {
  const id = getDutyOfficer(targetId)
  if (!id) return ''
  return userProfiles.value[id] || id // fallback to id if name not found (for legacy text data)
}

const updateDutyOfficer = async (targetId, value) => {
  const bDate = getBaseDateStringForTarget(targetId)
  let scheduleIndex = schedules.value.findIndex(s => s.target_id === targetId && s.base_date === bDate)
  let schedule = scheduleIndex >= 0 ? schedules.value[scheduleIndex] : null
  
  if (schedule) {
    schedule.duty_officer = value
  } else {
    schedule = {
      target_id: targetId,
      base_date: bDate,
      slots_data: {},
      duty_officer: value
    }
    schedules.value.push(schedule)
  }

  const { error } = await supabase
    .from('exchange_schedules')
    .upsert({
      target_id: targetId,
      base_date: bDate,
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
  const bDate = getBaseDateStringForTarget(targetId)
  const schedule = schedules.value.find(s => s.target_id === targetId && s.base_date === bDate)
  if (!schedule) return null
  return schedule.slots_data[slotName] || null
}

const getUserName = (userId) => {
  return userProfiles.value[userId] || userId
}

const canEditStatus = (targetId, slotKey) => {
  if (isAdmin.value) return true
  const dutyOfficerId = getDutyOfficer(targetId)
  if (currentUser.value?.id === dutyOfficerId) return true
  const slotData = getSlotData(targetId, slotKey)
  if (slotData && slotData.user_id === currentUser.value?.id) return true
  return false
}

const toggleSlotStatus = async (targetId, slotKey, isCompleted) => {
  if (!canEditStatus(targetId, slotKey)) return

  const bDate = getBaseDateStringForTarget(targetId)
  let scheduleIndex = schedules.value.findIndex(s => s.target_id === targetId && s.base_date === bDate)
  let schedule = scheduleIndex >= 0 ? schedules.value[scheduleIndex] : null
  
  if (!schedule || !schedule.slots_data[slotKey]) return // Cant toggle a slot that isn't registered

  let newSlotsData = { ...schedule.slots_data }
  newSlotsData[slotKey] = {
    ...newSlotsData[slotKey],
    completed: isCompleted,
    status: isCompleted ? 'completed' : '📈',
    updated_at: new Date().toISOString()
  }
  
  schedule.slots_data = newSlotsData // Optimistic

  const { error } = await supabase
    .from('exchange_schedules')
    .update({ slots_data: newSlotsData })
    .eq('target_id', targetId)
    .eq('base_date', bDate)

  if (error) {
    alert("狀態更新失敗: " + error.message)
  }
}

const isSlotLocked = (targetId, slotKey) => {
  if (isAdmin.value) return false // Admin can always edit
  
  const d = getBaseDateObjForTarget(targetId)
  const isA = slotKey.startsWith('A')
  if (!isA) {
    d.setDate(d.getDate() + 1)
  }
  
  // parse end hour from slotKey e.g. A21-24 -> 24
  const endHour = parseInt(slotKey.split('-')[1])
  d.setHours(endHour, 0, 0, 0)
  
  // If current time is past the end hour, it's locked
  return new Date() > d
}

const cancelSlot = async (targetId, slotKey) => {
  if (!canEditStatus(targetId, slotKey)) return
  if (isSlotLocked(targetId, slotKey)) {
    alert("該班次時間已過，無法取消登記。")
    return
  }

  const bDate = getBaseDateStringForTarget(targetId)
  let scheduleIndex = schedules.value.findIndex(s => s.target_id === targetId && s.base_date === bDate)
  let schedule = scheduleIndex >= 0 ? schedules.value[scheduleIndex] : null
  
  if (!schedule || !schedule.slots_data[slotKey]) return

  let newSlotsData = { ...schedule.slots_data }
  delete newSlotsData[slotKey] // Remove registration entirely
  
  schedule.slots_data = newSlotsData // Optimistic

  const { error } = await supabase
    .from('exchange_schedules')
    .update({ slots_data: newSlotsData })
    .eq('target_id', targetId)
    .eq('base_date', bDate)

  if (error) {
    alert("取消更新失敗: " + error.message)
  }
}

const updateSlot = async (targetId, slotName) => {
  if (!currentUser.value) return
  if (!userProfiles.value[currentUser.value.id]) {
    alert("請先點擊右上角齒輪設定您的交易所名稱！")
    showSettings.value = true
    return
  }

  if (isSlotLocked(targetId, slotName)) {
    alert("該班次時間已過，無法登記。")
    return
  }

  let assignId = currentUser.value.id;

  const bDate = getBaseDateStringForTarget(targetId)
  // Find or create schedule in local state
  let scheduleIndex = schedules.value.findIndex(s => s.target_id === targetId && s.base_date === bDate)
  let schedule = scheduleIndex >= 0 ? schedules.value[scheduleIndex] : null
  
  if (!schedule) {
    schedule = {
      target_id: targetId,
      base_date: bDate,
      slots_data: {},
      duty_officer: ''
    }
    schedules.value.push(schedule)
  }

  let newSlotsData = { ...schedule.slots_data }
  newSlotsData[slotName] = {
    user_id: assignId,
    status: '📈',
    completed: false,
    updated_at: new Date().toISOString()
  }
  schedule.slots_data = newSlotsData // Optimistic UI update

  const { error } = await supabase
    .from('exchange_schedules')
    .upsert({
      target_id: targetId,
      base_date: bDate,
      slots_data: newSlotsData,
      duty_officer: schedule.duty_officer,
      updated_at: new Date().toISOString()
    }, { onConflict: 'target_id,base_date' })

  if (error) {
    alert("登記失敗: " + error.message)
    // Revert would go here in a robust app
  }
}

const editSlotName = async (targetId, slotKey) => {
  if (!isAdmin.value) return;
  
  const bDate = getBaseDateStringForTarget(targetId);
  const schedule = schedules.value.find(s => s.target_id === targetId && s.base_date === bDate);
  if (!schedule || !schedule.slots_data[slotKey]) return;
  
  const currentName = getUserName(schedule.slots_data[slotKey].user_id);
  const newName = window.prompt("修改班次人員名稱：", currentName);
  
  if (newName !== null && newName.trim() !== "" && newName !== currentName) {
    let newSlotsData = { ...schedule.slots_data };
    newSlotsData[slotKey] = {
      ...newSlotsData[slotKey],
      user_id: newName.trim(),
      updated_at: new Date().toISOString()
    };
    
    schedule.slots_data = newSlotsData; // Optimistic
    
    const { error } = await supabase
      .from('exchange_schedules')
      .update({ slots_data: newSlotsData })
      .eq('target_id', targetId)
      .eq('base_date', bDate);
      
    if (error) {
      alert("修改名稱失敗: " + error.message);
    }
  }
}

</script>
