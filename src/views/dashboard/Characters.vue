<template>
  <div class="h-full">
    <div class="mb-4 flex items-baseline gap-3 flex-wrap">
      <h1 class="text-2xl md:text-3xl font-bold text-white tracking-tight shrink-0 flex items-center gap-3">
        角色管理
      </h1>
      <p class="text-sm text-ror-muted">集中監控所有帳號角色的狀態、物資與資產</p>
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
      <!-- Desktop List Header -->
      <div class="sticky top-16 z-30 hidden md:grid gap-4 pl-6 pr-20 py-3.5 bg-gradient-to-r from-[#1a1a1a]/95 via-[#222]/95 to-[#1a1a1a]/95 backdrop-blur-md rounded-xl text-[15px] font-black text-ror-accent border border-ror-accent/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)] tracking-wider mb-2 select-none" :class="viewAsAdmin ? 'grid-cols-12' : 'grid-cols-11'">
        <div class="text-center drop-shadow-md cursor-pointer hover:text-white flex items-center justify-center gap-1" :class="viewAsAdmin ? 'col-span-3' : 'col-span-2'" @click="handleSort('game_account')">
          遊戲帳號<span v-if="viewAsAdmin">/平台ID</span>
          <span class="text-[10px]" v-if="sortConfig.key === 'game_account'">{{ sortConfig.dir === 'asc' ? '▲' : '▼' }}</span>
          <span v-if="filters.game_account" @click.stop="clearFilter('game_account')" title="解除過濾" class="text-lg">🔒</span>
        </div>
        <div class="col-span-1 text-center drop-shadow-md cursor-pointer hover:text-white flex items-center justify-center gap-1" @click="handleSort('server_name')">
          伺服器
          <span class="text-[10px]" v-if="sortConfig.key === 'server_name'">{{ sortConfig.dir === 'asc' ? '▲' : '▼' }}</span>
          <span v-if="filters.server_name" @click.stop="clearFilter('server_name')" title="解除過濾" class="text-lg">🔒</span>
        </div>
        <div class="col-span-2 text-center drop-shadow-md">
          角色名稱
        </div>
        <div class="col-span-1 text-center drop-shadow-md cursor-pointer hover:text-white flex items-center justify-center gap-1" @click="handleSort('level')">
          等級
          <span class="text-[10px]" v-if="sortConfig.key === 'level'">{{ sortConfig.dir === 'asc' ? '▲' : '▼' }}</span>
          <span v-if="filters.level" @click.stop="clearFilter('level')" title="解除過濾" class="text-lg">🔒</span>
        </div>
        <div class="col-span-1 text-center drop-shadow-md">職業</div>
        <div class="col-span-1 text-center drop-shadow-md cursor-pointer hover:text-white flex items-center justify-center gap-1" @click="handleSort('dispatch')">
          派遣狀態
          <span class="text-[10px]" v-if="sortConfig.key === 'dispatch'">{{ sortConfig.dir === 'asc' ? '▲' : '▼' }}</span>
          <span v-if="filters.dispatch" @click.stop="clearFilter('dispatch')" title="解除過濾" class="text-lg">🔒</span>
        </div>
        <div class="col-span-1 text-right text-[#4dabf7] drop-shadow-md cursor-pointer hover:text-white flex items-center justify-end gap-1" @click="handleSort('vitality')">
          <span v-if="filters.vitality" @click.stop="clearFilter('vitality')" title="解除過濾" class="text-lg">🔒</span>
          活力值
          <span class="text-[10px]" v-if="sortConfig.key === 'vitality'">{{ sortConfig.dir === 'asc' ? '▲' : '▼' }}</span>
        </div>
        <div class="col-span-2 text-right text-[#ff93d3] drop-shadow-md cursor-pointer hover:text-white flex items-center justify-end gap-1" @click="handleSort('crystal')">
          <span v-if="filters.crystal" @click.stop="clearFilter('crystal')" title="解除過濾" class="text-lg">🔒</span>
          水晶
          <span class="text-[10px]" v-if="sortConfig.key === 'crystal'">{{ sortConfig.dir === 'asc' ? '▲' : '▼' }}</span>
        </div>
      </div>

      <!-- Mobile List Header -->
      <div class="sticky top-16 z-30 flex md:hidden items-center justify-between pl-4 pr-2 py-2.5 bg-gradient-to-r from-[#1a1a1a]/95 via-[#222]/95 to-[#1a1a1a]/95 backdrop-blur-md rounded-xl text-[13px] font-black text-ror-accent border border-ror-accent/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)] tracking-wide mb-2 select-none">
        <div class="flex-[1.2] min-w-0 text-center pr-1 drop-shadow-md cursor-pointer flex items-center justify-center gap-1" @click="handleSort('mobile_account')">
          伺服器/帳號
          <span class="text-[10px]" v-if="sortConfig.key === 'mobile_account'">{{ sortConfig.dir === 'asc' ? '▲' : '▼' }}</span>
          <span v-if="filters.game_account || filters.server_name" @click.stop="clearFilter('game_account'); clearFilter('server_name')" title="解除過濾">🔒</span>
        </div>
        <div class="flex-[1.2] min-w-0 text-center px-1 drop-shadow-md cursor-pointer flex items-center justify-center gap-1" @click="handleSort('level')">
          角色/等級
          <span class="text-[10px]" v-if="sortConfig.key === 'level'">{{ sortConfig.dir === 'asc' ? '▲' : '▼' }}</span>
          <span v-if="filters.level" @click.stop="clearFilter('level')" title="解除過濾">🔒</span>
        </div>
        <div class="flex-[0.8] min-w-0 text-center px-1 text-[#ff93d3] drop-shadow-md cursor-pointer flex items-center justify-center gap-1" @click="handleSort('crystal')">
          <span v-if="filters.crystal" @click.stop="clearFilter('crystal')" title="解除過濾">🔒</span>
          水晶
          <span class="text-[10px]" v-if="sortConfig.key === 'crystal'">{{ sortConfig.dir === 'asc' ? '▲' : '▼' }}</span>
        </div>
        <div class="flex-[0.9] min-w-0 text-right pl-1 text-[#4dabf7] drop-shadow-md cursor-pointer flex items-center justify-end gap-1" @click="handleSort('vitality')">
          <span v-if="filters.vitality || filters.dispatch" @click.stop="clearFilter('vitality'); clearFilter('dispatch')" title="解除過濾">🔒</span>
          活力值
          <span class="text-[10px]" v-if="sortConfig.key === 'vitality'">{{ sortConfig.dir === 'asc' ? '▲' : '▼' }}</span>
        </div>
      </div>

      <!-- List Items -->
      <div 
        v-for="char in filteredAndSortedCharacters" 
        :key="char.id"
        v-memo="[char, expandedRow === char.id, viewAsAdmin]"
        class="bg-ror-card border border-ror-border rounded-xl transition-all duration-300 hover:border-ror-accent relative"
      >
        <!-- Mobile Row (4 columns) -->
        <div 
          class="flex md:hidden items-center justify-between pl-4 pr-2 py-4 cursor-pointer relative"
          @click="openMobileModal(char)"
        >
          <!-- Col 1: Server-Char / Account -->
          <div class="flex-[1.2] min-w-0 pr-1 border-r border-ror-border/30">
            <div class="text-[13px] font-bold text-white truncate">
              <span @click.stop="toggleStringFilter('server_name', char.server_name)" class="hover:text-ror-accent transition-colors">{{ char.server_name }}</span>-角{{ char.char_slot }}
            </div>
            <div class="text-[11px] text-ror-muted truncate mt-1">
              <span @click.stop="toggleStringFilter('game_account', char.game_account)" class="hover:text-ror-accent transition-colors">{{ char.game_account || '未知遊戲帳號' }}</span>
            </div>
          </div>
          
          <!-- Col 2: Char Name & Level -->
          <div class="flex-[1.2] min-w-0 px-1 border-r border-ror-border/30 text-center">
            <div class="text-[13px] font-bold text-white truncate">{{ char.character_name }}</div>
            <div class="text-[11px] font-mono text-gray-300 mt-1 cursor-pointer hover:text-ror-accent" @click.stop="openNumericFilter('level')">Lv.{{ char.level }}</div>
          </div>
          
          <!-- Col 3: Crystal -->
          <div class="flex-[0.8] min-w-0 px-1 border-r border-ror-border/30 text-center flex flex-col items-center justify-center">
            <div class="text-[12px] font-mono text-[#ff93d3] font-bold cursor-pointer hover:opacity-80" @click.stop="openNumericFilter('crystal')">{{ formatNumber(char.crystal) }}</div>
          </div>

          <!-- Col 4: Vitality / Dispatch -->
          <div class="flex-[0.9] text-right min-w-0 pl-1">
            <div class="text-[13px] font-mono text-[#4dabf7] cursor-pointer hover:opacity-80" @click.stop="openNumericFilter('vitality')">{{ formatNumber(char.vitality) }}</div>
            <div class="text-[10px] mt-1">
              <span @click.stop="toggleDispatchFilter(char.dispatch_current >= char.dispatch_max)" class="px-1 py-0.5 rounded font-bold hover:opacity-80 transition-opacity" :class="char.dispatch_current >= char.dispatch_max ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'">
                {{ char.dispatch_current }}/{{ char.dispatch_max }}
              </span>
            </div>
          </div>
        </div>

        <!-- Main Row (Desktop) -->
        <div 
          class="hidden md:grid gap-4 pl-6 pr-20 py-4 cursor-pointer items-center relative"
          :class="viewAsAdmin ? 'grid-cols-12' : 'grid-cols-11'"
          @click="toggleRow(char.id)"
        >
          <div class="truncate text-center" :class="viewAsAdmin ? 'col-span-3' : 'col-span-2'">
            <div class="font-bold text-white text-sm">
              <span @click.stop="toggleStringFilter('game_account', char.game_account)" class="hover:text-ror-accent transition-colors">{{ char.game_account || '未知遊戲帳號' }}</span>
            </div>
            <div v-if="viewAsAdmin" class="text-xs text-ror-muted">{{ char.profiles?.email || '未綁定' }}</div>
          </div>
          <div class="col-span-1 text-sm text-gray-300 truncate text-center">
            <span @click.stop="toggleStringFilter('server_name', char.server_name)" class="inline-block px-2 py-1 rounded bg-white/5 border border-white/10 hover:text-ror-accent hover:border-ror-accent/50 transition-colors">{{ char.server_name }}</span>
          </div>
          <div class="col-span-2 text-center truncate">
            <div class="text-white font-bold text-sm">{{ char.character_name }}</div>
            <div class="text-xs text-ror-muted">角 {{ char.char_slot }}</div>
          </div>
          
          <div class="col-span-1 text-center text-white font-mono relative group">
            <span class="text-sm cursor-pointer hover:text-ror-accent transition-colors" @click.stop="openNumericFilter('level')">Lv.{{ char.level }}</span>
            <div class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden md:group-hover:block whitespace-nowrap bg-black text-gray-300 text-xs px-2 py-1 rounded border border-ror-border z-10 pointer-events-none shadow-lg">
              最後更新: {{ formatTime(char.updated_at) }}
            </div>
          </div>
          
          <div class="col-span-1 text-center text-white text-sm relative group">
            {{ char.profession || '未知' }}
            <div class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden md:group-hover:block whitespace-nowrap bg-black text-gray-300 text-xs px-2 py-1 rounded border border-ror-border z-10 pointer-events-none shadow-lg">
              最後更新: {{ formatTime(char.updated_at) }}
            </div>
          </div>
          
          <div class="col-span-1 text-center relative group">
            <span @click.stop="toggleDispatchFilter(char.dispatch_current >= char.dispatch_max)" class="px-2 py-1 rounded text-xs font-bold hover:opacity-80 transition-opacity" :class="char.dispatch_current >= char.dispatch_max ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'">
              {{ char.dispatch_current }} / {{ char.dispatch_max }}
            </span>
            <div class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden md:group-hover:block whitespace-nowrap bg-black text-gray-300 text-xs px-2 py-1 rounded border border-ror-border z-10 pointer-events-none shadow-lg">
              最後更新: {{ formatTime(char.updated_at) }}
            </div>
          </div>

          <div class="col-span-1 text-right font-mono text-[#4dabf7] relative group">
            <span class="cursor-pointer hover:opacity-80 transition-opacity" @click.stop="openNumericFilter('vitality')">{{ formatNumber(char.vitality) }}</span>
            <div class="absolute right-0 bottom-full mb-2 hidden md:group-hover:block whitespace-nowrap bg-black text-gray-300 text-xs px-2 py-1 rounded border border-ror-border z-10 pointer-events-none shadow-lg">
              最後更新: {{ formatTime(char.updated_at) }}
            </div>
          </div>
          
          <div class="col-span-2 text-right font-mono text-[#ff93d3] relative group">
            <span class="cursor-pointer hover:opacity-80 transition-opacity" @click.stop="openNumericFilter('crystal')">{{ formatNumber(char.crystal) }}</span>
            <div class="absolute right-0 bottom-full mb-2 hidden md:group-hover:block whitespace-nowrap bg-black text-gray-300 text-xs px-2 py-1 rounded border border-ror-border z-10 pointer-events-none shadow-lg">
              最後更新: {{ formatTime(char.updated_at) }}
            </div>
          </div>
          
          <!-- Expand Indicator -->
          <div class="absolute right-4 top-1/2 -translate-y-1/2 text-ror-muted transition-transform duration-300" :class="{ 'rotate-180 text-ror-accent': expandedRow === char.id }">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        <!-- Expanded Detail Row (Special Items) -->
        <div 
          class="hidden md:block bg-[#151515] overflow-hidden transition-all duration-300 rounded-b-xl"
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
      <div v-if="filteredAndSortedCharacters.length === 0" class="text-center py-12 bg-ror-card border border-ror-border rounded-xl">
        <p class="text-ror-muted">找不到符合條件的角色資料。</p>
        <button v-if="hasActiveFilters" @click="clearAllFilters" class="mt-4 px-4 py-2 bg-ror-accent text-black font-bold rounded-lg hover:bg-ror-accent-hover transition-colors">
          清除所有過濾條件
        </button>
      </div>

      <!-- Mobile Modal -->
      <div v-if="selectedMobileChar" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 md:hidden">
        <div class="bg-ror-dark border border-ror-border rounded-xl w-full max-w-sm overflow-hidden flex flex-col max-h-[80vh] shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          <div class="flex justify-between items-center p-4 border-b border-ror-border/50 bg-black/40">
            <h3 class="text-lg font-bold text-white">{{ selectedMobileChar.server_name }}-角{{ selectedMobileChar.char_slot }}</h3>
            <button @click="selectedMobileChar = null" class="text-ror-muted hover:text-white bg-white/5 rounded-lg p-1">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <div class="p-4 overflow-y-auto">
            <h4 class="text-sm font-bold text-ror-accent mb-3 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
              特殊高價物列表
            </h4>
            
            <div v-if="selectedMobileChar.special_items && selectedMobileChar.special_items.length > 0" class="space-y-3">
              <div 
                v-for="(item, idx) in selectedMobileChar.special_items" 
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

      <!-- Numeric Filter Modal -->
      <div v-if="activeNumericFilter" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80">
        <div class="bg-ror-dark border border-ror-border rounded-xl w-full max-w-sm overflow-hidden flex flex-col shadow-[0_0_30px_rgba(0,0,0,0.8)]" @click.stop>
          <div class="flex justify-between items-center p-4 border-b border-ror-border/50 bg-black/40">
            <h3 class="text-lg font-bold text-white">篩選: {{ getFilterName(activeNumericFilter) }}</h3>
            <button @click="activeNumericFilter = null" class="text-ror-muted hover:text-white bg-white/5 rounded-lg p-1 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <div class="p-6 space-y-6">
            <div class="flex items-center gap-4">
              <div class="flex-1">
                <label class="block text-xs text-ror-muted mb-1">最小值</label>
                <input type="number" v-model.number="tempFilterValue.min" class="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ror-accent font-mono text-center" />
              </div>
              <div class="text-ror-muted mt-5 font-bold">-</div>
              <div class="flex-1">
                <label class="block text-xs text-ror-muted mb-1">最大值</label>
                <input type="number" v-model.number="tempFilterValue.max" class="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ror-accent font-mono text-center" />
              </div>
            </div>
            
            <!-- Mobile Slider (only visible on mobile) -->
            <div class="md:hidden pt-6 pb-2 px-3">
              <div class="relative w-full h-2 bg-black/40 rounded-full border border-white/10">
                <!-- Highlight Track -->
                <div class="absolute h-full bg-ror-accent rounded-full pointer-events-none" :style="sliderTrackStyle"></div>
                <!-- Min Thumb -->
                <input type="range" :min="numericLimits[activeNumericFilter]?.min || 0" :max="numericLimits[activeNumericFilter]?.max || 100" :step="sliderStep" v-model.number="tempFilterValue.min" @input="handleMinInput" class="absolute top-[-6px] left-0 w-full appearance-none bg-transparent pointer-events-none z-10 custom-range" />
                <!-- Max Thumb -->
                <input type="range" :min="numericLimits[activeNumericFilter]?.min || 0" :max="numericLimits[activeNumericFilter]?.max || 100" :step="sliderStep" v-model.number="tempFilterValue.max" @input="handleMaxInput" class="absolute top-[-6px] left-0 w-full appearance-none bg-transparent pointer-events-none z-20 custom-range" />
              </div>
              <div class="flex justify-between text-[10px] text-ror-muted mt-3 font-mono">
                <span>{{ formatNumber(numericLimits[activeNumericFilter]?.min || 0) }}</span>
                <span>{{ formatNumber(numericLimits[activeNumericFilter]?.max || 100) }}</span>
              </div>
            </div>
            
            <div class="flex gap-3 pt-2">
              <button @click="clearNumericFilter(activeNumericFilter)" class="flex-1 py-2.5 rounded-lg border border-ror-border text-ror-muted font-bold hover:text-white hover:bg-white/5 transition-colors">清除過濾</button>
              <button @click="applyNumericFilter" class="flex-1 py-2.5 rounded-lg bg-ror-accent text-black font-bold hover:bg-ror-accent-hover transition-colors shadow-[0_0_15px_rgba(255,204,0,0.3)]">套用</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../../utils/supabase'
