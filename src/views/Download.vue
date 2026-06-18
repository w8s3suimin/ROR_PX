<template>
  <div class="min-h-screen bg-[#121212] text-white py-12 px-6">
    <div class="max-w-4xl mx-auto space-y-12">
      <!-- Header -->
      <div class="text-center space-y-4 animate-fade-in-up">
        <h1 class="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-ror-accent to-yellow-200">
          腳本下載與更新日誌
        </h1>
        <p class="text-ror-muted text-lg">取得最新版本的 ROR_JS 掛機框架，享受極致穩定與流暢的掛機體驗。</p>
      </div>

      <!-- Download Card -->
      <div class="bg-[#1A1A1A] border border-ror-border rounded-2xl p-8 relative overflow-hidden group hover:border-ror-accent/50 transition-colors duration-500">
        <!-- Glow effect -->
        <div class="absolute inset-0 bg-gradient-to-br from-ror-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div class="space-y-3 flex-1 text-center md:text-left">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20">
              <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              最新版本 v0.3.001
            </div>
            <h2 class="text-2xl font-bold">ROR_JS 掛機框架</h2>
            <p class="text-ror-muted">發布日期：2026-06-12</p>
          </div>
          
          <div class="flex flex-col gap-3 w-full md:w-auto">
            <a href="#" class="flex items-center justify-center gap-2 bg-ror-accent text-black px-8 py-4 rounded-xl font-bold hover:bg-ror-accent-hover transition-all shadow-[0_0_20px_rgba(255,204,0,0.3)] hover:shadow-[0_0_30px_rgba(255,204,0,0.5)] transform hover:-translate-y-1">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>
              前往 GitHub 下載
            </a>
            <p class="text-xs text-ror-muted text-center">推薦使用 GitHub 發布頁面下載最新版</p>
          </div>
        </div>
      </div>

      <!-- Patch Notes Timeline -->
      <div class="space-y-8">
        <h2 class="text-2xl font-bold border-b border-ror-border pb-4 flex items-center gap-3">
          <svg class="w-6 h-6 text-ror-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          版本更新紀錄
        </h2>

        <div class="relative pl-8 md:pl-0 mt-8">
          <!-- Central Line (Desktop only) -->
          <div class="hidden md:block absolute left-[50%] top-0 bottom-0 w-px bg-ror-border transform -translate-x-1/2"></div>
          
          <div class="space-y-12">
            <!-- v0.3.001 -->
            <div class="relative flex flex-col md:flex-row items-center justify-between group">
              <!-- Timeline dot -->
              <div class="absolute left-[-32px] md:left-1/2 w-4 h-4 rounded-full bg-ror-accent transform md:-translate-x-1/2 mt-1.5 md:mt-0 shadow-[0_0_10px_rgba(255,204,0,0.5)] z-10 transition-transform duration-300 group-hover:scale-125"></div>
              
              <div class="w-full md:w-[45%] bg-[#1A1A1A] border border-ror-border rounded-xl p-6 hover:border-ror-accent transition-colors ml-auto md:ml-0 md:mr-auto relative group-hover:-translate-y-1 duration-300">
                <div class="hidden md:block absolute top-6 -right-3 w-3 h-3 bg-[#1A1A1A] border-t border-r border-ror-border transform rotate-45 group-hover:border-ror-accent transition-colors"></div>
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-xl font-bold text-ror-accent">v0.3.001</h3>
                  <span class="text-sm text-ror-muted font-mono bg-black/50 px-2 py-1 rounded">2026-06-12</span>
                </div>
                <ul class="space-y-2 text-gray-300 text-sm leading-relaxed">
                  <li class="flex gap-3"><span class="text-blue-400 shrink-0">🛠️</span> <span><strong>內存優化：</strong>修復發生異常時未正確回收畫面變數所導致的 OOM 內存洩漏問題。</span></li>
                  <li class="flex gap-3"><span class="text-blue-400 shrink-0">🗺️</span> <span><strong>尋寶任務優化：</strong>新增道具用罄的驗證機制，並強化退出與啟動時的面板判定。</span></li>
                  <li class="flex gap-3"><span class="text-blue-400 shrink-0">🐾</span> <span><strong>寵物派遣優化：</strong>處理再次委派時因連線異常導致的畫面卡死問題，自動關閉異常面板並恢復執行。</span></li>
                  <li class="flex gap-3"><span class="text-blue-400 shrink-0">💾</span> <span><strong>設定檔安全機制：</strong>為設定存檔實裝「原子寫入」與「備份回退」機制。</span></li>
                  <li class="flex gap-3"><span class="text-blue-400 shrink-0">🌕</span> <span><strong>紅月任務優化：</strong>領取獎勵時新增實際獲取驗證，新增防亂跑機制。</span></li>
                </ul>
              </div>
            </div>

            <!-- v0.2.003 -->
            <div class="relative flex flex-col md:flex-row items-center justify-between group">
              <div class="absolute left-[-32px] md:left-1/2 w-4 h-4 rounded-full bg-ror-border group-hover:bg-ror-accent transition-all transform md:-translate-x-1/2 mt-1.5 md:mt-0 z-10 duration-300 group-hover:scale-125"></div>
              <div class="w-full md:w-[45%] bg-[#1A1A1A] border border-ror-border rounded-xl p-6 hover:border-ror-accent transition-colors ml-auto relative group-hover:-translate-y-1 duration-300">
                <div class="hidden md:block absolute top-6 -left-3 w-3 h-3 bg-[#1A1A1A] border-b border-l border-ror-border transform rotate-45 group-hover:border-ror-accent transition-colors"></div>
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-xl font-bold text-white group-hover:text-ror-accent transition-colors">v0.2.003</h3>
                  <span class="text-sm text-ror-muted font-mono bg-black/50 px-2 py-1 rounded">2026-06-12</span>
                </div>
                <ul class="space-y-2 text-gray-300 text-sm leading-relaxed">
                  <li class="flex gap-3"><span class="text-purple-400 shrink-0">🦁</span> <span><strong>獸王爭霸賽：</strong>支援全自動參與獸王爭霸賽活動。</span></li>
                  <li class="flex gap-3"><span class="text-purple-400 shrink-0">⚔️</span> <span><strong>公會試煉：</strong>支援全自動參與公會試煉活動。</span></li>
                  <li class="flex gap-3"><span class="text-purple-400 shrink-0">👯</span> <span><strong>雙人同行：</strong>支援全自動進行雙人同行任務。</span></li>
                  <li class="flex gap-3"><span class="text-purple-400 shrink-0">🌕</span> <span><strong>紅月任務優化：</strong>領取紅月任務獎勵後改為定時監視畫面狀態。</span></li>
                </ul>
              </div>
            </div>

            <!-- v0.2.002 -->
            <div class="relative flex flex-col md:flex-row items-center justify-between group">
              <div class="absolute left-[-32px] md:left-1/2 w-4 h-4 rounded-full bg-ror-border group-hover:bg-ror-accent transition-all transform md:-translate-x-1/2 mt-1.5 md:mt-0 z-10 duration-300 group-hover:scale-125"></div>
              <div class="w-full md:w-[45%] bg-[#1A1A1A] border border-ror-border rounded-xl p-6 hover:border-ror-accent transition-colors ml-auto md:ml-0 md:mr-auto relative group-hover:-translate-y-1 duration-300">
                <div class="hidden md:block absolute top-6 -right-3 w-3 h-3 bg-[#1A1A1A] border-t border-r border-ror-border transform rotate-45 group-hover:border-ror-accent transition-colors"></div>
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-xl font-bold text-white group-hover:text-ror-accent transition-colors">v0.2.002</h3>
                  <span class="text-sm text-ror-muted font-mono bg-black/50 px-2 py-1 rounded">2026-06-05</span>
                </div>
                <ul class="space-y-2 text-gray-300 text-sm leading-relaxed">
                  <li class="flex gap-3"><span class="text-green-400 shrink-0">🔄</span> <span><strong>角色切換：</strong>切換角色時新增讀取畫面狀態偵測，避免無效等待。</span></li>
                  <li class="flex gap-3"><span class="text-green-400 shrink-0">🔙</span> <span><strong>返回登入：</strong>支援返回登入時自動處理更新彈窗並重啟。</span></li>
                  <li class="flex gap-3"><span class="text-green-400 shrink-0">📬</span> <span><strong>信件與福利：</strong>自動領取郵件獎勵與福利，自動清理已讀信件。</span></li>
                  <li class="flex gap-3"><span class="text-green-400 shrink-0">🗺️</span> <span><strong>尋寶任務：</strong>優化尋寶關卡點擊邏輯，動態滑動尋找關卡。</span></li>
                </ul>
              </div>
            </div>

            <!-- v0.2.001 -->
            <div class="relative flex flex-col md:flex-row items-center justify-between group">
              <div class="absolute left-[-32px] md:left-1/2 w-4 h-4 rounded-full bg-ror-border group-hover:bg-ror-accent transition-all transform md:-translate-x-1/2 mt-1.5 md:mt-0 z-10 duration-300 group-hover:scale-125"></div>
              <div class="w-full md:w-[45%] bg-[#1A1A1A] border border-ror-border rounded-xl p-6 hover:border-ror-accent transition-colors ml-auto relative group-hover:-translate-y-1 duration-300">
                <div class="hidden md:block absolute top-6 -left-3 w-3 h-3 bg-[#1A1A1A] border-b border-l border-ror-border transform rotate-45 group-hover:border-ror-accent transition-colors"></div>
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-xl font-bold text-white group-hover:text-ror-accent transition-colors">v0.2.001</h3>
                  <span class="text-sm text-ror-muted font-mono bg-black/50 px-2 py-1 rounded">2026-05-21</span>
                </div>
                <ul class="space-y-2 text-gray-300 text-sm leading-relaxed">
                  <li class="flex gap-3"><span class="text-yellow-400 shrink-0">🐰</span> <span><strong>每日挑戰：</strong>新增全自動功能，支援優先順序自選與自動刷新任務。</span></li>
                  <li class="flex gap-3"><span class="text-yellow-400 shrink-0">🗺️</span> <span><strong>尋寶任務：</strong>新增全自動流程，支援自動前往與進入秘境清怪。</span></li>
                  <li class="flex gap-3"><span class="text-yellow-400 shrink-0">🛡️</span> <span><strong>防卡死保護：</strong>新增遊戲載入卡死偵測與回城失敗安全熔斷保護。</span></li>
                </ul>
              </div>
            </div>

          </div>
        </div>
        
        <div class="text-center pt-8">
          <p class="text-ror-muted text-sm border-t border-ror-border pt-6">更多歷史更新內容請見 GitHub 上的完整 PatchNote.md。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}

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
</style>
