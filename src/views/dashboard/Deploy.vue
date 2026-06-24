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
  <UnderDevelopment 
    v-else
    title="任務部署功能<span class='text-blue-400'>開發中</span>"
    description="我們正在努力為您打造最強大的自動化任務部署系統。目前正在趕工中，敬請期待！"
  />
</template>

<script setup>
import { viewAsAdmin } from '../../utils/adminState'
import UnderDevelopment from '../../components/common/UnderDevelopment.vue'
</script>
