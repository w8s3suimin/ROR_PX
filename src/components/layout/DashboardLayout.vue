<template>
  <div class="h-full flex">
    <!-- Mobile Sidebar Overlay -->
    <div 
      v-if="isMobileSidebarOpen" 
      class="fixed inset-0 bg-black/60 z-40 md:hidden"
      @click="isMobileSidebarOpen = false"
    ></div>

    <Sidebar :is-open="isMobileSidebarOpen" @close="isMobileSidebarOpen = false" />
    
    <main class="flex-1 md:ml-64 p-4 md:p-6 bg-ror-dark w-full min-h-[calc(100vh-4rem)]">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Sidebar from './Sidebar.vue'

const isMobileSidebarOpen = ref(false)

const handleToggleSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value
}

onMounted(() => {
  window.addEventListener('toggle-mobile-sidebar', handleToggleSidebar)
})

onUnmounted(() => {
  window.removeEventListener('toggle-mobile-sidebar', handleToggleSidebar)
})
</script>
