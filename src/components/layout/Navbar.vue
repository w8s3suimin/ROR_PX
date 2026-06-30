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
        <div class="hidden md:flex items-center gap-2 mr-2">
          <!-- Admin Toggle (only visible if isAdminRole and in dashboard) -->
          <button 
            v-if="$route.path.startsWith('/dashboard') && isAdminRole" 
            @click="viewAsAdmin = !viewAsAdmin" 
            class="p-1.5 rounded-lg transition-colors group relative" 
            :class="viewAsAdmin ? 'text-green-400 hover:bg-green-400/10' : 'text-red-400 hover:bg-red-400/10'" 
            title="切換管理員檢視"
          >
            <svg v-if="viewAsAdmin" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
          </button>
          
          <span class="text-white text-sm font-medium">{{ userEmail }}</span>
          <span class="text-yellow-400 font-bold text-sm ml-1">{{ userPxp }} PXP</span>
        </div>

        <!-- Dashboard Only Mobile Sidebar Toggle (Left Sidebar) -->
        <button 
          v-if="$route.path.startsWith('/dashboard')"
          @click="toggleMobileSidebar"
          class="md:hidden bg-ror-accent text-black px-3 py-2 rounded-lg text-sm font-bold hover:bg-ror-accent-hover transition-colors shadow-[0_0_15px_rgba(255,204,0,0.3)] flex items-center gap-1.5"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          管理中心
        </button>
        <router-link 
          to="/dashboard" 
          class="hidden md:flex bg-ror-accent text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-ror-accent-hover transition-colors shadow-[0_0_15px_rgba(255,204,0,0.3)]"
        >
          管理中心
        </router-link>
      </template>
      <router-link 
        v-else 
        to="/login" 
        class="hidden md:flex border border-ror-border text-white px-4 py-2 rounded-lg text-sm font-bold hover:border-ror-accent hover:text-ror-accent transition-colors"
      >
        登入系統
      </router-link>

      <!-- Right Sidebar Toggle for Mobile Navigation -->
      <button 
        @click="mobileRightSidebarOpen = true"
        class="md:hidden p-2 bg-black border border-white text-white rounded-lg flex items-center justify-center transition-colors hover:bg-gray-800"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
      </button>
    </div>
  </header>

  <!-- Mobile Right Sidebar Backdrop -->
  <div 
    v-if="mobileRightSidebarOpen" 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] md:hidden"
    @click="mobileRightSidebarOpen = false"
  ></div>

  <!-- Mobile Right Sidebar -->
  <div 
    class="fixed top-0 right-0 h-full w-64 bg-black border-l border-ror-border z-[101] transform transition-transform duration-300 md:hidden flex flex-col"
    :class="mobileRightSidebarOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <!-- Sidebar Header -->
    <div class="h-16 flex items-center justify-between px-4 border-b border-ror-border">
      <span class="font-bold text-white">選單</span>
      <button @click="mobileRightSidebarOpen = false" class="p-2 text-white hover:text-gray-300">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>

    <!-- Navigation Links -->
    <nav class="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-6">
      <router-link to="/" @click="mobileRightSidebarOpen = false" class="text-white hover:text-ror-accent transition-colors font-medium text-lg">首頁</router-link>
      <router-link to="/docs" @click="mobileRightSidebarOpen = false" class="text-white hover:text-ror-accent transition-colors font-medium text-lg">互動說明書</router-link>
      <router-link to="/pricing" @click="mobileRightSidebarOpen = false" class="text-white hover:text-ror-accent transition-colors font-medium text-lg">方案定價</router-link>
      <router-link to="/download" @click="mobileRightSidebarOpen = false" class="text-white hover:text-ror-accent transition-colors font-medium text-lg">下載與更新</router-link>
    </nav>

    <!-- Bottom Actions -->
    <div class="p-4 border-t border-ror-border">
      <template v-if="isLoggedIn">
        <div class="flex flex-col gap-1 items-end mb-4">
          <span class="text-yellow-400 font-bold text-sm">{{ userPxp }} PXP</span>
          <span class="text-white text-sm font-medium">{{ userEmail }}</span>
        </div>
        <router-link 
          to="/dashboard" 
          @click="mobileRightSidebarOpen = false"
          class="w-full flex justify-center bg-ror-accent text-black px-4 py-3 rounded-lg text-sm font-bold hover:bg-ror-accent-hover transition-colors shadow-[0_0_15px_rgba(255,204,0,0.3)]"
        >
          管理中心
        </router-link>
      </template>
      <template v-else>
        <router-link 
          to="/login" 
          @click="mobileRightSidebarOpen = false"
          class="w-full flex justify-center border border-ror-border text-white px-4 py-3 rounded-lg text-sm font-bold hover:border-ror-accent hover:text-ror-accent transition-colors"
        >
          登入系統
        </router-link>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../../utils/supabase'
import { isAdminRole as adminRef, viewAsAdmin as viewRef, initAdminState } from '../../utils/adminState'

const isAdminRole = computed(() => adminRef.value)
const viewAsAdmin = computed({
  get: () => viewRef.value,
  set: (val) => { viewRef.value = val }
})

const isLoggedIn = ref(false)
const userEmail = ref('')
const userPxp = ref(0)
const mobileRightSidebarOpen = ref(false)
const route = useRoute()

const toggleMobileSidebar = () => {
  window.dispatchEvent(new CustomEvent('toggle-mobile-sidebar'))
}

const fetchUserProfile = async (userId) => {
  try {
    const { data: profile } = await supabase.from('profiles').select('pxp').eq('id', userId).single()
    if (profile) {
      userPxp.value = profile.pxp || 0
    }
  } catch (error) {
    console.error('Error fetching profile:', error)
  }
}

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  isLoggedIn.value = !!session
  
  if (session) {
    userEmail.value = session.user.email
    fetchUserProfile(session.user.id)
    initAdminState()
  }

  supabase.auth.onAuthStateChange((event, session) => {
    isLoggedIn.value = !!session
    if (session) {
      userEmail.value = session.user.email
      fetchUserProfile(session.user.id)
      initAdminState()
    } else {
      userEmail.value = ''
      userPxp.value = 0
    }
  })

  window.addEventListener('pxp-updated', (e) => {
    userPxp.value = e.detail
  })
})
</script>
