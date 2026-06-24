<template>
  <!-- Real Admin Deploy View -->
  <div v-if="viewAsAdmin" class="h-full animate-fade-in p-4 md:p-6">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white tracking-tight">任務部署</h1>
        <p class="text-ror-muted mt-1">一鍵勾選並下發新任務佇列</p>
      </div>
      <button class="bg-ror-accent text-black px-6 py-2 rounded font-bold hover:bg-ror-accent-hover transition-colors">
        開始部署
      </button>
    </div>

    <div class="bg-ror-card border border-ror-border rounded-xl p-6">
      <p class="text-ror-muted mb-4">請選擇要執行的任務類型：</p>
      <div class="space-y-4">
        <label class="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded border border-transparent hover:border-ror-accent cursor-pointer transition-colors">
          <input type="radio" name="task" class="text-ror-accent focus:ring-ror-accent bg-ror-dark border-ror-border" />
          <span class="text-white">日常自動掛機</span>
        </label>
        <label class="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded border border-transparent hover:border-ror-accent cursor-pointer transition-colors">
          <input type="radio" name="task" class="text-ror-accent focus:ring-ror-accent bg-ror-dark border-ror-border" />
          <span class="text-white">自動打怪升級</span>
        </label>
        <label class="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded border border-transparent hover:border-ror-accent cursor-pointer transition-colors">
          <input type="radio" name="task" class="text-ror-accent focus:ring-ror-accent bg-ror-dark border-ror-border" />
          <span class="text-white">定時採集物資</span>
        </label>
      </div>
    </div>
  </div>

  <!-- Normal User / Dev Placeholder View -->
  <div 
    v-else
    class="relative min-h-[calc(100vh-8rem)] rounded-xl overflow-hidden flex flex-col items-center justify-center p-8 bg-cover bg-center animate-fade-in"
    style="background-image: url('/mining-bg.png');"
  >
    <!-- Overlay for the background image to make text readable and blend the video -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.4)_0%,#0d0d0d_75%,#0d0d0d_100%)] backdrop-blur-[2px]"></div>

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
        任務部署功能<span class="text-blue-400">開發中</span>
      </h2>
      
      <p class="text-base md:text-lg text-gray-300 text-center max-w-2xl mb-8 leading-relaxed drop-shadow-md">
        我們正在努力為您打造最強大的自動化任務部署系統。目前正在趕工中，敬請期待！
      </p>
      
      <button @click="$router.push('/dashboard')" class="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-blue-500/30 flex items-center gap-2 hover:-translate-y-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        返回管理總覽
      </button>
    </div>
  </div>
</template>

<script setup>
import { viewAsAdmin } from '../../utils/adminState'
</script>
