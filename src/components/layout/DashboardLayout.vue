<template>
  <div class="h-full flex">
    <Sidebar />
    <main class="flex-1 overflow-y-auto ml-64 p-6 bg-ror-dark">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue'
</script>
