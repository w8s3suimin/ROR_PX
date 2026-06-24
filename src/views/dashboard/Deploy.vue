<template>
  <div 
    class="relative min-h-[calc(100vh-8rem)] rounded-xl overflow-hidden flex flex-col items-center justify-center p-8 bg-cover bg-center"
    style="background-image: url('/mining-bg.png');"
  >
    <!-- Overlay for the background image to make text readable and blend the video -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.95)_100%)] backdrop-blur-[2px]"></div>

    <div class="relative z-10 flex flex-col items-center w-full">
      <!-- Centered Video Box -->
      <div class="relative w-full max-w-md aspect-video mb-10 overflow-hidden rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] ring-1 ring-white/10 transform transition-transform hover:scale-[1.02]">
        <video 
          autoplay 
          loop 
          muted 
          playsinline 
          class="w-full h-full object-cover"
        >
          <source src="/mining-chicken.mp4" type="video/mp4" />
        </video>
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center pb-4">
          <div class="flex items-center gap-2 text-white/90 bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/5">
            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-xs font-bold tracking-widest uppercase">Work in Progress</span>
          </div>
        </div>
      </div>
      
      <!-- Text Content -->
      <h2 class="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight drop-shadow-lg text-center">
        任務部屬功能<span class="text-blue-400">開發中</span>
      </h2>
      
      <p class="text-base md:text-lg text-gray-300 text-center max-w-2xl mb-8 leading-relaxed drop-shadow-md">
        我們正在努力為您打造最強大的自動化任務部屬系統。目前<span class="font-bold text-white bg-blue-600/30 px-2 py-0.5 rounded mx-1">靠北雞</span>正在加緊趕工挖礦中，敬請期待即將推出的全新功能！
      </p>
      
      <button @click="$router.push('/dashboard')" class="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-blue-500/30 flex items-center gap-2 hover:-translate-y-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        返回儀表板
      </button>
    </div>
  </div>
</template>

<script setup>
// Deploy placeholder page using centered video and generated background image
</script>
