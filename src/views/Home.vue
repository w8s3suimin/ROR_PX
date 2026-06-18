<template>
  <div class="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center text-center px-4 relative pt-16">
    <!-- Hero Image (Mascot) -->
    <div class="mb-8 relative group">
      <div class="absolute inset-0 bg-ror-accent/20 rounded-full blur-[80px] group-hover:bg-ror-accent/40 transition-all duration-700 pointer-events-none"></div>
      <img src="../assets/mascot.jpg" alt="Superman Chicken" class="relative z-10 w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-[0_20px_50px_rgba(255,204,0,0.5)] transform group-hover:scale-105 group-hover:-translate-y-4 transition-all duration-500 ease-out" />
    </div>

    <!-- Welcome Text -->
    <h1 class="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-ror-accent tracking-tight mb-4 animate-fade-in-up">
      歡迎來到 ROR-PX 官網
    </h1>
    <p class="text-ror-muted text-lg md:text-xl max-w-2xl mb-12 animate-fade-in-up animation-delay-200">
      您專屬的ROR無人雞管理中心。在這裡，您可以輕鬆監控、同步部屬與掌握所有角色資源資訊。
    </p>

    <!-- Quick Action Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl animate-fade-in-up animation-delay-400 pb-16">
      
      <router-link to="/dashboard" class="bg-ror-card/50 backdrop-blur-md border border-ror-border hover:border-ror-accent p-8 rounded-2xl group transition-all duration-300 relative overflow-hidden flex flex-col items-center hover:shadow-[0_0_30px_rgba(255,204,0,0.15)] hover:-translate-y-1">
        <div class="absolute inset-0 bg-gradient-to-br from-ror-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="w-16 h-16 rounded-full bg-ror-accent/10 flex items-center justify-center mb-4 group-hover:bg-ror-accent/20 transition-colors duration-300">
          <span class="text-3xl">💻</span>
        </div>
        <h3 class="text-xl font-bold text-white mb-2 group-hover:text-ror-accent transition-colors duration-300">進入管理中心</h3>
        <p class="text-ror-muted text-sm text-center">監控您所有的角色資源與無人雞任務。</p>
      </router-link>

      <router-link to="/pricing" class="bg-ror-card/50 backdrop-blur-md border border-ror-border hover:border-ror-accent p-8 rounded-2xl group transition-all duration-300 relative overflow-hidden flex flex-col items-center hover:shadow-[0_0_30px_rgba(255,204,0,0.15)] hover:-translate-y-1">
        <div class="absolute inset-0 bg-gradient-to-br from-ror-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="w-16 h-16 rounded-full bg-ror-accent/10 flex items-center justify-center mb-4 group-hover:bg-ror-accent/20 transition-colors duration-300">
          <span class="text-3xl">💰</span>
        </div>
        <h3 class="text-xl font-bold text-white mb-2 group-hover:text-ror-accent transition-colors duration-300">授權碼方案</h3>
        <p class="text-ror-muted text-sm text-center">查看與購買最新的授權方案。</p>
      </router-link>

      <router-link to="/docs" class="bg-ror-card/50 backdrop-blur-md border border-ror-border hover:border-ror-accent p-8 rounded-2xl group transition-all duration-300 relative overflow-hidden flex flex-col items-center hover:shadow-[0_0_30px_rgba(255,204,0,0.15)] hover:-translate-y-1">
        <div class="absolute inset-0 bg-gradient-to-br from-ror-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="w-16 h-16 rounded-full bg-ror-accent/10 flex items-center justify-center mb-4 group-hover:bg-ror-accent/20 transition-colors duration-300">
          <span class="text-3xl">📖</span>
        </div>
        <h3 class="text-xl font-bold text-white mb-2 group-hover:text-ror-accent transition-colors duration-300">互動說明書</h3>
        <p class="text-ror-muted text-sm text-center">查閱互動式教學與系統操作手冊。</p>
      </router-link>

    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  transform: translateY(20px);
}
.animation-delay-200 { animation-delay: 200ms; }
.animation-delay-400 { animation-delay: 400ms; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
