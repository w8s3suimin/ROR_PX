export default async function handler(req, res) {
  // 只允許 POST 請求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const eventData = req.body;
    const events = eventData.events;
    
    if (!events || events.length === 0) {
      return res.status(200).send("OK");
    }

    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      
      if (event.type === 'message' && event.message.type === 'text') {
        const userMessage = event.message.text.trim();
        
        // 1. 從 Supabase 取得所有標的清單
        const targets = await getSupabaseTargets();
        
        // 攔截 /班表 指令
        if (userMessage.startsWith('/班表')) {
          const isTextMode = userMessage.startsWith('/班表-t');
          let cmdStr = userMessage;
          if (isTextMode) {
             cmdStr = cmdStr.replace('/班表-t', '/班表');
          }
          
          const scheduleResult = await handleGetScheduleCommand(cmdStr, targets);
          if (scheduleResult.success) {
            if (isTextMode) {
              await sendTextScheduleReply(event.replyToken, scheduleResult.targetName, scheduleResult.schedule, scheduleResult.profiles);
            } else {
              await sendFlexScheduleReply(event.replyToken, scheduleResult.targetName, scheduleResult.schedule, scheduleResult.profiles);
            }
          } else {
            await sendLineReply(event.replyToken, `❌ ${scheduleResult.message}`);
          }
          continue; 
        }
        
        // 2. 解析班表並處理
        const result = await processSchedule(userMessage, targets);
        
        // 3. 如果有成功解析出班表資料，回覆 LINE
        if (result.success) {
          await sendLineReply(event.replyToken, `✅ 收到班表！已成功為您更新【${result.targetName}】共 ${result.recordCount} 筆排班資料。`);
        } else if (result.silent !== true) {
          // 如果解析失敗，且不是靜默略過，則回覆錯誤提示
          await sendLineReply(event.replyToken, `❌ ${result.message || '無法解析班表，請確認格式是否正確。'}`);
        }
      }
    }
  } catch (error) {
    console.error("Error in webhook:", error);
    // Vercel 回應 500
    return res.status(500).json({ error: 'Internal Server Error' });
  }
  
  return res.status(200).send("OK");
}

// ==========================================
// 核心處理邏輯 (從 GAS 移植，改為 async/await 與原生 fetch)
// ==========================================

