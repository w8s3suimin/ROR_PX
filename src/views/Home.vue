<template>
  <div class="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center text-center px-4 relative pt-16">
    <!-- Hero Image (Mascot) -->
    <div class="mb-8 relative group">
      <div class="absolute inset-0 bg-ror-accent/20 rounded-full blur-[80px] group-hover:bg-ror-accent/40 transition-all duration-700 pointer-events-none"></div>
      <img src="../assets/mascot.jpg" alt="Superman Chicken" class="relative z-10 w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-[0_20px_50px_rgba(255,204,0,0.5)] transform group-hover:scale-105 group-hover:-translate-y-4 transition-all duration-500 ease-out" />
    </div>

    <!-- Welcome Text -->
    <h1 class="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-ror-accent tracking-tight mb-4 animate-fade-in-up">
      歡迎來到 ROR-PX 官網
    </h1>
    <p class="text-ror-muted text-lg md:text-xl max-w-2xl mb-8 animate-fade-in-up animation-delay-200">
      您專屬的 ROR 無人雞管理中心。在這裡，您可以輕鬆監控、同步部屬與掌握所有角色資源資訊。
    </p>

    <!-- Beginner Guide CTA Button -->
    <div class="mb-12 flex flex-wrap justify-center gap-4 animate-fade-in-up animation-delay-200">
      <button 
        @click="isModalOpen = true"
        class="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-black bg-gradient-to-r from-amber-300 via-ror-accent to-yellow-400 hover:from-yellow-300 hover:to-amber-400 shadow-[0_0_25px_rgba(255,204,0,0.35)] hover:shadow-[0_0_35px_rgba(255,204,0,0.6)] transform hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
      >
        <span class="text-xl animate-bounce">🔰</span>
        <span class="text-base tracking-wide">新手快速設定引導 (必看)</span>
        <span class="inline-block transition-transform duration-300 group-hover:translate-x-1 font-extrabold">→</span>
      </button>
    </div>

    <!-- Quick Action Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl animate-fade-in-up animation-delay-400 pb-16">
      
      <router-link to="/dashboard" class="bg-ror-card/50 backdrop-blur-md border border-ror-border hover:border-ror-accent p-8 rounded-2xl group transition-all duration-300 relative overflow-hidden flex flex-col items-center hover:shadow-[0_0_30px_rgba(255,204,0,0.15)] hover:-translate-y-1">
        <div class="absolute inset-0 bg-gradient-to-br from-ror-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="w-16 h-16 rounded-full bg-ror-accent/10 flex items-center justify-center mb-4 group-hover:bg-ror-accent/20 transition-colors duration-300">
          <span class="text-3xl">💻</span>
        </div>
        <h3 class="text-xl font-bold text-white mb-2 group-hover:text-ror-accent transition-colors duration-300">進入管理中心</h3>
        <p class="text-ror-muted text-sm text-center">監控您所有的角色資源與無人雞任務。</p>
      </router-link>

      <router-link to="/pricing" class="bg-ror-card/50 backdrop-blur-md border border-ror-border hover:border-ror-accent p-8 rounded-2xl group transition-all duration-300 relative overflow-hidden flex flex-col items-center hover:shadow-[0_0_30px_rgba(255,204,0,0.15)] hover:-translate-y-1">
        <div class="absolute inset-0 bg-gradient-to-br from-ror-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="w-16 h-16 rounded-full bg-ror-accent/10 flex items-center justify-center mb-4 group-hover:bg-ror-accent/20 transition-colors duration-300">
          <span class="text-3xl">💰</span>
        </div>
        <h3 class="text-xl font-bold text-white mb-2 group-hover:text-ror-accent transition-colors duration-300">授權碼方案</h3>
        <p class="text-ror-muted text-sm text-center">查看與購買最新的授權方案。</p>
      </router-link>

      <router-link to="/docs" class="bg-ror-card/50 backdrop-blur-md border border-ror-border hover:border-ror-accent p-8 rounded-2xl group transition-all duration-300 relative overflow-hidden flex flex-col items-center hover:shadow-[0_0_30px_rgba(255,204,0,0.15)] hover:-translate-y-1">
        <div class="absolute inset-0 bg-gradient-to-br from-ror-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="w-16 h-16 rounded-full bg-ror-accent/10 flex items-center justify-center mb-4 group-hover:bg-ror-accent/20 transition-colors duration-300">
          <span class="text-3xl">📖</span>
        </div>
        <h3 class="text-xl font-bold text-white mb-2 group-hover:text-ror-accent transition-colors duration-300">互動說明書</h3>
        <p class="text-ror-muted text-sm text-center">查閱互動式教學與系統操作手冊。</p>
      </router-link>

    </div>

    <!-- 新手引導彈窗 (Beginner Guide Modal) -->
    <div 
      v-if="isModalOpen" 
      class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      @click.self="isModalOpen = false"
    >
      <div class="bg-[#181818] border border-ror-border rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden text-left relative">
        
        <!-- Header -->
        <div class="px-6 py-5 border-b border-ror-border/80 flex items-center justify-between bg-[#1f1f1f]/80">
          <div class="flex items-center gap-3">
            <span class="text-2xl">🔰</span>
            <div>
              <h2 class="text-xl font-bold text-white flex items-center gap-2">
                新手快速初始化設置指南
                <span class="text-xs bg-ror-accent/20 text-ror-accent border border-ror-accent/30 px-2 py-0.5 rounded-full">必看</span>
              </h2>
              <p class="text-xs text-ror-muted mt-0.5">只需 3 分鐘完成基本配置，避免掛機卡住與異常！</p>
            </div>
          </div>
          <button 
            @click="isModalOpen = false"
            class="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <!-- Tab Controls -->
        <div class="flex border-b border-ror-border bg-[#141414] px-6">
          <button 
            @click="activeTab = 'setup'"
            class="py-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer"
            :class="activeTab === 'setup' ? 'border-ror-accent text-ror-accent bg-ror-accent/5' : 'border-transparent text-gray-400 hover:text-white'"
          >
            <span>⚡</span> 3大必做初始化設定
          </button>
          <button 
            @click="activeTab = 'faq'"
            class="py-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer"
            :class="activeTab === 'faq' ? 'border-ror-accent text-ror-accent bg-ror-accent/5' : 'border-transparent text-gray-400 hover:text-white'"
          >
            <span>❓</span> 常見問題 FAQ
          </button>
        </div>

        <!-- Content Area -->
        <div class="p-6 overflow-y-auto space-y-6 flex-1 text-gray-200">
          
          <!-- TAB 1: 3大必做初始化設定 -->
          <div v-if="activeTab === 'setup'" class="space-y-4">
            
            <!-- Step 1: 模擬器設定 -->
            <div class="bg-[#222222] border border-white/10 hover:border-ror-accent/50 rounded-xl p-5 transition-all">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0 text-xl text-amber-400">
                  📱
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <h3 class="text-base font-bold text-white">1. 模擬器解析度設定</h3>
                    <span class="text-xs px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-medium">關鍵比例</span>
                  </div>
                  <div class="mt-2 text-sm text-gray-300 space-y-1.5">
                    <p class="text-ror-accent font-semibold flex items-center gap-1.5">
                      <span>➔</span> 解析度比例請設定為：<strong class="text-white bg-black/40 px-2 py-0.5 rounded border border-white/10">9:16 (直式)</strong>
                    </p>
                    <p class="text-xs text-ror-muted leading-relaxed">
                      推薦解析度如：<code class="text-gray-200 bg-white/5 px-1.5 py-0.5 rounded">720 × 1280</code> 或 <code class="text-gray-200 bg-white/5 px-1.5 py-0.5 rounded">1080 × 1920</code>（建議 DPI 320）。腳本所有圖像特徵與點擊座標皆以直式比例開發，若為橫式將無法正常判讀。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 2: 遊戲介面 -->
            <div class="bg-[#222222] border border-white/10 hover:border-ror-accent/50 rounded-xl p-5 transition-all">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-xl bg-blue-400/10 border border-blue-400/30 flex items-center justify-center shrink-0 text-xl text-blue-400">
                  🎮
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <h3 class="text-base font-bold text-white">2. 遊戲介面設定</h3>
                    <span class="text-xs px-2.5 py-0.5 rounded-full bg-blue-400/20 text-blue-300 border border-blue-400/30 font-medium">防誤觸設置</span>
                  </div>
                  <div class="mt-2 text-sm text-gray-300 space-y-2">
                    <div class="flex items-start gap-2">
                      <span class="text-ror-accent font-bold">①</span>
                      <span><strong>畫質/介面設定：</strong> 請將操控方式改為 <strong class="text-ror-accent">「右手模式」</strong>。</span>
                    </div>
                    <div class="flex items-start gap-2">
                      <span class="text-ror-accent font-bold">②</span>
                      <span><strong>任務追蹤：</strong> 請將主畫面的 <strong class="text-red-400">「任務追蹤按鈕關閉」</strong>，避免自動點擊時誤觸導航。</span>
                    </div>
                    <p class="text-xs text-ror-muted leading-relaxed">
                      💡 右手模式能確保各功能按鈕與腳本辨識完全對齊；關閉任務追蹤可確保路徑行走與對話順暢。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 3: 懸浮鈕位置 -->
            <div class="bg-[#222222] border border-white/10 hover:border-ror-accent/50 rounded-xl p-5 transition-all">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center shrink-0 text-xl text-emerald-400">
                  🎯
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <h3 class="text-base font-bold text-white">3. 懸浮鈕擺放建議</h3>
                    <span class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 font-medium">最佳操作</span>
                  </div>
                  <div class="mt-2 text-sm text-gray-300 space-y-1.5">
                    <p class="text-gray-200">
                      推薦將懸浮鈕拖曳放置在 <strong class="text-ror-accent">螢幕右上角</strong>（人物頭像上方或邊緣），<strong class="text-emerald-400">留四分之一按鈕在畫面中</strong>、手指點得到即可。
                    </p>
                    <p class="text-xs text-ror-muted leading-relaxed">
                      💡 這樣既能隨時點擊喚出控制台，又不會遮擋遊戲中央的主畫面、背包確認框或對話選單。
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- TAB 2: 常見問題 FAQ -->
          <div v-else-if="activeTab === 'faq'" class="space-y-3">
            
            <div 
              v-for="(faq, index) in faqList" 
              :key="index"
              class="bg-[#222222] border border-white/10 rounded-xl overflow-hidden transition-colors"
            >
              <button 
                @click="faq.open = !faq.open"
                class="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-sm text-white hover:text-ror-accent transition-colors gap-3 cursor-pointer"
              >
                <span class="flex items-center gap-2.5">
                  <span class="text-ror-accent">Q:</span>
                  {{ faq.question }}
                </span>
                <span class="text-xs text-ror-accent transition-transform duration-200" :class="faq.open ? 'rotate-180' : ''">▼</span>
              </button>
              <div v-if="faq.open" class="px-5 pb-4 pt-1 text-xs md:text-sm text-ror-muted border-t border-white/5 leading-relaxed bg-black/20">
                <div v-html="faq.answer"></div>
              </div>
            </div>

          </div>

        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-ror-border/80 bg-[#1f1f1f]/90 flex flex-wrap items-center justify-between gap-3">
          <router-link 
            to="/docs" 
            @click="isModalOpen = false"
            class="text-xs md:text-sm text-ror-accent hover:underline flex items-center gap-1.5"
          >
            <span>📖</span> 查看更詳盡的「互動式說明書」
          </router-link>
          <div class="flex items-center gap-3 ml-auto">
            <button 
              @click="isModalOpen = false"
              class="px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold bg-ror-accent text-black hover:bg-ror-accent-hover transition-colors shadow-[0_0_15px_rgba(255,204,0,0.2)] cursor-pointer"
            >
              我知道了，開始使用
            </button>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const isModalOpen = ref(false)
const activeTab = ref('setup')

const faqList = reactive([
  {
    question: '為什麼啟動後日誌一直停在「尋找主畫面」或卡住？',
    answer: '請依序檢查以下三項：<br>1. <strong>模擬器解析度</strong>：是否為 9:16 直式（如 720x1280）。<br>2. <strong>遊戲右手模式</strong>：請確認遊戲內是否已切換為「右手模式」。<br>3. <strong>系統權限</strong>：請至「環境」分頁確認「螢幕截圖」與「無障礙服務」權限是否均已正常開啟。',
    open: true
  },
  {
    question: '遇到遊戲閃退、卡死或手動中斷，如何接續進度？',
    answer: '重新開啟遊戲進入主畫面後，直接點擊懸浮視窗底部的 <strong>「🔄 復原」</strong> 按鈕。系統會自動讀取上一次中斷時的斷點紀錄，跳過已完成的任務與角色繼續執行，不必從頭跑起。',
    open: false
  },
  {
    question: '多帳號與角色清單該如何設定與自動切換？',
    answer: '1. 在「登入 ➔ 帳號」子分頁中，先開啟遊戲帳號選擇畫面，再點擊 <strong>「導入」</strong> 即可自動抓取 Google 帳號清單。<br>2. 在「角色」子分頁中，勾選各伺服器要掛機的角色（☑角1、☑角2、☑角3）。',
    open: false
  },
  {
    question: '各項自動任務（地下城、紅月、交易所等）該如何深入設定？',
    answer: '您可以隨時點擊 <strong>「📖 互動式說明書」</strong>，在畫面中直接點擊任何功能欄位，即會顯示該功能的設定訣竅與最佳參數推薦！',
    open: false
  }
])
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  transform: translateY(20px);
}
.animation-delay-200 { animation-delay: 200ms; }
.animation-delay-400 { animation-delay: 400ms; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.25s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}
</style>

