<template>
  <aside 
    class="w-64 h-[calc(100vh-4rem)] bg-ror-dark/95 md:bg-ror-dark/80 backdrop-blur-xl border-r border-ror-border flex flex-col fixed left-0 top-16 text-white z-50 transition-transform duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.5)]"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
  >
    <!-- Close Button (Mobile Only) -->
    <div class="md:hidden flex justify-end p-4 border-b border-ror-border/50">
      <button @click="$emit('close')" class="text-ror-muted hover:text-white">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>

    <!-- Navigation Links -->
    <nav class="flex-1 overflow-y-auto py-4 md:py-6 px-4 space-y-2">
      <template v-for="item in navItems" :key="item.name">
        <a v-if="item.external"
          :href="item.path"
          target="_blank"
          class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden text-ror-muted hover:text-white hover:bg-white/5"
        >
          <div class="mr-4 w-5 h-5 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:text-ror-accent">
            <svg v-if="item.icon === 'book'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          </div>
          <span class="font-medium tracking-wide">{{ item.name }}</span>
        </a>
        <router-link v-else
          :to="item.path"
          @click="$emit('close')"
          class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden"
          :class="[
            $route.path === item.path 
              ? 'bg-ror-accent/10 text-ror-accent shadow-[inset_4px_0_0_#ffcc00]' 
              : 'text-ror-muted hover:text-white hover:bg-white/5'
          ]"
        >
          <div class="mr-4 w-5 h-5 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:text-ror-accent"
               :class="[$route.path === item.path ? 'text-ror-accent' : '']">
            <svg v-if="item.icon === 'home'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <svg v-else-if="item.icon === 'chart'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            <svg v-else-if="item.icon === 'database'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
            <svg v-else-if="item.icon === 'cloud'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
          </div>
          <span class="font-medium tracking-wide">{{ item.name }}</span>
        </router-link>
      </template>
    </nav>

    <!-- Bottom Action (Login / Logout) -->
    <div class="p-4 border-t border-ror-border/50">
      <button @click="handleAuthAction" class="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-white/5 hover:bg-ror-accent hover:text-black transition-colors duration-300 text-white group">
        <svg class="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="isLoggedIn" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
        </svg>
        <span class="font-bold">{{ isLoggedIn ? '安全登出' : '前往登入' }}</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../../utils/supabase'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close'])

const route = useRoute()
const router = useRouter()
const isLoggedIn = ref(false)

const navItems = [
  { name: '管理總覽', path: '/dashboard', icon: 'home' },
  { name: '設備監控', path: '/dashboard/monitor', icon: 'chart' },
  { name: '角色管理', path: '/dashboard/characters', icon: 'database' },
  { name: '任務部署', path: '/dashboard/deploy', icon: 'cloud' },
]

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  isLoggedIn.value = !!session

  supabase.auth.onAuthStateChange((event, session) => {
    isLoggedIn.value = !!session
  })
})

const handleAuthAction = async () => {
  if (isLoggedIn.value) {
    await supabase.auth.signOut()
    router.push('/login')
  } else {
    router.push('/login')
  }
}
</script>
