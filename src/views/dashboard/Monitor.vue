<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-white tracking-tight">設備監控</h1>
        <p class="text-ror-muted mt-1">即時同步資源、等級、目前任務與日誌</p>
      </div>
      <div class="flex gap-4">
        <div class="bg-[#1a1a1a] border border-ror-border rounded px-4 py-2 flex items-center">
          <div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span class="text-sm font-medium">在線: 16</span>
        </div>
      </div>
    </div>

    <!-- 16 Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="i in 16" :key="i" class="bg-ror-card border border-ror-border rounded-xl p-4 flex flex-col gap-3 hover:border-ror-accent transition-colors group cursor-pointer">
        <!-- Header -->
        <div class="flex justify-between items-center border-b border-ror-border/50 pb-2">
          <div class="flex items-center gap-2">
            <span class="text-white font-bold tracking-wider">ROR-{{ String(i).padStart(2, '0') }}</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">運行中</span>
          </div>
          <button class="text-ror-muted hover:text-white transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
          </button>
        </div>

        <!-- Status Details -->
        <div class="flex-1 space-y-2">
          <div class="flex justify-between items-center text-sm">
            <span class="text-ror-muted">目前任務</span>
            <span class="text-ror-accent font-medium text-right line-clamp-1 max-w-[120px]">主線自動掛機</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-ror-muted">金幣</span>
            <span class="text-yellow-400 font-mono">1.2M</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-ror-muted">等級</span>
            <span class="text-white font-mono">Lv. {{ 40 + (i % 10) }}</span>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden mt-1">
          <div class="h-full bg-ror-accent w-3/4 rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
