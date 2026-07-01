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
        <div class="absolute inset-0 bg-gradient-to-br from-ror-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div class="space-y-3 flex-1 text-center md:text-left">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20">
              <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              最新版本 v0.4.002
            </div>
            <h2 class="text-2xl font-bold">ROR_JS 掛機框架</h2>
            <p class="text-ror-muted">發布日期：2026-07-01</p>
          </div>
          <div class="flex flex-col gap-3 w-full md:w-auto">
            <a href="https://github.com/w8s3suimin/ROR_JS/releases/latest" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-2 bg-ror-accent text-black px-8 py-4 rounded-xl font-bold hover:bg-ror-accent-hover transition-all shadow-[0_0_20px_rgba(255,204,0,0.3)] hover:shadow-[0_0_30px_rgba(255,204,0,0.5)] transform hover:-translate-y-1">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>
              前往 GitHub 下載
            </a>
          </div>
        </div>
      </div>

      <!-- Patch Notes Timeline -->
      <div class="space-y-8 relative">
        <h2 class="text-2xl font-bold border-b border-ror-border pb-4 flex items-center gap-3">
          <svg class="w-6 h-6 text-ror-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          版本更新紀錄
        </h2>

        <!-- Masonry Timeline Container -->
        <div ref="containerRef" class="relative mt-12 transition-all duration-500" :style="{ height: containerHeight }">
          
          <!-- SVG Elbow Lines (Desktop only) -->
          <svg class="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0">
            <path 
              v-for="(path, idx) in svgPaths" 
              :key="'path-'+idx"
              :d="path"
              fill="none"
              stroke-width="1.5"
              class="transition-all duration-700 ease-out"
              :class="patches[idx].isLatest || hoveredIndex === idx ? 'stroke-ror-accent' : 'stroke-ror-border'"
            />
          </svg>

          <!-- Central Line (Desktop) -->
          <div class="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-ror-border transform -translate-x-1/2 z-0"></div>
          
          <!-- Mobile Timeline Line -->
          <div class="md:hidden absolute left-[16px] top-0 bottom-0 w-px bg-ror-border transform -translate-x-1/2 z-0"></div>

          <!-- Central Dots (Desktop only) -->
          <div class="hidden md:block">
            <div 
              v-for="(dotY, idx) in dotPositions" 
              :key="'dot-'+idx"
              class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full z-10 transition-all duration-300 ease-out"
              :class="patches[idx].isLatest || hoveredIndex === idx ? 'bg-ror-accent shadow-[0_0_10px_rgba(255,204,0,0.5)] border-transparent scale-125' : 'bg-[#1A1A1A] border-2 border-ror-border scale-100'"
              :style="{ top: `${dotY}px`, marginTop: '-8px' }"
            ></div>
          </div>

          <template v-for="(patch, idx) in patches.slice(0, visibleCount)" :key="patch.version">
            <div 
              :ref="el => setItemRef(el, idx)"
              class="w-full md:w-1/2 relative group transition-all duration-700 ease-out pl-[48px] mb-8 md:mb-0"
              :class="idx % 2 === 0 ? 'md:pr-12 md:pl-0 md:left-0' : 'md:pl-12 md:right-0 md:left-auto'"
              :style="itemStyles[idx] || { opacity: 0 }"
              @mouseenter="hoveredIndex = idx"
              @mouseleave="hoveredIndex = null"
            >
              <!-- Mobile Dot & Line -->
              <div class="md:hidden absolute top-[32px] left-[16px] transform -translate-x-1/2 w-4 h-4 rounded-full z-10 transition-transform duration-300 group-hover:scale-125" :class="patch.isLatest ? 'bg-ror-accent shadow-[0_0_10px_rgba(255,204,0,0.5)] border-transparent' : 'bg-[#1A1A1A] border-2 border-ror-border group-hover:bg-ror-accent group-hover:border-transparent'"></div>
              <div class="md:hidden absolute top-10 left-[16px] w-[32px] h-px bg-ror-border group-hover:bg-ror-accent transition-colors z-0"></div>

              <!-- Card -->
              <div class="bg-[#1A1A1A] border border-ror-border rounded-xl p-6 hover:border-ror-accent transition-colors relative group-hover:-translate-y-1 duration-300 shadow-lg z-10">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-xl font-bold" :class="patch.isLatest ? 'text-ror-accent' : 'text-white group-hover:text-ror-accent transition-colors'">{{ patch.version }}</h3>
                  <span class="text-sm text-ror-muted font-mono bg-black/50 px-2 py-1 rounded">{{ patch.date }}</span>
                </div>
                <ul class="space-y-2 text-gray-300 text-sm leading-relaxed">
                  <li v-for="(feat, fIdx) in patch.features" :key="fIdx" class="flex gap-3">
                    <span :class="feat.color + ' shrink-0'">{{ feat.icon }}</span> 
                    <span v-html="feat.desc"></span>
                  </li>
                </ul>
              </div>
            </div>
          </template>
        </div>

        <!-- Scroll Trigger for Loading More -->
        <div ref="loadMoreTrigger" class="h-10 w-full flex items-center justify-center pt-8">
          <div v-if="visibleCount < patches.length" class="text-ror-muted text-sm animate-pulse">
            向下滾動載入更多...
          </div>
          <div v-else class="text-ror-muted text-sm border-t border-ror-border w-full text-center pt-6">
            已經到底部了，更多歷史更新請見 GitHub 上的完整 PatchNote.md。
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const loadMoreTrigger = ref(null)
const containerRef = ref(null)
let observer = null
let resizeObserver = null

