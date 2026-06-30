<template>
  <div class="h-full pb-8">
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
        <div class="grid grid-cols-1 sm:grid-cols-[40%_60%] gap-6 sm:gap-0">
          <div class="flex justify-center sm:pr-8">
            <div class="w-36 sm:w-40 h-full bg-[#1a1a1a] rounded-xl p-4 flex flex-col items-center justify-center border border-white/5 relative overflow-hidden group">
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
          
          <div class="flex w-full sm:w-auto space-x-1 bg-black/20 p-1 rounded-lg border border-white/5 overflow-x-auto hide-scrollbar">
            <button @click="selectedTab = 'daily'" :class="selectedTab === 'daily' ? 'bg-ror-accent/20 text-white font-bold shadow-sm ring-1 ring-ror-accent/30' : 'text-ror-muted hover:text-white'" class="flex-1 sm:flex-none px-3 py-1.5 text-xs rounded-md transition-colors whitespace-nowrap focus:outline-none text-center">日卡</button>
            <button @click="selectedTab = 'weekly'" :class="selectedTab === 'weekly' ? 'bg-ror-accent/20 text-white font-bold shadow-sm ring-1 ring-ror-accent/30' : 'text-ror-muted hover:text-white'" class="flex-1 sm:flex-none px-3 py-1.5 text-xs rounded-md transition-colors whitespace-nowrap focus:outline-none text-center">周卡</button>
            <button @click="selectedTab = 'monthly'" :class="selectedTab === 'monthly' ? 'bg-ror-accent/20 text-white font-bold shadow-sm ring-1 ring-ror-accent/30' : 'text-ror-muted hover:text-white'" class="flex-1 sm:flex-none px-3 py-1.5 text-xs rounded-md transition-colors whitespace-nowrap focus:outline-none text-center">月卡</button>
            <button v-if="isAdminRole" @click="selectedTab = 'infinite'" :class="selectedTab === 'infinite' ? 'bg-ror-accent/20 text-white font-bold shadow-sm ring-1 ring-ror-accent/30' : 'text-ror-muted hover:text-white'" class="flex-1 sm:flex-none px-3 py-1.5 text-xs rounded-md transition-colors font-bold whitespace-nowrap focus:outline-none text-center">尊榮 ∞ 卡</button>
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
              <div @click="copyCode(currentLicense.code)" :class="currentLicense.code === '尚未配發' ? 'cursor-default' : 'cursor-pointer hover:border-ror-accent/50'" class="bg-black/30 px-3 py-2 rounded border border-white/5 text-white select-all text-sm font-mono break-all font-semibold flex items-center justify-between transition-colors">
                <div>{{ currentLicense.code }}</div>
                <div class="flex items-center">
                  <button v-if="currentLicense.code !== '尚未配發' && selectedTab !== 'infinite'" @click.stop="openExtendModal" class="p-1.5 mr-1 rounded-full text-ror-muted hover:text-ror-accent hover:bg-ror-accent/10 hover:shadow-[0_0_10px_rgba(255,204,0,0.3)] transition-all" title="自助展延 / 擴充機台">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </button>
                  <button v-if="currentLicense.code !== '尚未配發'" @click.stop="copyCode(currentLicense.code)" class="p-1.5 rounded-full text-ror-muted hover:text-ror-accent hover:bg-ror-accent/10 hover:shadow-[0_0_10px_rgba(255,204,0,0.3)] transition-all" title="複製授權碼">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                  </button>
                  <button v-else-if="selectedTab !== 'infinite'" @click.stop="openPurchaseModal" class="px-3 py-1 bg-ror-accent text-black font-bold rounded hover:bg-ror-accent/90 transition-colors text-xs whitespace-nowrap shadow-[0_0_10px_rgba(255,204,0,0.2)]">前往開通</button>
                </div>
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

      <div class="bg-ror-card border border-ror-border rounded-xl p-6 md:col-span-2">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <h2 class="text-xl font-bold text-ror-accent">設備狀態</h2>
          <div class="flex w-full sm:w-auto space-x-1 bg-black/20 p-1 rounded-lg border border-white/5">
            <button @click="deviceStatusTab = 'overview'" :class="deviceStatusTab === 'overview' ? 'bg-ror-accent/20 text-white font-bold shadow-sm ring-1 ring-ror-accent/30' : 'text-ror-muted hover:text-white'" class="flex-1 sm:flex-none px-3 py-1.5 text-xs rounded-md transition-colors whitespace-nowrap text-center focus:outline-none">總覽</button>
            <button @click="deviceStatusTab = 'by_license'" :class="deviceStatusTab === 'by_license' ? 'bg-ror-accent/20 text-white font-bold shadow-sm ring-1 ring-ror-accent/30' : 'text-ror-muted hover:text-white'" class="flex-1 sm:flex-none px-3 py-1.5 text-xs rounded-md transition-colors whitespace-nowrap text-center focus:outline-none">依授權分類</button>
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

        <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-3">
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

    <!-- Confirm Modal -->
    <div v-if="buyModal.show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="bg-ror-card border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
        <h3 class="text-xl font-bold text-white mb-2">確認開通授權</h3>
        
        <div v-if="userPxp < buyModal.cost" class="text-ror-muted mb-6">
          <div class="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-4 text-red-400">
            <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            <p class="text-sm">您的 PX 點數不足，請先儲值。</p>
          </div>
          <p class="text-sm">目前點數：<span class="text-white font-bold">{{ userPxp }}</span></p>
          <p class="text-sm">所需點數：<span class="text-yellow-500 font-bold">{{ buyModal.cost }}</span></p>
        </div>
        
        <div v-else class="text-ror-muted mb-6">
          <p class="mb-4 text-sm">即將開通帳戶：<br/><span class="text-white font-bold">{{ userEmail }}</span></p>
          <div class="bg-black/30 p-3 rounded-lg border border-white/5 space-y-2">
            <p class="text-sm flex justify-between"><span>將扣除點數：</span><span class="text-yellow-500 font-bold">{{ buyModal.cost }}</span></p>
            <p class="text-sm flex justify-between"><span>購買後剩餘：</span><span class="text-green-400 font-bold">{{ userPxp - buyModal.cost }}</span></p>
          </div>
        </div>
        
        <div class="flex gap-3 justify-end">
          <button @click="buyModal.show = false" class="px-4 py-2 rounded-lg border border-white/10 text-ror-muted hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">
            取消
          </button>
          <button v-if="userPxp < buyModal.cost" @click="buyModal.show = false" class="px-4 py-2 rounded-lg bg-ror-accent text-black font-bold hover:bg-ror-accent/90 transition-colors text-sm">
            我知道了
          </button>
          <button v-else @click="confirmBuy" :disabled="isBuying" class="px-4 py-2 rounded-lg bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50 text-sm flex items-center justify-center min-w-[100px]">
            <svg v-if="isBuying" class="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {{ isBuying ? '處理中...' : '確認開通' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Extend Modal -->
    <div v-if="extendModal.show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="bg-ror-card border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
        <h3 class="text-xl font-bold text-white mb-4">自助展延 / 擴充機台</h3>
        
        <div class="space-y-4 mb-6">
          <div class="bg-black/30 p-3 rounded-lg border border-white/5 space-y-2">
            <p class="text-sm flex justify-between text-ror-muted"><span>目前帳號：</span><span class="text-white">{{ userEmail }}</span></p>
            <p class="text-sm flex justify-between text-ror-muted"><span>目前機台上限：</span><span class="text-white font-bold">{{ extendModal.currentDevices }} 台</span></p>
            <p class="text-sm flex justify-between text-ror-muted"><span>目前到期時間：</span><span class="text-yellow-500 font-mono">{{ extendModal.currentExpirationFormatted }}</span></p>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-sm text-ror-muted mb-1">欲開通到幾台？ (只能增加)</label>
              <div class="flex items-center gap-2">
                <button @click="extendModal.targetDevices > extendModal.currentDevices ? extendModal.targetDevices-- : null" class="w-8 h-8 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-white" :disabled="extendModal.targetDevices <= extendModal.currentDevices">-</button>
                <input type="number" v-model="extendModal.targetDevices" readonly class="w-16 bg-black border border-white/10 rounded px-2 py-1 text-center text-white font-bold" />
                <button @click="extendModal.targetDevices++" class="w-8 h-8 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-white">+</button>
              </div>
            </div>
            
            <div>
              <label class="block text-sm text-ror-muted mb-1">展延時間</label>
              <div class="flex items-center gap-2">
                <button @click="extendModal.addCycles > 0 ? extendModal.addCycles-- : null" class="w-8 h-8 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-white" :disabled="extendModal.addCycles <= 0">-</button>
                <input type="text" :value="`+ ${extendModal.addCycles} ${extendModal.planType === 'daily' ? '日' : extendModal.planType === 'weekly' ? '周' : '個月'}`" readonly class="w-24 bg-black border border-white/10 rounded px-2 py-1 text-center text-white font-bold" />
                <button @click="extendModal.addCycles++" class="w-8 h-8 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-white">+</button>
              </div>
              <p class="text-xs text-yellow-500 mt-1">預計展延至：{{ targetExpirationFormatted }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-ror-accent/10 p-3 rounded-lg border border-ror-accent/20 space-y-2 mb-6">
          <p class="text-sm flex justify-between text-ror-muted"><span>目前點數：</span><span class="text-white font-bold">{{ userPxp }}</span></p>
          <p class="text-sm flex justify-between text-ror-muted"><span>本次需花費：</span><span class="text-yellow-500 font-bold">{{ calculatedCost }}</span></p>
          <div class="h-px bg-white/10 my-1"></div>
          <p class="text-sm flex justify-between text-ror-muted"><span>扣除後剩餘：</span><span class="font-bold" :class="userPxp >= calculatedCost ? 'text-green-400' : 'text-red-400'">{{ userPxp - calculatedCost }}</span></p>
          <p v-if="userPxp < calculatedCost" class="text-xs text-red-400 text-right mt-1">點數不足！</p>
        </div>
        
        <div class="flex gap-3 justify-end">
          <button @click="extendModal.show = false" class="px-4 py-2 rounded-lg border border-white/10 text-ror-muted hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">
            取消
          </button>
          <button @click="confirmExtend" :disabled="isExtending || userPxp < calculatedCost || (extendModal.addCycles === 0 && extendModal.targetDevices === extendModal.currentDevices)" class="px-4 py-2 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-400 transition-colors disabled:opacity-50 text-sm flex items-center justify-center min-w-[100px]">
            <svg v-if="isExtending" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {{ isExtending ? '處理中...' : '確認扣款並展延' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../utils/supabase'
import { isAdminRole } from '../../utils/adminState'

const router = useRouter()
const userEmail = ref('載入中...')
const userCreatedDate = ref('載入中...')
const userPxp = ref(0)

const selectedTab = ref('monthly')
const deviceStatusTab = ref('overview')

const copied = ref(false)
const copyCode = async (code) => {
  if (code === '尚未配發' || !code) return
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

const buyModal = ref({
  show: false,
  planType: '',
  cost: 0,
  prefix: '',
  days: 0
})
const isBuying = ref(false)

const extendModal = ref({
  show: false,
  planType: '',
  currentDevices: 0,
  targetDevices: 0,
  addCycles: 0,
  currentExpiration: null,
  currentExpirationFormatted: '',
})
const isExtending = ref(false)

const confirmExtend = async () => {
  if (isExtending.value) return
  isExtending.value = true

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('請先登入')
      return
    }

    const { data, error } = await supabase.rpc('user_extend_license', {
      p_code: licenses.value[extendModal.value.planType].code,
      p_add_cycles: extendModal.value.addCycles,
      p_add_devices: extendModal.value.targetDevices - extendModal.value.currentDevices
    })

    if (error) {
      alert('擴充失敗：' + error.message)
    } else if (data && data.success) {
      // 擴充成功，更新本地狀態
      alert('擴充成功！')
      extendModal.value.show = false
      await fetchUserData() // 重新獲取資料與點數
    } else {
      alert('擴充失敗：' + (data?.message || '未知錯誤'))
    }
  } catch (e) {
    console.error('Error extending license:', e)
    alert('發生錯誤，請稍後再試')
  } finally {
    isExtending.value = false
  }
}

const openExtendModal = () => {
  const planType = selectedTab.value
  const lic = licenses.value[planType]
  if (!lic || lic.code === '尚未配發' || planType === 'infinite') return

  extendModal.value = {
    show: true,
    planType,
    currentDevices: lic.limit,
    targetDevices: lic.limit,
    addCycles: 0,
    currentExpiration: lic.expires_at,
    currentExpirationFormatted: new Date(lic.expires_at).toLocaleString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
  }
}

const calculatedCost = computed(() => {
  if (!extendModal.value.show) return 0
  const planType = extendModal.value.planType
  const basePrice = planType === 'daily' ? 20 : planType === 'weekly' ? 100 : 300
  const cycleDays = planType === 'daily' ? 1 : planType === 'weekly' ? 7 : 30

  let remainingDays = 0
  if (extendModal.value.currentExpiration) {
    const diffTime = Math.max(0, new Date(extendModal.value.currentExpiration).getTime() - Date.now())
    remainingDays = diffTime / (1000 * 60 * 60 * 24)
  }

  const addDevices = Math.max(0, extendModal.value.targetDevices - extendModal.value.currentDevices)
  const costAddDevice = Math.floor((remainingDays / cycleDays) * addDevices * basePrice)
  const costExtend = extendModal.value.addCycles * basePrice * extendModal.value.targetDevices

  return Math.max(0, costAddDevice) + costExtend
})

const targetExpirationFormatted = computed(() => {
  if (!extendModal.value.show) return ''
  const cycleDays = extendModal.value.planType === 'daily' ? 1 : extendModal.value.planType === 'weekly' ? 7 : 30
  const addDays = extendModal.value.addCycles * cycleDays
  
  let baseDate = new Date()
  if (extendModal.value.currentExpiration && new Date(extendModal.value.currentExpiration) > baseDate) {
    baseDate = new Date(extendModal.value.currentExpiration)
  }
  
  baseDate.setDate(baseDate.getDate() + addDays)
  return baseDate.toLocaleString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
})

const openPurchaseModal = () => {
  if (selectedTab.value === 'infinite') return
  let cost = 0, prefix = '', days = 0;
  if (selectedTab.value === 'daily') { cost = 20; prefix = 'PXD-'; days = 1; }
  else if (selectedTab.value === 'weekly') { cost = 100; prefix = 'PXW-'; days = 7; }
  else if (selectedTab.value === 'monthly') { cost = 350; prefix = 'PXM-'; days = 30; }
  buyModal.value = { show: true, planType: selectedTab.value, cost, prefix, days }
}

const confirmBuy = async () => {
  if (isBuying.value) return
  isBuying.value = true
  
  try {
    const { data, error } = await supabase.rpc('purchase_license', {
      p_plan_type: buyModal.value.planType,
      p_cost: buyModal.value.cost,
      p_prefix: buyModal.value.prefix,
      p_days: buyModal.value.days
    })
    
    if (error) throw error
    if (!data.success) {
      alert(data.message)
    } else {
      buyModal.value.show = false
      userPxp.value = data.remaining_pxp
      
      licenses.value[buyModal.value.planType].code = data.code
      licenses.value[buyModal.value.planType].days = buyModal.value.days
      licenses.value[buyModal.value.planType].limit = 1
    }
  } catch (error) {
    console.error('Purchase failed', error)
    alert('開通失敗，請稍後再試')
  } finally {
    isBuying.value = false
  }
}

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
  }, 10000)

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
        .select('code, allowed_devices, plan_type, expires_at')
        .eq('user_id', user.id)
      
      if (licenseData && licenseData.length > 0) {
        licenseData.forEach(item => {
          const type = item.plan_type
          if (licenses.value[type]) {
            licenses.value[type].code = item.code
            if (type === 'infinite') {
              licenses.value[type].limit = '∞'
              licenses.value[type].days = '∞'
              licenses.value[type].expires_at = null
            } else {
              licenses.value[type].limit = item.allowed_devices
              licenses.value[type].expires_at = item.expires_at
              if (item.expires_at) {
                const diffTime = Math.max(0, new Date(item.expires_at).getTime() - Date.now())
                licenses.value[type].days = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
              } else {
                licenses.value[type].days = 0
              }
            }
          }
        })
      }

      const { data: devData } = await supabase
        .from('devices_status')
        .select(`
          id, 
          updated_at, 
          is_offline,
          authorization_codes ( plan_type )
        `)
        .eq('user_id', user.id)
      
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
