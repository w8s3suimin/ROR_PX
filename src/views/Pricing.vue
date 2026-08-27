<template>
  <div class="min-h-[calc(100vh-4rem)] p-3 md:p-6 max-w-6xl mx-auto pt-6 pb-12 relative flex flex-col items-center">
    
    <!-- 手機模式專屬：左右分頁切換 (Mobile Only Tabs) -->
    <div class="flex md:hidden w-full max-w-sm mb-6 p-1 bg-ror-card border border-ror-border rounded-xl">
      <button 
        @click="activeMobileTab = 'deposit'" 
        :class="activeMobileTab === 'deposit' ? 'bg-ror-accent text-black font-bold shadow-md' : 'text-ror-muted hover:text-white'"
        class="flex-1 py-2.5 text-sm rounded-lg transition-all text-center flex items-center justify-center gap-1.5"
      >
        <span>💎 儲值方案</span>
      </button>
      <button 
        @click="activeMobileTab = 'license'" 
        :class="activeMobileTab === 'license' ? 'bg-ror-accent text-black font-bold shadow-md' : 'text-ror-muted hover:text-white'"
        class="flex-1 py-2.5 text-sm rounded-lg transition-all text-center flex items-center justify-center gap-1.5"
      >
        <span>⚡ 授權碼方案</span>
      </button>
    </div>

    <!-- ================= 區塊：儲值方案 ================= -->
    <section 
      class="w-full max-w-5xl md:mb-14"
      :class="activeMobileTab === 'deposit' ? 'block' : 'hidden md:block'"
    >
      <div class="text-center mb-6 md:mb-8">
        <h1 class="text-2xl md:text-4xl font-bold text-ror-accent mb-2">
          儲值方案
        </h1>
      </div>

      <!-- 儲值比例卡片 Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 w-full mb-6 md:mb-0">
        <!-- 標準儲值 -->
        <div class="bg-ror-card/50 border border-ror-border rounded-xl p-4 md:p-6 flex flex-col hover:border-ror-accent/40 transition-colors">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-base md:text-xl font-bold text-white">標準儲值</h3>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-ror-muted">一般儲值</span>
          </div>
          <div class="text-ror-accent text-2xl md:text-3xl font-bold mb-2">
            1 : 1
            <span class="text-xs text-ror-muted font-normal ml-1">TWD : PXP</span>
          </div>
          <p class="text-ror-muted text-xs md:text-sm mb-4 leading-relaxed">
            正常儲值比例為 1 TWD = 1 PXP，無門檻限制，隨時靈活補充點數。
          </p>
          <div class="mt-auto pt-3 border-t border-white/5 text-xs text-ror-muted flex items-center">
            <span class="text-ror-accent font-bold mr-1.5">✓</span> 正常儲值：1 TWD = 1 PXP
          </div>
        </div>

        <!-- 單次超過 3000 (85折) -->
        <div class="bg-ror-card/50 border border-ror-border rounded-xl p-4 md:p-6 flex flex-col hover:border-ror-accent/40 transition-colors relative">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-base md:text-xl font-bold text-white">大額儲值優惠</h3>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">85 折</span>
          </div>
          <div class="text-ror-accent text-2xl md:text-3xl font-bold mb-2">
            85 折
            <span class="text-xs text-ror-muted font-normal ml-1">滿額折扣</span>
          </div>
          <p class="text-ror-muted text-xs md:text-sm mb-4 leading-relaxed">
            單次儲值超過 3,000 元，結算享 85 折優惠。
          </p>
          <div class="mt-auto pt-3 border-t border-white/5 text-xs text-ror-muted flex items-center">
            <span class="text-ror-accent font-bold mr-1.5">✓</span> 單次儲值超過 3,000 享 85 折
          </div>
        </div>

        <!-- 單次超過 10000 (75折) -->
        <div class="bg-ror-card border-2 border-ror-accent rounded-xl p-4 md:p-6 flex flex-col relative shadow-lg shadow-ror-accent/10 hover:border-ror-accent transition-colors">
          <div class="absolute -top-3 right-4 bg-ror-accent text-black px-3 py-0.5 rounded-full text-[10px] md:text-xs font-bold shadow-md">
            最高優惠
          </div>
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-base md:text-xl font-bold text-white">尊榮儲值特惠</h3>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-ror-accent text-black">75 折</span>
          </div>
          <div class="text-ror-accent text-2xl md:text-3xl font-bold mb-2">
            75 折
            <span class="text-xs text-ror-muted font-normal ml-1">尊榮折扣</span>
          </div>
          <p class="text-ror-muted text-xs md:text-sm mb-4 leading-relaxed">
            單次儲值超過 10,000 元，結算享 75 折最高優惠。
          </p>
          <div class="mt-auto pt-3 border-t border-white/5 text-xs text-ror-muted flex items-center">
            <span class="text-ror-accent font-bold mr-1.5">✓</span> 單次儲值超過 10,000 享 75 折
          </div>
        </div>
      </div>
    </section>

    <!-- 分隔線 Divider (僅桌面版顯示) -->
    <div class="hidden md:block w-full max-w-5xl h-px bg-gradient-to-r from-transparent via-ror-border to-transparent mb-10 md:mb-14"></div>

    <!-- ================= 區塊：授權碼方案 ================= -->
    <section 
      class="w-full max-w-5xl flex flex-col items-center"
      :class="activeMobileTab === 'license' ? 'block' : 'hidden md:flex'"
    >
      <!-- Header -->
      <div class="text-center mb-6 md:mb-10">
        <h2 class="text-2xl md:text-4xl font-bold text-ror-accent mb-2">
          授權碼方案
        </h2>
        <p class="text-ror-muted text-sm md:text-base max-w-2xl mx-auto">
          基於 PX 點數 (PXP) 的彈性方案。
        </p>
      </div>

      <!-- 方案卡片 Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8 w-full mb-4 md:mb-10">
        
        <!-- 日卡 -->
        <div class="bg-ror-card/50 border border-ror-border rounded-xl p-4 md:p-8 flex flex-row md:flex-col items-center md:items-stretch hover:border-ror-accent/50 transition-colors">
          <div class="flex-1 w-full text-left md:text-center md:flex md:flex-col md:h-full">
            <h3 class="text-lg md:text-2xl font-bold text-white mb-0.5 md:mb-2">日卡方案</h3>
            <div class="text-ror-accent text-2xl md:text-4xl font-bold mb-1 md:mb-4">20 <span class="text-xs md:text-lg text-ror-muted font-normal">PXP / 天</span></div>
            <ul class="text-ror-muted space-y-0.5 md:space-y-3 mb-0 md:mb-8 flex-1 text-xs md:text-base text-left">
              <li class="flex items-center"><span class="mr-1 md:mr-2 text-ror-accent">✓</span> 適合短期測試與臨時掛機</li>
              <li class="flex items-center"><span class="mr-1 md:mr-2 text-ror-accent">✓</span> 24 小時精確計時</li>
            </ul>
          </div>
          <div class="ml-2 md:ml-0 md:mt-auto shrink-0 flex items-center justify-center">
            <button v-if="hasLicense('daily')" disabled class="w-12 h-12 md:w-full md:h-auto py-1 md:py-3 text-[10px] md:text-base leading-tight md:leading-normal rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 cursor-not-allowed flex flex-col md:block items-center justify-center">
              <span class="md:hidden">已經</span>
              <span class="md:hidden">開通</span>
              <span class="hidden md:inline">已開通</span>
            </button>
            <button v-else @click="handleBuy('daily', 20, 'PXD-', 1)" class="w-12 h-12 md:w-full md:h-auto py-1 md:py-3 text-[10px] md:text-base leading-tight md:leading-normal rounded-lg bg-yellow-500 hover:bg-yellow-400 border border-yellow-400 text-black font-bold flex flex-col md:block items-center justify-center transition-colors shadow-[0_0_15px_rgba(234,179,8,0.3)]">
              <span class="md:hidden">立即</span>
              <span class="md:hidden">購買</span>
              <span class="hidden md:inline">購買</span>
            </button>
          </div>
        </div>

        <!-- 周卡 -->
        <div class="bg-ror-card/50 border border-ror-border rounded-xl p-4 md:p-8 flex flex-row md:flex-col items-center md:items-stretch hover:border-ror-accent/50 transition-colors relative">
          <div class="flex-1 w-full text-left md:text-center md:flex md:flex-col md:h-full">
            <h3 class="text-lg md:text-2xl font-bold text-white mb-0.5 md:mb-2">周卡方案</h3>
            <div class="text-ror-accent text-2xl md:text-4xl font-bold mb-1 md:mb-4">100 <span class="text-xs md:text-lg text-ror-muted font-normal">PXP / 7天</span></div>
            <ul class="text-ror-muted space-y-0.5 md:space-y-3 mb-0 md:mb-8 flex-1 text-xs md:text-base text-left">
              <li class="flex items-center"><span class="mr-1 md:mr-2 text-ror-accent">✓</span> 平均每日約 14.28 PXP</li>
              <li class="flex items-center"><span class="mr-1 md:mr-2 text-ror-accent">✓</span> 享有按比例加機折扣</li>
            </ul>
          </div>
          <div class="ml-2 md:ml-0 md:mt-auto shrink-0 flex items-center justify-center">
            <button v-if="hasLicense('weekly')" disabled class="w-12 h-12 md:w-full md:h-auto py-1 md:py-3 text-[10px] md:text-base leading-tight md:leading-normal rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 cursor-not-allowed flex flex-col md:block items-center justify-center">
              <span class="md:hidden">已經</span>
              <span class="md:hidden">開通</span>
              <span class="hidden md:inline">已開通</span>
            </button>
            <button v-else @click="handleBuy('weekly', 100, 'PXW-', 7)" class="w-12 h-12 md:w-full md:h-auto py-1 md:py-3 text-[10px] md:text-base leading-tight md:leading-normal rounded-lg bg-yellow-500 hover:bg-yellow-400 border border-yellow-400 text-black font-bold flex flex-col md:block items-center justify-center transition-colors shadow-[0_0_15px_rgba(234,179,8,0.3)]">
              <span class="md:hidden">立即</span>
              <span class="md:hidden">購買</span>
              <span class="hidden md:inline">購買</span>
            </button>
          </div>
        </div>

        <!-- 月卡 -->
        <div class="bg-ror-card border-2 border-ror-accent rounded-xl p-4 md:p-8 flex flex-row md:flex-col items-center md:items-stretch relative transform hover:-translate-y-1 transition-transform shadow-lg shadow-ror-accent/10 mt-2 md:mt-0">
          <!-- 推薦標籤 -->
          <div class="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2 bg-ror-accent text-black px-3 md:px-4 py-0.5 md:py-1 rounded-full text-[10px] md:text-sm font-bold whitespace-nowrap">
            最超值推薦
          </div>
          <div class="flex-1 w-full text-left md:text-center md:flex md:flex-col md:h-full">
            <h3 class="text-lg md:text-2xl font-bold text-white mb-0.5 md:mb-2">月卡方案</h3>
            <div class="text-ror-accent text-2xl md:text-4xl font-bold mb-1 md:mb-4">300 <span class="text-xs md:text-lg text-ror-muted font-normal">PXP / 30天</span></div>
            <ul class="text-ror-muted space-y-0.5 md:space-y-3 mb-0 md:mb-8 flex-1 text-xs md:text-base text-left">
              <li class="flex items-center"><span class="mr-1 md:mr-2 text-ror-accent">✓</span> 平均每日僅 10 PXP</li>
              <li class="flex items-center"><span class="mr-1 md:mr-2 text-ror-accent">✓</span> 享有最優惠比例加機折扣</li>
            </ul>
          </div>
          <div class="ml-2 md:ml-0 md:mt-auto shrink-0 flex items-center justify-center">
            <button v-if="hasLicense('monthly')" disabled class="w-12 h-12 md:w-full md:h-auto py-1 md:py-3 text-[10px] md:text-base leading-tight md:leading-normal rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 cursor-not-allowed flex flex-col md:block items-center justify-center">
              <span class="md:hidden">已經</span>
              <span class="md:hidden">開通</span>
              <span class="hidden md:inline">已開通</span>
            </button>
            <button v-else @click="handleBuy('monthly', 300, 'PXM-', 30)" class="w-12 h-12 md:w-full md:h-auto py-1 md:py-3 text-[10px] md:text-base leading-tight md:leading-normal rounded-lg bg-yellow-500 hover:bg-yellow-400 border border-yellow-400 text-black font-bold flex flex-col md:block items-center justify-center transition-colors shadow-[0_0_15px_rgba(234,179,8,0.3)]">
              <span class="md:hidden">立即</span>
              <span class="md:hidden">購買</span>
              <span class="hidden md:inline">購買</span>
            </button>
          </div>
        </div>

      </div>

      <!-- 底部聲明按鈕 -->
      <button @click="showInfoModal = true" class="group flex items-center justify-center text-ror-muted hover:text-white transition-colors py-2 px-4 rounded-lg hover:bg-ror-card/50 text-sm md:text-base mt-2 md:mt-0">
        <svg class="w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2 text-ror-accent group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span class="underline underline-offset-4 decoration-ror-border group-hover:decoration-ror-accent transition-colors">查看授權機制細節聲明</span>
      </button>
    </section>

    <!-- 細節聲明 Modal 懸浮框 -->
    <div v-if="showInfoModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" @click.self="showInfoModal = false">
      <div class="bg-ror-card border border-ror-border rounded-xl p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-left">
        <button @click="showInfoModal = false" class="absolute top-4 right-4 text-ror-muted hover:text-white transition-colors focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        
        <h3 class="text-xl md:text-2xl font-bold text-white mb-6 flex items-center">
          <svg class="w-6 h-6 mr-2 text-ror-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          授權機制細節聲明
        </h3>
        
        <div class="space-y-4 md:space-y-6 text-ror-muted text-sm leading-relaxed">
          <div>
            <h4 class="text-white font-semibold mb-1">1. 無硬體綁定</h4>
            <p>我們的授權為「最大同時在線機台數」，不綁定模擬器、電腦硬體或 MAC 位址。模擬器損壞可隨時重置，只要同時上線的腳本數量不超過您的授權上限即可。</p>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-1">2. 彈性加機</h4>
            <p>當您需要臨時增加掛機機台時，系統會精準以您原方案的「剩餘天數比例」來計算加機費用（無條件捨去小數點）。這意味著月卡與周卡用戶若有臨時加機需求，同樣享有原方案的單日超值折扣價，讓您的擴充成本降到最低。</p>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-1">3. 友善的自動續費機制</h4>
            <p>我們絕不在背景隨意扣款。授權過期時，只有當您「實際開啟並執行腳本」的瞬間才會觸發續費。為了讓您保有絕對的選擇權，系統預設為「不自動扣款」，只有當您於管理中心勾選「自動續費」，才會啟用本功能。</p>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-1">4. 防暴衝安全上限與無縫擴充</h4>
            <p>我們深知腳本多開可能導致的失誤。因此，在您開啟自動續費機制後，可以在後台明確設定「最大機台授權上限」。只要您的錢包餘額充足並且在安全上限內，您可以使用對應的授權來開啟多台設備，系統會自動幫您擴充額度；若超過您設定的上限，系統將攔截並拒絕扣款，保護您的點數安全。</p>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-1">5. 單一方案專屬授權碼</h4>
            <p>為了方便您管理，每種方案（日/周/月）僅在該帳號第一次購買時派發對應方案授權碼。所有的加機、續費操作，都會直接疊加擴充在該組授權碼上，您不需要管理多組雜亂的授權碼，也不需要頻繁更新授權。</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 購買確認 Modal -->
    <div v-if="buyModal.show" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div class="bg-ror-card border border-ror-border rounded-xl p-6 md:p-8 max-w-sm w-full shadow-2xl relative text-left">
        <h3 class="text-xl font-bold text-white mb-4">確認購買</h3>
        
        <div v-if="userPxp < buyModal.cost" class="text-red-400 mb-6">
          <p class="mb-2 font-bold flex items-center"><svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>您的餘額不足</p>
          <div class="bg-black/30 p-3 rounded-lg border border-red-500/20 mt-3 space-y-1">
            <p class="text-sm">目前餘額：<span class="text-white font-bold">{{ userPxp }}</span> PXP</p>
            <p class="text-sm">方案價格：<span class="text-yellow-500 font-bold">{{ buyModal.cost }}</span> PXP</p>
          </div>
          <p class="mt-4 text-ror-muted text-xs">請進行儲值後再購買。</p>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../utils/supabase'