import { isAdminRole, viewAsAdmin } from '../../utils/adminState'

const characters = ref([])
const loading = ref(true)
const error = ref(null)
const expandedRow = ref(null)
const selectedMobileChar = ref(null)

// Sorting State
const sortConfig = ref({ key: 'game_account', dir: 'asc' })

// Filtering State
const filters = ref({
  game_account: null,
  server_name: null,
  level: null,
  vitality: null,
  crystal: null,
  dispatch: null,
})

const hasActiveFilters = computed(() => {
  return Object.values(filters.value).some(val => val !== null)
})

const clearAllFilters = () => {
  Object.keys(filters.value).forEach(key => {
    filters.value[key] = null
  })
}

// Numeric Filter Popup State
const activeNumericFilter = ref(null)
const tempFilterValue = ref({ min: 0, max: 0 })
const numericLimits = ref({
  level: { min: 1, max: 120 },
  vitality: { min: 0, max: 100000 },
  crystal: { min: 0, max: 1000000 }
})

const SERVER_ORDER = [
  "金玉滿堂", "傾城之戰", "皇后大道", "普隆德拉", "雲之彼端", "世界之樹", 
  "群星之海", "初心相擁", "星夢奇緣", "諸神詠嘆", "重生之境", "南門之約"
]
const getServerWeight = (serverName) => {
  const index = SERVER_ORDER.indexOf(serverName)
  return index !== -1 ? index : 999
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

    if (err) throw err
    
    characters.value = data || []
    
    // Set dynamic max/min for ranges
    if (data && data.length > 0) {
      ['level', 'vitality', 'crystal'].forEach(key => {
        const vals = data.map(c => c && c[key] ? c[key] : 0)
        numericLimits.value[key] = {
          min: Math.min(...vals),
          max: Math.max(...vals)
        }
      })
    }
  } catch (err) {
    console.error('Error fetching characters:', err)
    error.value = `無法拉取角色資料：${err.message}。如果尚未建立資料表，請先至 Supabase 執行初始化 SQL 指令。`
  } finally {
    loading.value = false
  }
})

