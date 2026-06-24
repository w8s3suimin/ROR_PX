<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800">
    <div class="relative w-full max-w-md aspect-video mb-8 overflow-hidden rounded-2xl shadow-xl ring-1 ring-gray-900/5 dark:ring-white/10">
      <video 
        autoplay 
        loop 
        muted 
        playsinline 
        class="w-full h-full object-cover"
      >
        <source src="/mining-chicken.mp4" type="video/mp4" />
        您的瀏覽器不支援影片標籤。
      </video>
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-4">
        <div class="flex items-center gap-2 text-white/90">
          <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-sm font-medium tracking-wider uppercase">Work in Progress</span>
        </div>
      </div>
    </div>
    
    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">任務部屬功能開發中</h2>
    <p class="text-lg text-gray-500 dark:text-gray-400 text-center max-w-2xl mb-8">
      我們正在努力為您打造最強大的自動化任務部屬系統。目前<span class="font-semibold text-blue-600 dark:text-blue-400">靠北雞</span>正在加緊趕工挖礦中，敬請期待即將推出的全新功能！
    </p>
    
    <button @click="$router.push('/dashboard')" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
      </svg>
      返回儀表板
    </button>
  </div>
</template>

<script setup>
// Deploy placeholder page using mining chicken video
</script>
