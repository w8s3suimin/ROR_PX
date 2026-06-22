<template>
  <div class="h-full">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white tracking-tight">管理總覽</h1>
        <p class="text-ror-muted mt-1">設備整體狀態總覽與授權資訊</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-ror-card border border-ror-border rounded-xl p-6">
        <h2 class="text-xl font-bold text-ror-accent mb-4">設備狀態</h2>
        <div class="flex gap-4">
          <div class="flex-1 bg-[#1a1a1a] rounded p-4 text-center">
            <div class="text-3xl font-bold text-green-500 mb-1">16</div>
            <div class="text-sm text-ror-muted">在線數量</div>
          </div>
          <div class="flex-1 bg-[#1a1a1a] rounded p-4 text-center">
            <div class="text-3xl font-bold text-red-500 mb-1">0</div>
            <div class="text-sm text-ror-muted">離線數量</div>
          </div>
        </div>
      </div>

      <div class="bg-ror-card border border-ror-border rounded-xl p-6">
        <h2 class="text-xl font-bold text-ror-accent mb-4">授權資訊</h2>
        <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div class="flex gap-4 flex-1 w-full">
            <div class="flex-1 bg-[#1a1a1a] rounded p-4 text-center border border-white/5">
              <div class="text-3xl font-bold text-yellow-500 mb-1">無限</div>
              <div class="text-xs text-ror-muted">剩餘天數</div>
            </div>
            <div class="flex-1 bg-[#1a1a1a] rounded p-4 text-center border border-white/5">
              <div class="text-3xl font-bold text-blue-400 mb-1">{{ allowedDevices }}</div>
              <div class="text-xs text-ror-muted">在線數量上限</div>
            </div>
          </div>
          <div class="flex-1 space-y-2 mt-4 sm:mt-0 px-2">
            <p class="text-sm text-ror-muted">授權碼：<span class="text-white select-all">{{ authCode }}</span></p>
            <p class="text-sm text-ror-muted">總計額度：<span class="text-ror-accent font-bold">無限 PXP</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../../utils/supabase'

const authCode = ref('載入中...')
const allowedDevices = ref(0)

onMounted(async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase
        .from('authorization_codes')
        .select('code, allowed_devices')
        .eq('user_id', user.id)
        .single()
      
      if (data) {
        authCode.value = data.code
        allowedDevices.value = data.allowed_devices
      } else {
        authCode.value = '尚未配發'
      }
    } else {
      authCode.value = '未登入'
    }
  } catch (e) {
    authCode.value = '讀取失敗'
    console.error(e)
  }
})
</script>
