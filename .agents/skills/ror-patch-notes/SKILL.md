---
name: ror-patch-notes
description: 當需要更新 ROR_JS 或 ROR_PX 的版本發布/更新日誌頁面時觸發。此技能教導如何從本地端的 PatchNote.md 檔案讀取最新的版本資訊並更新到網站原始碼中。
---

# ROR_JS 版本更新日誌處理技能

當使用者要求「更新版本頁面」、「更新發布日誌」或相關的 ROR_JS 版本更新操作時，請遵循以下步驟：

## 1. 讀取最新的更新日誌
最新的更新內容始終維護在本地端的 `PatchNote.md` 檔案中。
請使用 `view_file` 工具讀取以下絕對路徑的檔案：
`D:\Google 雲端硬碟\AutoJS\ROR_JS\ROR_JS\App\PatchNote.md`

## 2. 解析版本資訊
- 在 `PatchNote.md` 中尋找最新的版本號段落（例如 `## 🚀 v0.3.004 *(YYYY-MM-DD)*`）。
- 擷取該版本下的所有清單項目，並根據內容將其轉換為前端網站可用的資料結構。

## 3. 更新 Download.vue
- 前端網站的更新日誌呈現位於 `d:\Google 雲端硬碟\ROR\ROR_PX\src\views\Download.vue`。
- 在該檔案的 `patches` 陣列中，新增一個物件來代表最新版本，格式如下：
  ```javascript
  {
    version: 'v0.X.XXX',
    date: 'YYYY-MM-DD',
    isLatest: true,
    features: [
      { icon: '圖示', color: '對應的 tailwind 文字顏色', desc: '<strong>標題：</strong>內容' },
      // ... 其他更新項目
    ]
  }
  ```
- 記得將前一個版本的 `isLatest: true` 移除。
- 同時更新 `Download.vue` HTML 區塊中顯示的「最新版本 v0.X.XXX」與「發布日期」。

## 4. 完成回報
更新完畢後，請向使用者總結你擷取了哪些更新項目，並確認頁面已更新。
