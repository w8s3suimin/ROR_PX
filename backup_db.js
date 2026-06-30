import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// 手動載入 .env 與 .env.local 檔案
function loadEnv(filePath) {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    content.split('\n').forEach(line => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        let value = match[2].trim();
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        }
        process.env[match[1].trim()] = value;
      }
    });
  }
}

loadEnv('.env');
loadEnv('.env.local');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// 優先使用 SERVICE_ROLE_KEY (擁有無視 RLS 讀取全部資料的權限)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("錯誤：找不到 Supabase URL 或 Key (請確認 .env 或 .env.local 存在)");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 想要備份的表單清單
const tables = ['profiles', 'authorization_codes', 'characters', 'devices_status', 'task_queue'];

async function backup() {
  // 建立以時間命名的資料夾 (格式：YYYY-MM-DD_HH-mm-ss，轉換為 GMT+8)
  const date = new Date();
  const gmt8Date = new Date(date.getTime() + (8 * 60 * 60 * 1000));
  const timestamp = gmt8Date.toISOString().replace(/T/, '_').replace(/[:.]/g, '-').slice(0, 19);
  const backupDir = path.join(process.cwd(), 'db_backups', timestamp);
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  console.log(`開始備份資料庫到：${backupDir} ...\n`);

  for (const table of tables) {
    let allData = [];
    let page = 0;
    const pageSize = 1000;
    
    // 使用分頁抓取避免資料量過大超時
    while (true) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .range(page * pageSize, (page + 1) * pageSize - 1);
        
      if (error) {
        console.error(`❌ 備份 ${table} 時發生錯誤:`, error.message);
        break;
      }
      
      allData = allData.concat(data);
      if (data.length < pageSize) break;
      page++;
    }

    // 將資料寫入 JSON 檔案
    fs.writeFileSync(path.join(backupDir, `${table}.json`), JSON.stringify(allData, null, 2));
    console.log(`✅ 成功備份 ${table} (共 ${allData.length} 筆資料)`);
  }
  
  console.log(`\n🎉 備份作業完成！`);
}

backup();