async function processSchedule(text, targets) {
  const lines = text.split('\n');
  if (lines.length === 0) return { success: false, silent: true };

  const dateMap = {};
  const currentYear = new Date().getFullYear();
  let mainBaseDate = null;

  const parsedDataByTarget = {};
  let totalRecords = 0;
  let currentTarget = null;
  const updatedTargetNames = new Set();
  
  const shiftRegex = /^([a-zA-Z])(\d{1,2})[-\s一~]+(\d{1,2})\s*(.*)$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const shiftMatch = line.match(shiftRegex);
    
    if (!shiftMatch) {
      const dateRegexLine = /([A-Za-z])\s+(\d+)\/(\d+)/g;
      let dateMatchLine;
      let foundDate = false;
      while ((dateMatchLine = dateRegexLine.exec(line)) !== null) {
        const key = dateMatchLine[1].toUpperCase();
        const month = dateMatchLine[2].padStart(2, '0');
        const day = dateMatchLine[3].padStart(2, '0');
        dateMap[key] = `${currentYear}-${month}-${day}`;
        foundDate = true;
      }
      
      if (foundDate) {
        const allDates = Object.values(dateMap).sort();
        if (allDates.length > 0) mainBaseDate = allDates[0];
        continue;
      }
    }
    
    let foundNewTarget = false;
    if (!shiftMatch) {
      for (let j = 0; j < targets.length; j++) {
        const t = targets[j];
        const shortName = t.name.split('．').pop() || t.name;
        const isHeader = line.includes(t.name) || 
                         (line.includes(shortName) && (line.includes('指揮官') || line.includes('班表') || line.includes('值星')));
                         
        if (isHeader) {
          currentTarget = t;
          foundNewTarget = true;
          updatedTargetNames.add(t.name);
          break;
        }
      }
    }
    
    if (foundNewTarget || line.includes('---')) continue;
    
    if (!currentTarget) continue;
    
    if (shiftMatch) {
      const prefix = shiftMatch[1].toUpperCase();
      if (!mainBaseDate) continue; 
      
      const startHour = shiftMatch[2].padStart(2, '0');
      const endHour = shiftMatch[3].padStart(2, '0');
      const shiftCode = `${prefix}${startHour}-${endHour}`;
      
      let rawName = shiftMatch[4];
      if (!rawName || rawName.trim() === '') continue;

      const shiftDateStr = dateMap[prefix];
      if (shiftDateStr) {
        const [yyyy, mm, dd] = shiftDateStr.split('-').map(Number);
        const shiftEndDate = new Date(yyyy, mm - 1, dd, parseInt(shiftMatch[3], 10), 0, 0);
        const now = new Date();
        if (now > shiftEndDate) continue;
      }

      const isProcessed = rawName.includes('轉');
      let userName = rawName
        .replace(/已轉|轉了|確認轉|已經轉單了/g, '')
        .replace(/[()\[\]（）]/g, '')
        .replace(/轉/g, '')
        .trim();
        
      if (!parsedDataByTarget[currentTarget.id]) {
        parsedDataByTarget[currentTarget.id] = {};
      }
      if (!parsedDataByTarget[currentTarget.id][mainBaseDate]) {
        parsedDataByTarget[currentTarget.id][mainBaseDate] = {};
      }
      
      parsedDataByTarget[currentTarget.id][mainBaseDate][shiftCode] = {
        user_id: userName,
        status: isProcessed ? 'completed' : '📈',
        completed: isProcessed,
        updated_at: new Date().toISOString()
      };
      
      totalRecords++;
    }
  }
  
  if (totalRecords === 0) {
    const hasScheduleFormat = /([A-Za-z])\s*(\d{1,2})-(\d{1,2})/.test(text);
    if (hasScheduleFormat && updatedTargetNames.size === 0) {
       return { success: false, message: "找到班表格式，但沒看到正確的標的名稱，請確認輸入是否正確。" };
    }
    return { success: false, silent: true };
  }

  for (const targetId in parsedDataByTarget) {
    const dataForTarget = parsedDataByTarget[targetId];
    for (const baseDate in dataForTarget) {
      const newSlots = dataForTarget[baseDate];
      
      const existingSchedule = await getSupabaseSchedule(targetId, baseDate);
      
      let mergedSlots = {};
      if (existingSchedule && existingSchedule.slots_data) {
        mergedSlots = { ...existingSchedule.slots_data };
      }
      
      for (const slotCode in newSlots) {
        mergedSlots[slotCode] = newSlots[slotCode];
      }
      
      const payload = {
        target_id: targetId,
        base_date: baseDate,
        slots_data: mergedSlots,
        duty_officer: existingSchedule ? existingSchedule.duty_officer : '',
        updated_at: new Date().toISOString()
      };
      
      await upsertSupabaseSchedule(payload);
    }
  }

  return { 
    success: true, 
    targetName: Array.from(updatedTargetNames).join('、'),
    recordCount: totalRecords 
  };
}

// --- /班表 Command Handlers ---

async function handleGetScheduleCommand(message, targets) {
  const args = message.split(' ');
  const targetNameInput = args.length > 1 ? args.slice(1).join(' ') : null;
  
  const activeTargets = targets.filter(t => t.is_active);
  let targetId = null;
  let targetName = null;
  
  if (targetNameInput) {
    const matched = activeTargets.find(t => t.name.includes(targetNameInput) || targetNameInput.includes(t.name));
    if (!matched) {
      const names = activeTargets.map(t => `- ${t.name}`).join('\n');
      return { success: false, message: `找不到指定的標的「${targetNameInput}」。\n\n可用的標的名稱有：\n${names}` };
    }
    targetId = matched.id;
    targetName = matched.name;
  }
  
  let schedulePromise = null;
  if (targetId) {
    schedulePromise = getLatestScheduleForTarget(targetId);
  } else {
    schedulePromise = getLatestScheduleOverall();
  }
  
  // 平行發出請求以節省時間 (同時去拉班表跟拉使用者名單)
  const [schedule, profiles] = await Promise.all([
    schedulePromise,
    getSupabaseProfiles()
  ]);

  if (!schedule) {
    if (targetId) return { success: false, message: `【${targetName}】目前沒有任何班表資料。` };
    else return { success: false, message: "系統中目前沒有任何班表資料。" };
  }

  if (!targetId) {
    const matched = targets.find(t => t.id === schedule.target_id);
    targetName = matched ? matched.name : '未知標的';
  }
  
  return { success: true, targetName: targetName, schedule: schedule, profiles: profiles };
}

