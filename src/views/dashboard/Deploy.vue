<template>
  <div class="relative min-h-[calc(100vh-8rem)] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center p-8">
    
    <!-- Background Video -->
    <video 
      autoplay 
      loop 
      muted 
      playsinline 
      class="absolute inset-0 w-full h-full object-cover"
    >
      <source src="/mining-chicken.mp4" type="video/mp4" />
    </video>

    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/65 dark:bg-black/75 backdrop-blur-[3px]"></div>

    <!-- Content -->
    <div class="relative z-10 flex flex-col items-center justify-center text-center">
      <div class="inline-flex items-center gap-2 text-white/90 mb-6 bg-black/40 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10 shadow-2xl">
        <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-sm font-semibold tracking-widest uppercase">Work in Progress</span>
      </div>
      
      <h2 class="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
        任務部屬功能<span class="text-blue-400">開發中</span>
      </h2>
      
      <p class="text-lg md:text-xl text-gray-200 max-w-2xl mb-10 drop-shadow-md leading-relaxed">
        我們正在努力為您打造最強大的自動化任務部屬系統。目前<span class="font-bold text-white bg-blue-600/40 px-2 py-0.5 rounded mx-1 border border-blue-500/30">靠北雞</span>正在加緊趕工挖礦中，敬請期待即將推出的全新功能！
      </p>
      
      <button @click="$router.push('/dashboard')" class="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] flex items-center gap-3 hover:-translate-y-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        返回儀表板
      </button>
    </div>
  </div>
</template>

<script setup>
// Deploy placeholder page using full-width mining chicken video
</script>
