<template>
  <header class="fixed top-0 left-0 right-0 h-16 bg-[#121212]/90 backdrop-blur-md border-b border-ror-border z-[100] px-6 flex items-center justify-between">
    <!-- Logo & Title -->
    <router-link to="/" class="flex items-center gap-3 group">
      <img src="../../assets/logo.png" alt="ROR Logo" class="w-10 h-10 object-contain rounded-full border border-ror-accent/30 group-hover:border-ror-accent transition-colors" />
      <span class="font-bold text-lg text-white group-hover:text-ror-accent transition-colors">ROR 無人雞</span>
    </router-link>

    <!-- Navigation Links -->
    <nav class="hidden md:flex items-center gap-6">
      <router-link to="/" class="text-sm font-medium transition-colors" :class="$route.path === '/' ? 'text-ror-accent' : 'text-ror-muted hover:text-white'">
        首頁
      </router-link>
      <router-link to="/docs" class="text-sm font-medium transition-colors" :class="$route.path === '/docs' ? 'text-ror-accent' : 'text-ror-muted hover:text-white'">
        互動說明書
      </router-link>
      <router-link to="/pricing" class="text-sm font-medium transition-colors" :class="$route.path === '/pricing' ? 'text-ror-accent' : 'text-ror-muted hover:text-white'">
        方案定價
      </router-link>
      <router-link to="/download" class="text-sm font-medium transition-colors" :class="$route.path === '/download' ? 'text-ror-accent' : 'text-ror-muted hover:text-white'">
        下載與更新
      </router-link>
    </nav>

    <!-- Auth / Dashboard Action -->
    <div class="flex items-center gap-4">
      <template v-if="isLoggedIn">
        <button 
          v-if="$route.path.startsWith('/dashboard')"
          @click="toggleMobileSidebar"
          class="md:hidden bg-ror-accent text-black px-3 py-2 rounded-lg text-sm font-bold hover:bg-ror-accent-hover transition-colors shadow-[0_0_15px_rgba(255,204,0,0.3)] flex items-center gap-1.5"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          管理中心
        </button>
        <router-link 
          v-if="!$route.path.startsWith('/dashboard')"
          to="/dashboard" 
          class="bg-ror-accent text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-ror-accent-hover transition-colors shadow-[0_0_15px_rgba(255,204,0,0.3)]"
        >
          管理中心
        </router-link>
        <router-link 
          v-if="$route.path.startsWith('/dashboard')"
          to="/dashboard" 
          class="hidden md:flex bg-ror-accent text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-ror-accent-hover transition-colors shadow-[0_0_15px_rgba(255,204,0,0.3)]"
        >
          管理中心
        </router-link>
      </template>
      <router-link 
        v-else 
        to="/login" 
        class="border border-ror-border text-white px-4 py-2 rounded-lg text-sm font-bold hover:border-ror-accent hover:text-ror-accent transition-colors"
      >
        登入系統
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../../utils/supabase'

const isLoggedIn = ref(false)
const route = useRoute()

const toggleMobileSidebar = () => {
  window.dispatchEvent(new CustomEvent('toggle-mobile-sidebar'))
}

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  isLoggedIn.value = !!session

  supabase.auth.onAuthStateChange((event, session) => {
    isLoggedIn.value = !!session
  })
})
</script>