// --- Supabase REST API Helpers ---

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const LINE_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

async function getSupabaseTargets() {
  const url = `${SUPABASE_URL}/rest/v1/exchange_targets?select=id,name,is_active`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });
  return await response.json();
}

async function getSupabaseSchedule(targetId, baseDate) {
  const url = `${SUPABASE_URL}/rest/v1/exchange_schedules?target_id=eq.${targetId}&base_date=eq.${baseDate}&select=*`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Accept': 'application/vnd.pgrst.object+json'
    }
  });
  if (!response.ok) {
    if (response.status === 406) return null; // Not Acceptable (no records found when expecting object)
  }
  try {
    return await response.json();
  } catch (e) {
    return null;
  }
}

async function upsertSupabaseSchedule(schedulePayload) {
  const url = `${SUPABASE_URL}/rest/v1/exchange_schedules?on_conflict=target_id,base_date`;
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'resolution=merge-duplicates,return=minimal'
    },
    body: JSON.stringify(schedulePayload)
  });
}

async function getLatestScheduleForTarget(targetId) {
  const url = `${SUPABASE_URL}/rest/v1/exchange_schedules?target_id=eq.${targetId}&order=base_date.desc&limit=1`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
  });
  const data = await response.json();
  return data.length > 0 ? data[0] : null;
}

async function getLatestScheduleOverall() {
  const url = `${SUPABASE_URL}/rest/v1/exchange_schedules?order=updated_at.desc&limit=1`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
  });
  const data = await response.json();
  return data.length > 0 ? data[0] : null;
}

async function getSupabaseProfiles() {
  const url = `${SUPABASE_URL}/rest/v1/profiles?select=id,exchange_name`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
  });
  const data = await response.json();
  const map = {};
  data.forEach(p => { map[p.id] = p.exchange_name || '未命名'; });
  return map;
}

// --- LINE API Helper ---

async function sendLineReply(replyToken, messageText) {
  if (!replyToken) return;

  const url = 'https://api.line.me/v2/bot/message/reply';
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LINE_TOKEN}`
    },
    body: JSON.stringify({
      replyToken: replyToken,
      messages: [{
        type: 'text',
        text: messageText
      }]
    })
  });
}

async function sendFlexScheduleReply(replyToken, targetName, schedule, profiles) {
  if (!replyToken) return;

  const dutyOfficerId = schedule.duty_officer;
  const dutyOfficerName = (dutyOfficerId && profiles[dutyOfficerId]) ? profiles[dutyOfficerId] : (dutyOfficerId || '未指派');
  
  const d = new Date(schedule.base_date);
  const mA = d.getMonth() + 1;
  const dA = d.getDate();
  const nextD = new Date(d);
  nextD.setDate(nextD.getDate() + 1);
  const mB = nextD.getMonth() + 1;
  const dB = nextD.getDate();
  
  const slotKeys = [
    { key: 'A21-24', display: `${mA}/${dA} 21-24` },
    { key: 'B00-06', display: `${mB}/${dB} 00-06` },
    { key: 'B06-09', display: `${mB}/${dB} 06-09` },
    { key: 'B09-12', display: `${mB}/${dB} 09-12` },
    { key: 'B12-15', display: `${mB}/${dB} 12-15` },
    { key: 'B15-18', display: `${mB}/${dB} 15-18` },
    { key: 'B18-21', display: `${mB}/${dB} 18-21` },
    { key: 'B21-24', display: `${mB}/${dB} 21-24` }
  ];

  const contents = [];
  
  contents.push({
    type: "text",
    text: targetName,
    weight: "bold",
    size: "xl",
    color: "#FFFFFF",
    margin: "md"
  });
  
  contents.push({
    type: "box",
    layout: "horizontal",
    margin: "lg",
    contents: [
      { type: "text", text: "值班人員", size: "md", color: "#888888", flex: 0 },
      { type: "text", text: dutyOfficerName, size: "md", color: "#FFFFFF", margin: "md" }
    ]
  });
  
  contents.push({ type: "separator", margin: "lg", color: "#333333" });
  
  const slotsData = schedule.slots_data || {};
  slotKeys.forEach(slot => {
    const sData = slotsData[slot.key];
    
    let userName = "未登記";
    let userColor = "#555555";
    let statusIcon = " ";
    
    if (sData && sData.user_id) {
       if (profiles[sData.user_id]) {
         userName = profiles[sData.user_id];
       } else {
         userName = sData.user_id;
       }
       userColor = "#FBBF24"; // yellow
       statusIcon = sData.completed ? "☑" : "📈";
    }
    
    const rowContents = [
      { type: "text", text: slot.display, size: "md", color: "#DDDDDD", flex: 5 }
    ];
    
    if (sData && sData.user_id) {
      rowContents.push({ type: "text", text: userName, size: "md", color: userColor, flex: 3, align: "start", weight: "bold" });
      rowContents.push({ type: "text", text: statusIcon, size: "md", color: "#FBBF24", flex: 2, align: "start", weight: "bold" });
    } else {
      // 未登記時，讓名字跨越整個剩下的 50% 寬度並置中
      rowContents.push({ type: "text", text: userName, size: "md", color: userColor, flex: 5, align: "center", weight: "regular" });
    }

    contents.push({
      type: "box",
      layout: "horizontal",
      margin: "md",
      contents: rowContents
    });
    
    contents.push({ type: "separator", margin: "md", color: "#222222" });
  });
  
  contents.pop();

  const flexMessage = {
    type: "flex",
    altText: `【${targetName}】最新班表`,
    contents: {
      type: "bubble",
      size: "mega",
      styles: { body: { backgroundColor: "#1A1A1A" } },
      body: {
        type: "box",
        layout: "vertical",
        paddingAll: "xl",
        borderWidth: "normal",
        borderColor: "#FBBF24",
        cornerRadius: "xl",
        contents: contents
      }
    }
  };
  
  const url = 'https://api.line.me/v2/bot/message/reply';
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LINE_TOKEN}`
    },
    body: JSON.stringify({ replyToken: replyToken, messages: [flexMessage] })
  });
}

