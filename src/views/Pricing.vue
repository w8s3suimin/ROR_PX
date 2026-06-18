<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-ror-accent mb-4">授權碼方案</h1>
      <p class="text-ror-muted text-lg">授權方案即將公告，敬請期待！</p>
    </div>
  </div>
</template>

<script setup>
/**
 * 未來授權購買模式規劃 (Business Logic Draft)
 * 
 * 1. 授權碼驗證機制：
 *    - 腳本開啟後會驗證授權碼有效性，並定時上傳訊息以維持心跳。
 * 
 * 2. 授權碼關鍵資訊：
 *    - (a) 授權天數 (Days)
 *    - (b) 上線最大數量 (Max Devices)
 *    - 總額度計算：授權天數 * 上線最大數量 = 總 PX 點數 (PXP)
 *      (例如：30天 * 10台設備 ＝ 額度 300 PXP)
 * 
 * 3. 方案轉換機制 (未來可能支援人工轉換)：
 *    - 目前不支援自動轉換。
 *    - 未來可由人工協助轉換授權比例 (例如：將「30天 * 10台」轉換為「10天 * 30台」)。
 * 
 * 4. 點數扣除模式 (替代方案)：
 *    - 以儲值 PXP 點數的方式購買。
 *    - 當天設備「第一次」開啟並執行腳本後，才進行當日的點數扣除。
 */
</script>
