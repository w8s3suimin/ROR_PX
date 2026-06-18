<template>
  <div class="min-h-screen bg-[#121212] flex flex-col">
    <Navbar />
    <!-- Add top padding to account for fixed navbar (h-16 = 64px) -->
    <div class="flex-1 pt-16">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import Navbar from './components/layout/Navbar.vue'
</script>