async function sendTextScheduleReply(replyToken, targetName, schedule, profiles) {
  if (!replyToken) return;

  const dutyOfficerId = schedule.duty_officer;
  const dutyOfficerName = (dutyOfficerId && profiles[dutyOfficerId]) ? profiles[dutyOfficerId] : (dutyOfficerId || '');
  
  const d = new Date(schedule.base_date);
  const mA = d.getMonth() + 1;
  const dA = d.getDate();
  const nextD = new Date(d);
  nextD.setDate(nextD.getDate() + 1);
  const mB = nextD.getMonth() + 1;
  const dB = nextD.getDate();
  
  const titleLine = `${targetName} 班表`;
  const dateLine = `A ${mA}/${dA}; B ${mB}/${dB}`;
  const dutyOfficerLine = `值班人員 ${dutyOfficerName}`;
  const separator = `------------------------`;

  const slotKeys = [
    { key: 'A21-24', display: 'A21-24' },
    { key: 'B00-06', display: 'B00-06' },
    { key: 'B06-09', display: 'B06-09' },
    { key: 'B09-12', display: 'B09-12' },
    { key: 'B12-15', display: 'B12-15' },
    { key: 'B15-18', display: 'B15-18' },
    { key: 'B18-21', display: 'B18-21' },
    { key: 'B21-24', display: 'B21-24' }
  ];

  let lines = [];
  lines.push(titleLine);
  lines.push(dateLine);
  lines.push(dutyOfficerLine);
  lines.push(separator);

  const slotsData = schedule.slots_data || {};
  slotKeys.forEach(slot => {
    const sData = slotsData[slot.key];
    let userName = "";
    
    if (sData && sData.user_id) {
       userName = profiles[sData.user_id] || sData.user_id;
    }
    
    let lineStr = slot.display;
    if (userName) lineStr += ` ${userName}`;
    if (sData && sData.completed) lineStr += ` 已轉`;
    else if (sData && sData.status && sData.status !== 'completed' && sData.status !== '') {
       lineStr += ` ${sData.status}`;
    }
    
    lines.push(lineStr);
  });
  
  const textMessage = lines.join('\n');
  
  const url = 'https://api.line.me/v2/bot/message/reply';
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LINE_TOKEN}`
    },
    body: JSON.stringify({
      replyToken: replyToken,
      messages: [{
        type: 'text',
        text: textMessage
      }]
    })
  });
}
