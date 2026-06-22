<template>
  <div class="h-full flex">
    <!-- Mobile Sidebar Overlay -->
    <div 
      v-if="isMobileSidebarOpen" 
      class="fixed inset-0 bg-black/60 z-40 md:hidden"
      @click="isMobileSidebarOpen = false"
    ></div>

    <Sidebar :is-open="isMobileSidebarOpen" @close="isMobileSidebarOpen = false" />
    
    <main class="flex-1 overflow-y-auto md:ml-64 p-4 md:p-6 bg-ror-dark w-full min-h-[calc(100vh-4rem)]">
      <!-- Mobile Header / Toggle -->
      <div class="md:hidden flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-white">{{ currentRouteName }}</h2>
        <button @click="isMobileSidebarOpen = true" class="p-2 text-ror-muted hover:text-white bg-ror-card rounded-lg border border-ror-border">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './Sidebar.vue'

const isMobileSidebarOpen = ref(false)
const route = useRoute()

const currentRouteName = computed(() => {
  switch (route.path) {
    case '/dashboard': return '管理總覽'
    case '/dashboard/monitor': return '設備監控'
    case '/dashboard/characters': return '角色管理'
    case '/dashboard/deploy': return '任務部署'
    default: return '管理中心'
  }
})
</script>
