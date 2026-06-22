<template>
  <div class="min-h-[calc(100vh-4rem)] p-4 max-w-7xl mx-auto py-12 relative flex flex-col items-center">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-ror-accent mb-4">
        授權碼方案 (預告)
      </h1>
      <p class="text-ror-muted text-lg max-w-2xl mx-auto">
        我們即將推出基於 PX 點數 (PXP) 的彈性授權方案。<br/>
        儲值比例： <span class="text-white font-semibold">1 台幣 = 1 PXP</span>
      </p>
    </div>

    <!-- 方案卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12 w-full">
      <!-- 日卡 -->
      <div class="bg-ror-surface/50 border border-ror-border rounded-xl p-8 flex flex-col hover:border-ror-accent/50 transition-colors">
        <h3 class="text-2xl font-bold text-white mb-2">日卡方案</h3>
        <div class="text-ror-accent text-4xl font-bold mb-4">20 <span class="text-lg text-ror-muted font-normal">PXP / 天</span></div>
        <ul class="text-ror-muted space-y-3 mb-8 flex-1">
          <li class="flex items-center"><span class="mr-2 text-ror-accent">✓</span> 適合短期測試與臨時掛機</li>
          <li class="flex items-center"><span class="mr-2 text-ror-accent">✓</span> 24 小時精確計時</li>
        </ul>
        <button class="w-full py-3 rounded-lg bg-ror-surface border border-ror-border text-ror-muted cursor-not-allowed opacity-70">
          即將開放
        </button>
      </div>

      <!-- 周卡 -->
      <div class="bg-ror-surface/50 border border-ror-border rounded-xl p-8 flex flex-col hover:border-ror-accent/50 transition-colors relative">
        <h3 class="text-2xl font-bold text-white mb-2">周卡方案</h3>
        <div class="text-ror-accent text-4xl font-bold mb-4">100 <span class="text-lg text-ror-muted font-normal">PXP / 7天</span></div>
        <ul class="text-ror-muted space-y-3 mb-8 flex-1">
          <li class="flex items-center"><span class="mr-2 text-ror-accent">✓</span> 平均每日約 14.28 PXP</li>
          <li class="flex items-center"><span class="mr-2 text-ror-accent">✓</span> 享有按比例加機折扣</li>
        </ul>
        <button class="w-full py-3 rounded-lg bg-ror-surface border border-ror-border text-ror-muted cursor-not-allowed opacity-70">
          即將開放
        </button>
      </div>

      <!-- 月卡 -->
      <div class="bg-ror-surface border-2 border-ror-accent rounded-xl p-8 flex flex-col relative transform hover:-translate-y-1 transition-transform shadow-lg shadow-ror-accent/10">
        <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-ror-accent text-black px-4 py-1 rounded-full text-sm font-bold">
          最超值推薦
        </div>
        <h3 class="text-2xl font-bold text-white mb-2">月卡方案</h3>
        <div class="text-ror-accent text-4xl font-bold mb-4">300 <span class="text-lg text-ror-muted font-normal">PXP / 30天</span></div>
        <ul class="text-ror-muted space-y-3 mb-8 flex-1">
          <li class="flex items-center"><span class="mr-2 text-ror-accent">✓</span> 平均每日僅 10 PXP (半價)</li>
          <li class="flex items-center"><span class="mr-2 text-ror-accent">✓</span> 享有最優惠按比例加機折扣</li>
        </ul>
        <button class="w-full py-3 rounded-lg bg-ror-surface border border-ror-border text-ror-muted cursor-not-allowed opacity-70">
          即將開放
        </button>
      </div>
    </div>

    <!-- 底部聲明按鈕 -->
    <button @click="showInfoModal = true" class="group flex items-center justify-center text-ror-muted hover:text-white transition-colors py-2 px-4 rounded-lg hover:bg-ror-surface/50">
      <svg class="w-5 h-5 mr-2 text-ror-accent group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <span class="underline underline-offset-4 decoration-ror-border group-hover:decoration-ror-accent transition-colors">查看授權機制細節聲明</span>
    </button>

    <!-- 細節聲明 Modal 懸浮框 -->
    <div v-if="showInfoModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" @click.self="showInfoModal = false">
      <div class="bg-ror-surface border border-ror-border rounded-xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-left">
        <button @click="showInfoModal = false" class="absolute top-4 right-4 text-ror-muted hover:text-white transition-colors focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        
        <h3 class="text-2xl font-bold text-white mb-6 flex items-center">
          <svg class="w-6 h-6 mr-2 text-ror-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          授權機制細節聲明
        </h3>
        
        <div class="space-y-6 text-ror-muted text-sm leading-relaxed">
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
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showInfoModal = ref(false)
</script>