const router = useRouter()
const showInfoModal = ref(false)
const activeMobileTab = ref('deposit')

const user = ref(null)
const userEmail = ref('')
const userPxp = ref(0)
const ownedPlans = ref([])

const buyModal = ref({
  show: false,
  planType: '',
  cost: 0,
  prefix: '',
  days: 0
})
const isBuying = ref(false)

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    user.value = session.user
    userEmail.value = session.user.email
    await fetchUserData()
  }
})

const fetchUserData = async () => {
  if (!user.value) return
  try {
    const { data: profile } = await supabase.from('profiles').select('pxp').eq('id', user.value.id).single()
    if (profile) userPxp.value = profile.pxp || 0

    const { data: licenses } = await supabase.from('authorization_codes').select('plan_type').eq('user_id', user.value.id)
    if (licenses) {
      ownedPlans.value = licenses.map(l => l.plan_type)
    }
  } catch (error) {
    console.error('Error fetching user data', error)
  }
}

const hasLicense = (plan) => ownedPlans.value.includes(plan)

const handleBuy = (planType, cost, prefix, days) => {
  if (!user.value) {
    router.push('/login')
    return
  }
  buyModal.value = { show: true, planType, cost, prefix, days }
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
      alert('購買成功！授權碼：' + data.code)
      await fetchUserData()
      buyModal.value.show = false
    }
  } catch (err) {
    console.error(err)
    alert('發生錯誤，請稍後再試')
  } finally {
    isBuying.value = false
  }
}
</script>