const visibleCount = ref(4)
const hoveredIndex = ref(null)

const itemElements = ref([])
const itemStyles = ref([])
const containerHeight = ref('auto')
const dotPositions = ref([])
const svgPaths = ref([])

const setItemRef = (el, idx) => {
  if (el) {
    itemElements.value[idx] = el
  }
}

const patches = ref([
  {
    version: 'v0.4.002',
    date: '2026-07-01',
    isLatest: true,
    features: [
      { icon: '✨', color: 'text-blue-400', desc: '<strong>優化進度顯示：</strong>新增自動更新進度條與動畫提示，明確顯示下載進度以避免誤判為程式當機。' },
      { icon: '✨', color: 'text-purple-400', desc: '<strong>增量更新升級：</strong>升級自動更新機制，實作MD5比對僅下載有更動的檔案，大幅縮短更新時間。' },
      { icon: '🛠️', color: 'text-yellow-400', desc: '<strong>對話框修復：</strong>解決檢查更新時，系統對話框可能遭懸浮窗遮擋或導致介面無回應的問題。' },
      { icon: '🛠️', color: 'text-yellow-400', desc: '<strong>圖標更新：</strong>因應遊戲改版，更新雙人同行判定圖標。' }
    ]
  },
  {
    version: 'v0.4.001',
    date: '2026-06-30',
    features: [
      { icon: '🚨', color: 'text-red-500', desc: '<strong>重大修復：</strong>因應近期遊戲更新導致玩法按鈕位置大洗牌（造成多數腳本失效），現已全面升級為「智慧判定位置」，確保各項任務恢復正常運作。' },
      { icon: '✨', color: 'text-yellow-400', desc: '<strong>雲端監控：</strong>實裝授權碼驗證，設備與角色雲端同步系統正式上線（含空白名稱防護）。' },
      { icon: '🛒', color: 'text-blue-400', desc: '<strong>商會訂單優化：</strong>新增二次水晶掃描機制提升辨識率，並加入面板防呆及數據歸零防護，避免任務卡死或錯誤覆蓋雲端。' },
      { icon: '🛠️', color: 'text-gray-400', desc: '<strong>登入與連線優化：</strong>解決切換帳號、紅月超時與地圖卡死等問題；並強化網路容錯機制，徹底解決連線池延遲關閉的卡頓。' }
    ]
  },  {
    version: 'v0.3.003',
    date: '2026-06-24',
    features: [
      { icon: '🎯', color: 'text-blue-400', desc: '<strong>主線與紅月優化：</strong>主線新增任務種類選擇；紅月優化防卡死機制與專屬特徵判定，並加入領獎次數長按快捷設定。' },
      { icon: '✨', color: 'text-yellow-400', desc: '<strong>系統與新功能：</strong>新增授權碼快速設定、自動更新修復，並支援商會訂單掃描時自動回傳水晶總量。' },
      { icon: '🐾', color: 'text-orange-400', desc: '<strong>任務防呆修復：</strong>修復獸王爭霸結算誤判、寵物派遣活力值裁切與數量防呆，以及換角時的雲端資訊錯亂問題。' },
      { icon: '🛠️', color: 'text-gray-400', desc: '<strong>穩定度與資料庫升級：</strong>解決介面內存溢出(OOM)問題，優化 Supabase 上傳重試機制防丟包，並加入即時日誌反饋。' }
    ]
  },
  {
    version: 'v0.3.002',
    date: '2026-06-20',
    features: [
      { icon: '🗺️', color: 'text-blue-400', desc: '<strong>尋寶任務優化：</strong>修正找圖區域限制，優化運算速度並避免因圖標超出螢幕導致的點擊錯誤。' },
      { icon: '🌕', color: 'text-blue-400', desc: '<strong>紅月任務優化：</strong>新增「BOSS出現」的區域特徵點判定，並修復了介面等待秒數的顯示錯誤，使日誌等待時間正確顯示為真實秒數。' }
    ]
  },
  {
    version: 'v0.3.001',
    date: '2026-06-12',
    features: [
      { icon: '🛠️', color: 'text-blue-400', desc: '<strong>內存優化：</strong>修復發生異常時未正確回收畫面變數所導致的 OOM 內存洩漏問題。' },
      { icon: '🗺️', color: 'text-blue-400', desc: '<strong>尋寶任務優化：</strong>新增道具用罄的驗證機制，並強化退出與啟動時的面板判定。' },
      { icon: '🐾', color: 'text-blue-400', desc: '<strong>寵物派遣優化：</strong>處理再次委派時因連線異常導致的畫面卡死問題，自動關閉異常面板並恢復執行。' },
      { icon: '💾', color: 'text-blue-400', desc: '<strong>設定檔安全機制：</strong>為設定存檔實裝「原子寫入」與「備份回退」機制。' },
      { icon: '🌕', color: 'text-blue-400', desc: '<strong>紅月任務優化：</strong>領取獎勵時新增實際獲取驗證，新增防亂跑機制。' }
    ]
  },
  {
    version: 'v0.2.003',
    date: '2026-06-12',
    features: [
      { icon: '🦁', color: 'text-purple-400', desc: '<strong>獸王爭霸賽：</strong>支援全自動參與獸王爭霸賽活動。' },
      { icon: '⚔️', color: 'text-purple-400', desc: '<strong>公會試煉：</strong>支援全自動參與公會試煉活動。' },
      { icon: '👯', color: 'text-purple-400', desc: '<strong>雙人同行：</strong>支援全自動進行雙人同行任務。' },
      { icon: '🌕', color: 'text-purple-400', desc: '<strong>紅月任務優化：</strong>領取紅月任務獎勵後改為定時監視畫面狀態。' }
    ]
  },
  {
    version: 'v0.2.002',
    date: '2026-06-05',
    features: [
      { icon: '🔄', color: 'text-green-400', desc: '<strong>角色切換：</strong>切換角色時新增讀取畫面狀態偵測，避免無效等待。' },
      { icon: '🔙', color: 'text-green-400', desc: '<strong>返回登入：</strong>支援返回登入時自動處理更新彈窗並重啟。' },
      { icon: '📬', color: 'text-green-400', desc: '<strong>信件與福利：</strong>自動領取郵件獎勵與福利，自動清理已讀信件。' },
      { icon: '🗺️', color: 'text-green-400', desc: '<strong>尋寶任務：</strong>優化尋寶關卡點擊邏輯，動態滑動尋找關卡。' }
    ]
  },
  {
    version: 'v0.2.001',
    date: '2026-05-21',
    features: [
      { icon: '🐰', color: 'text-yellow-400', desc: '<strong>每日挑戰：</strong>新增全自動功能，支援優先順序自選與自動刷新任務。' },
      { icon: '🗺️', color: 'text-yellow-400', desc: '<strong>尋寶任務：</strong>新增全自動流程，支援自動前往與進入秘境清怪。' },
      { icon: '🛡️', color: 'text-yellow-400', desc: '<strong>防卡死保護：</strong>新增遊戲載入卡死偵測與回城失敗安全熔斷保護。' }
    ]
  },
  {
    version: 'v0.1.002',
    date: '2026-05-17',
    features: [
      { icon: '🏠', color: 'text-red-400', desc: '<strong>智慧主畫面偵測與回城優化：</strong>全面升級主畫面偵測演算法。' },
      { icon: '⏳', color: 'text-red-400', desc: '<strong>主線任務時間控管：</strong>主線任務介面新增執行時間設定項。' }
    ]
  },
  {
    version: 'v0.1.001',
    date: '2026-05-10',
    features: [
      { icon: '🌕', color: 'text-orange-400', desc: '<strong>紅月與地下城智慧完成跳過：</strong>現在腳本能自動辨識任務是否已經完成。' },
      { icon: '📊', color: 'text-orange-400', desc: '<strong>日誌進度即時掌握：</strong>在日誌介面中新增「當前任務」與「執行對象」的顯示。' }
    ]
  }
])