const toggleRow = (id) => {
  expandedRow.value = expandedRow.value === id ? null : id
}

const openMobileModal = (char) => {
  selectedMobileChar.value = char
}

const formatNumber = (num) => {
  if (num === null || num === undefined) return '0'
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

// Logic methods
const handleSort = (key) => {
  if (sortConfig.value.key === key) {
    sortConfig.value.dir = sortConfig.value.dir === 'asc' ? 'desc' : 'asc'
  } else {
    sortConfig.value = { key, dir: 'asc' }
  }
}

const toggleStringFilter = (key, val) => {
  filters.value[key] = filters.value[key] === val ? null : val
}

const toggleDispatchFilter = (isFull) => {
  const type = isFull ? 'full' : 'not_full'
  filters.value.dispatch = filters.value.dispatch === type ? null : type
}

const clearFilter = (key) => {
  filters.value[key] = null
}

const openNumericFilter = (key) => {
  if (key === 'dispatch') return
  activeNumericFilter.value = key
  if (filters.value[key]) {
    tempFilterValue.value = { ...filters.value[key] }
  } else {
    tempFilterValue.value = { ...(numericLimits.value[key] || { min: 0, max: 100 }) }
  }
}

const applyNumericFilter = () => {
  if (activeNumericFilter.value) {
    filters.value[activeNumericFilter.value] = { ...tempFilterValue.value }
  }
  activeNumericFilter.value = null
}

const clearNumericFilter = (key) => {
  if (key) filters.value[key] = null
  activeNumericFilter.value = null
}

const getFilterName = (key) => {
  const map = { level: '等級', vitality: '活力值', crystal: '水晶' }
  return map[key] || key
}

const sliderStep = computed(() => {
  if (!activeNumericFilter.value) return 1
  const limits = numericLimits.value[activeNumericFilter.value] || { min: 0, max: 100 }
  const range = limits.max - limits.min
  if (range <= 300) return 1
  return Math.max(1, Math.ceil(range / 150))
})

const handleMinInput = () => {
  if (tempFilterValue.value.min > tempFilterValue.value.max) {
    tempFilterValue.value.min = tempFilterValue.value.max
  }
}

const handleMaxInput = () => {
  if (tempFilterValue.value.max < tempFilterValue.value.min) {
    tempFilterValue.value.max = tempFilterValue.value.min
  }
}

const sliderTrackStyle = computed(() => {
  if (!activeNumericFilter.value) return {}
  const key = activeNumericFilter.value
  const limits = numericLimits.value[key] || { min: 0, max: 100 }
  const range = (limits.max - limits.min) || 1
  const tMin = tempFilterValue.value?.min ?? limits.min
  const tMax = tempFilterValue.value?.max ?? limits.max
  const minPercent = ((tMin - limits.min) / range) * 100
  const maxPercent = ((tMax - limits.min) / range) * 100
  const left = Math.min(minPercent, maxPercent)
  const width = Math.abs(maxPercent - minPercent)
  return { left: `${left}%`, width: `${width}%` }
})

// computed for table
const filteredAndSortedCharacters = computed(() => {
  let res = [...characters.value].filter(c => c)
  
  // Filtering
  if (filters.value.game_account) res = res.filter(c => c.game_account === filters.value.game_account)
  if (filters.value.server_name) res = res.filter(c => c.server_name === filters.value.server_name)
  if (filters.value.dispatch === 'full') {
    res = res.filter(c => (Number(c.dispatch_current) || 0) >= (Number(c.dispatch_max) || 0))
  }
  if (filters.value.dispatch === 'not_full') {
    res = res.filter(c => (Number(c.dispatch_current) || 0) < (Number(c.dispatch_max) || 0))
  }
  
  ['level', 'vitality', 'crystal'].forEach(key => {
    if (filters.value[key]) {
      res = res.filter(c => {
        const val = c[key] || 0
        const min = Math.min(filters.value[key].min, filters.value[key].max)
        const max = Math.max(filters.value[key].min, filters.value[key].max)
        return val >= min && val <= max
      })
    }
  })

  // Sorting
  res.sort((a, b) => {
    let diff = 0
    const dir = sortConfig.value.dir === 'asc' ? 1 : -1
    
    if (sortConfig.value.key === 'server_name') {
      diff = getServerWeight(a.server_name) - getServerWeight(b.server_name)
    } else if (sortConfig.value.key === 'mobile_account') {
      // Game Account > Server > Char slot
      const accA = a.game_account || ''
      const accB = b.game_account || ''
      if (accA !== accB) diff = accA.localeCompare(accB)
      else {
        const srvDiff = getServerWeight(a.server_name) - getServerWeight(b.server_name)
        if (srvDiff !== 0) diff = srvDiff
        else diff = (a.char_slot || 0) - (b.char_slot || 0)
      }
    } else if (sortConfig.value.key === 'dispatch') {
      const dCurrA = Number(a.dispatch_current) || 0
      const dMaxA = Number(a.dispatch_max) || 0
      const dCurrB = Number(b.dispatch_current) || 0
      const dMaxB = Number(b.dispatch_max) || 0
      const ratioA = dMaxA > 0 ? dCurrA / dMaxA : 0
      const ratioB = dMaxB > 0 ? dCurrB / dMaxB : 0
      diff = ratioA - ratioB
    } else {
      const valA = a[sortConfig.value.key]
      const valB = b[sortConfig.value.key]
      if (typeof valA === 'string' && typeof valB === 'string') {
        diff = valA.localeCompare(valB)
      } else {
        diff = (valA || 0) - (valB || 0)
      }
    }
    
    return isNaN(diff) ? 0 : diff * dir
  })
  
  return res
})
</script>

<style scoped>
/* Custom Range Slider Thumb */
.custom-range::-webkit-slider-thumb {
  pointer-events: auto;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ffcc00;
  cursor: pointer;
  box-shadow: 0 0 5px rgba(0,0,0,0.8);
  border: 2px solid #fff;
}
.custom-range::-moz-range-thumb {
  pointer-events: auto;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ffcc00;
  cursor: pointer;
  box-shadow: 0 0 5px rgba(0,0,0,0.8);
  border: 2px solid #fff;
}
</style>