const calculateLayout = () => {
  if (window.innerWidth < 768) {
    itemStyles.value = patches.value.map(() => ({
      position: 'relative',
      top: 'auto',
      opacity: 1
    }))
    containerHeight.value = 'auto'
    dotPositions.value = []
    svgPaths.value = []
    return
  }

  const GAP = 32
  const tops = []
  let leftBottom = 0
  let rightBottom = 0

  itemElements.value.forEach((el, idx) => {
    if (idx >= visibleCount.value) return
    if (!el) return

    const height = el.offsetHeight
    let top = 0

    if (idx === 0) {
      top = 0
      leftBottom = top + height
    } else if (idx === 1) {
      top = leftBottom / 2
      rightBottom = top + height
    } else {
      if (idx % 2 === 0) {
        const idealTop = tops[idx - 1] + itemElements.value[idx - 1].offsetHeight / 2
        top = Math.max(idealTop, leftBottom + GAP)
        leftBottom = top + height
      } else {
        const idealTop = tops[idx - 1] + itemElements.value[idx - 1].offsetHeight / 2
        top = Math.max(idealTop, rightBottom + GAP)
        rightBottom = top + height
      }
    }
    tops[idx] = top
  })

  itemStyles.value = tops.map(t => ({
    position: 'absolute',
    top: `${t}px`,
    opacity: 1,
    pointerEvents: 'auto'
  }))
  
  for (let i = tops.length; i < patches.value.length; i++) {
    itemStyles.value[i] = { opacity: 0, pointerEvents: 'none', position: 'absolute' }
  }

  const rawContainerH = Math.max(leftBottom, rightBottom)
  
  // --- Proportional Timeline & SVG ---
  const containerW = containerRef.value?.offsetWidth || 800
  const centerX = containerW / 2
  
  const visiblePatches = patches.value.slice(0, visibleCount.value)
  const actualVisibleCount = visiblePatches.length
  const timestamps = visiblePatches.map(p => Date.parse(p.date))
  const minTime = Math.min(...timestamps)
  const maxTime = Math.max(...timestamps)
  
  const padding = 60
  const availableH = rawContainerH - 2 * padding
  
  const dots = []
  const paths = []
  
  for (let i = 0; i < actualVisibleCount; i++) {
    let dotY = padding
    if (maxTime > minTime) {
      const ratio = (maxTime - timestamps[i]) / (maxTime - minTime)
      dotY = padding + ratio * availableH
    }
    
    // Collision resolution
    if (i > 0 && dotY < dots[i - 1] + 24) {
      dotY = dots[i - 1] + 24
    }
    dots.push(dotY)
    
    // SVG Path calculation
    const boxY = tops[i] + 40 // Anchor height (40px matches top-10 in tailwind)
    const isLeft = i % 2 === 0
    const dir = isLeft ? 1 : -1
    const boxX = isLeft ? centerX - 48 : centerX + 48 // Matches pr-12 and pl-12 spacing
    
    // Orthogonal 90-degree step path
    const midX = boxX + 24 * dir
    
    paths.push(`M ${boxX} ${boxY} L ${midX} ${boxY} L ${midX} ${dotY} L ${centerX} ${dotY}`)
  }
  
  dotPositions.value = dots
  svgPaths.value = paths

  // Adjust container height if dots got pushed down too far
  const finalHeight = Math.max(rawContainerH, (dots[dots.length - 1] || 0) + padding)
  containerHeight.value = `${finalHeight}px`
}

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      if (visibleCount.value < patches.value.length) {
        visibleCount.value = Math.min(visibleCount.value + 2, patches.value.length)
        nextTick(() => {
          setTimeout(calculateLayout, 50)
        })
      }
    }
  }, { rootMargin: '100px' })

  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value)
  }

  resizeObserver = new ResizeObserver(() => {
    calculateLayout()
  })
  resizeObserver.observe(document.body)
  
  nextTick(() => {
    setTimeout(calculateLayout, 50)
  })
})

onUnmounted(() => {
  if (observer) observer.disconnect()
  if (resizeObserver) resizeObserver.disconnect()
})
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

