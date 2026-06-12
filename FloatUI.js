// ==========================================
// RO: Rebirth 懸浮窗 UI 腳本 (FloatUI.js)
// ==========================================
auto.waitFor(); // 腳本執行時會自動檢查並引導使用者去開啟無障礙服務
try {
    if (typeof floaty.checkPermission === "function" && !floaty.checkPermission()) {
        toastLog("請開啟懸浮窗權限！");
        floaty.requestPermission();
        exit();
    }
} catch (e) { }

// --- 路徑解析（支援 APK 與直接執行雙模式）---
var _PathResolver;
try {
    _PathResolver = require("./Utils/PathResolver.js");
} catch (e) {
    try { _PathResolver = require("../Utils/PathResolver.js"); } catch (e2) { }
}

var PermissionHandler;
try {
    PermissionHandler = require("./Utils/PermissionHandler.js");
} catch (e) {
    try { PermissionHandler = require("../Utils/PermissionHandler.js"); } catch (e2) { }
}

// ── 路徑統一由 PathResolver 管理，FloatUI 不自行拼接任何路徑 ──
var rootDir = (_PathResolver && _PathResolver.rootDir) || files.path("./");
var _isApkMode = (_PathResolver && _PathResolver.isApk) || false;
var configPath = (_PathResolver && _PathResolver.configPath) || files.path("./Config/Settings.json");
var accountListPath = (_PathResolver && _PathResolver.accountListPath) || files.path("./Config/AccountList.json");

print("[FloatUI] APK模式: " + _isApkMode + " | 隔離模式: " + ((_PathResolver && _PathResolver.isIsolatedMode) || false));
print("[FloatUI] rootDir: " + rootDir);
print("[FloatUI] configPath: " + configPath);
print("[FloatUI] accountListPath: " + accountListPath);

// 確保 Config 目錄存在（EISDIR 修正 + 目錄建立，邏輯統一在 PathResolver）
if (_PathResolver && typeof _PathResolver.ensureConfigDir === "function") {
    _PathResolver.ensureConfigDir();
}


var storage = {
    _configPath: configPath,
    load: function () {
        if (!files.exists(this._configPath)) return {};
        try { return JSON.parse(files.read(this._configPath)) || {}; } catch (e) { return {}; }
    },
    save: function (obj) {
        var targetFile = this._configPath;

        // 直接使用 Java 獲取父層並確保存在，棄用 split 和 createWithDirs
        var javaFile = new java.io.File(targetFile);
        var javaDir = javaFile.getParentFile();

        if (!javaDir.exists()) {
            javaDir.mkdirs();
        }

        try {
            var content = JSON.stringify(obj, null, 4);
            files.write(targetFile, content);
        } catch (e) {
            console.error("[FloatUI] 寫入設定失敗: " + e + "\n路徑: " + targetFile);
        }
    },
    get: function (key, defVal) {
        var d = this.load();
        return d[key] !== undefined ? d[key] : defVal;
    },
    put: function (key, val) {
        var d = this.load();
        d[key] = val;
        this.save(d);
    }
};

var SERVER_NAMES = [
    "金玉滿堂", "傾城之戰", "皇后大道", "普隆德拉", "雲之彼端", "世界之樹",
    "群星之海", "初心相擁", "星夢奇緣", "諸神詠嘆", "重生之境", "南門之約"
];

function initDefaultSettings() {
    var defaults = {
        "Task_MainQuest": false,
        "Task_DailyChallenge": false,
        "DailyChallenge_EnableRefresh": false,
        "DailyChallenge_Daily_1": "未選擇",
        "DailyChallenge_Daily_2": "未選擇",
        "DailyChallenge_Daily_3": "未選擇",
        "DailyChallenge_Daily_4": "未選擇",
        "DailyChallenge_Weekly_1": "未選擇",
        "DailyChallenge_Weekly_2": "未選擇",
        "DailyChallenge_Weekly_3": "未選擇",
        "DailyChallenge_Weekly_4": "未選擇",
        "Task_Board": false,
        "Task_Purchase": false,
        "Task_Dungeon": false,
        "Task_Pet": false,
        "Task_Guild": false,
        "Task_GuildTrial": false,
        "Task_Moon": false,
        "Task_WarCraft": false,
        "Task_Activity": false,
        "Task_RewardPass": false,
        "Task_RewardsCollect": false,
        "Task_Mail": false,
        "Task_DailyWelfare": false,
        "Task_DoubleJourney": false,
        "Main_Task_Mode": 0,
        "Dungeon_Mode": 1,
        "Dungeon_TargetLevel": "110",
        "Dungeon_Diff": 1,
        "Board_Opt": 0,
        "Moon_MaxAward": 10,
        "Moon_DeathMax": 3,
        "GuildTrial_Count": 1,
        "GuildTrial_Seconds": 5,
        "warcraft_attempts": 2,
        "Board_BattleTime": 60,
        "Moon_ReturnKafra": false,
        "Moon_OnlyExp": false,
        "Moon_Level": "自動",
        "Ball_RatioX": 0.85,
        "Ball_RatioY": 0.50,
        "Github_Token": "",
        "System_Resume_SkipSwitchOnMain": true,
        "Pet_Min_Vitality": 7500,
        "Pet_Max_Dispatch": 5,
        "Purchase_AtLeastOne": false,
        "MainLine_TimeLimit": 30,
        "Special_Task_Selected": 0,
        "Treasure_Hunt_MaxLimit": 5,
        "Treasure_Hunt_RestartLimit": 5,
        "Treasure_Hunt_Level": 8,
        "Treasure_Hunt_ReturnKafra": false
    };
    for (var s = 1; s <= SERVER_NAMES.length; s++) {
        for (var c = 1; c <= 3; c++) {
            defaults["Config_Char_" + s + "_" + c] = false;
        }
    }
    var current = storage.load();
    var dirty = false;
    for (var key in defaults) {
        if (current[key] === undefined) {
            current[key] = defaults[key];
            dirty = true;
        }
    }
    if (dirty) {
        storage.save(current);
        appendLog("✅ 設定檔已初始化，寫入 Config/Settings.json");
    }
}

// 建立一個物件來記憶所有勾選框的狀態
var customCheckboxState = {};

// 1. 初始化函數：懸浮窗環境，使用 Auto.js 原生綁定
function initCustomCheckboxes() {
    for (let i = 0; i < SERVER_NAMES.length; i++) {
        let sId = i + 1;
        for (let c = 1; c <= 3; c++) {
            // 🚀 利用 IIFE (立即執行函數) 建立獨立閉包，徹底凍結 currentSId 與 currentCharIndex 的值，
            // 完美解決 Rhino 引擎在異步監聽器中會捕獲到迴圈結束值 (例如 c 變成 4) 的經典 Bug！
            (function(currentSId, currentCharIndex) {
                let btnId = "btn_char_" + currentSId + "_" + currentCharIndex;
                let iconId = "icon_char_" + currentSId + "_" + currentCharIndex;
                let stateKey = currentSId + "_" + currentCharIndex;

                let savedState = storage.get("Config_Char_" + currentSId + "_" + currentCharIndex, false);
                customCheckboxState[stateKey] = savedState;
                setCustomChecked(currentSId, currentCharIndex, savedState);

                let btn = window[btnId];

                if (btn) {
                    // 🚀 終極破解法：放棄 click，改聽最底層的 touch 事件
                    btn.setOnTouchListener(function (view, event) {
                        // 當手指「離開螢幕」的那一瞬間觸發
                        if (event.getAction() == event.ACTION_UP) {
                            let newState = !customCheckboxState[stateKey];
                            setCustomChecked(currentSId, currentCharIndex, newState);
                            storage.put("Config_Char_" + currentSId + "_" + currentCharIndex, newState);
                        }
                        // 回傳 true 代表我們已經處理了這個觸控，不准系統繼續往下傳遞
                        return true;
                    });
                }
            })(sId, c);
        }
    }
}

// 2. 設定狀態函數：更新文字符號
function setCustomChecked(sId, charIndex, isChecked) {
    let stateKey = sId + "_" + charIndex;
    let iconId = "icon_char_" + sId + "_" + charIndex;

    customCheckboxState[stateKey] = isChecked; // 更新記憶體狀態

    // UI 更新必須在主執行緒，所以 ui.run 留著
    ui.run(() => {
        let icon = window[iconId];
        if (!icon) {
            try {
                icon = window.findView(iconId);
            } catch (e) {}
        }
        if (icon) {
            try {
                icon.setText(isChecked ? "☑" : "☐");
            } catch (err) {}
        }
    });
}

// 3. 取得狀態函數：判斷某個角色到底有沒有被打勾 (存檔或執行掛機時會用到)
function isCustomChecked(sId, charIndex) {
    let stateKey = sId + "_" + charIndex;
    return customCheckboxState[stateKey] === true;
}

function getLayoutXml() {
    var serverListXml = "";
    for (var i = 0; i < SERVER_NAMES.length; i++) {
        var sId = i + 1;
        serverListXml += `
            <linear w="*" padding="2dp 8dp" minHeight="30dp" gravity="center_vertical" borderBottom="1dp solid #444444">
                <text id="txt_server_${sId}" clickable="true" w="60dp" text="${SERVER_NAMES[i]}" textColor="#dddddd" textSize="12sp" maxLines="1" ellipsize="end" />
                <linear layout_weight="1" w="*" gravity="center_vertical" paddingLeft="8dp">
                    <!-- 加上 bg="?selectableItemBackground" 讓點擊有水波紋回饋 -->
                    <linear id="btn_char_${sId}_1" layout_weight="1" w="0dp" gravity="left|center_vertical" clickable="true" bg="?selectableItemBackground">
                        <!-- 加上 clickable="false" 防止文字吃掉點擊事件 -->
                        <text id="icon_char_${sId}_1" text="☐" textSize="16sp" textColor="#ffcc00" textStyle="bold" clickable="false" />
                        <text text="角1" textSize="12sp" textColor="#ffffff" marginLeft="4dp" maxLines="1" clickable="false" />
                    </linear>
                    <linear id="btn_char_${sId}_2" layout_weight="1" w="0dp" gravity="left|center_vertical" clickable="true" bg="?selectableItemBackground">
                        <text id="icon_char_${sId}_2" text="☐" textSize="16sp" textColor="#ffcc00" textStyle="bold" clickable="false" />
                        <text text="角2" textSize="12sp" textColor="#ffffff" marginLeft="4dp" maxLines="1" clickable="false" />
                    </linear>
                    <linear id="btn_char_${sId}_3" layout_weight="1" w="0dp" gravity="left|center_vertical" clickable="true" bg="?selectableItemBackground">
                        <text id="icon_char_${sId}_3" text="☐" textSize="16sp" textColor="#ffcc00" textStyle="bold" clickable="false" />
                        <text text="角3" textSize="12sp" textColor="#ffffff" marginLeft="4dp" maxLines="1" clickable="false" />
                    </linear>
                </linear>
            </linear>
        `;
    }

    return `
<frame w="*" h="*">
    <vertical id="main_window" w="*" h="*" bg="#1e1e1e" radius="2dp" alpha="0.96">
        <linear id="title_bar" w="*" h="40dp" bg="#2c2c2c" gravity="center_vertical">
            <text layout_weight="1" text="ROR無人雞" textColor="#ffcc00" textSize="14sp" textStyle="bold" paddingLeft="10" includeFontPadding="false" />
            <button id="btn_minimize" text="➖" w="40dp" h="40dp" textSize="14sp" style="Widget.AppCompat.Button.Borderless" textColor="#ffffff" minWidth="0dp" minHeight="0dp" padding="0dp" />
            <button id="btn_close" text="✖" w="40dp" h="40dp" textSize="14sp" style="Widget.AppCompat.Button.Borderless" textColor="#ff4444" minWidth="0dp" minHeight="0dp" padding="0dp" />
        </linear>
        
        <horizontal layout_weight="1" w="*" h="*">
            <vertical w="36dp" h="*" bg="#2c2c2c" gravity="top|center_horizontal" padding="0 10 0 0">
                <linear id="tab1" w="*" gravity="center" clickable="true" bg="?attr/selectableItemBackground" padding="0 12" marginBottom="5">
                    <text text="登入" w="wrap_content" gravity="center" textColor="#ffcc00" textSize="12sp" textStyle="bold" ems="1" clickable="false" />
                </linear>
                <linear id="tab2" w="*" gravity="center" clickable="true" bg="?attr/selectableItemBackground" padding="0 12" marginBottom="5">
                    <text text="主程序" w="wrap_content" gravity="center" textColor="#aaaaaa" textSize="12sp" ems="1" clickable="false" />
                </linear>
                <linear id="tab3" w="*" gravity="center" clickable="true" bg="?attr/selectableItemBackground" padding="0 12" marginBottom="5">
                    <text text="系統" w="wrap_content" gravity="center" textColor="#aaaaaa" textSize="12sp" ems="1" clickable="false" />
                </linear>
                <linear id="tab4" w="*" gravity="center" clickable="true" bg="?attr/selectableItemBackground" padding="0 12" marginBottom="5">
                    <text text="環境" w="wrap_content" gravity="center" textColor="#aaaaaa" textSize="12sp" ems="1" clickable="false" />
                </linear>
                <linear id="tab5" w="*" gravity="center" clickable="true" bg="?attr/selectableItemBackground" padding="0 12">
                    <text text="日誌" w="wrap_content" gravity="center" textColor="#aaaaaa" textSize="12sp" ems="1" clickable="false" />
                </linear>
            </vertical>
            
            <view w="1dp" h="*" bg="#ffcc00"/>
            
            <frame layout_weight="1" w="*" h="*" bg="#181818">
                <vertical id="page1" w="*" h="*">
                    <linear w="*" h="35dp" bg="#2c2c2c" gravity="center_vertical">
                        <text id="subtab_account" text="帳號" layout_weight="1" gravity="center" textColor="#ffcc00" textSize="12sp" textStyle="bold" bg="?attr/selectableItemBackground" clickable="true" h="*"/>
                        <text id="subtab_role" text="角色" layout_weight="1" gravity="center" textColor="#aaaaaa" textSize="12sp" bg="?attr/selectableItemBackground" clickable="true" h="*"/>
                    </linear>
                    
                    <frame w="*" h="*" layout_weight="1">
                        <vertical id="subpage_account" w="*" h="*" bg="#181818">
                            <ScrollView w="*" h="*">
                                <vertical padding="10">
                                    <linear w="*" gravity="center_vertical" marginBottom="8">
                                        <text text="自動導入的帳號清單" textColor="#ffcc00" textSize="12sp" layout_weight="1" includeFontPadding="false" />
                                        <button id="btn_check_all_acc" text="全部" w="50dp" h="35dp" textSize="11sp" bg="#1e88e5" textColor="#ffffff" radius="6dp" minWidth="0dp" minHeight="0dp" padding="0dp" />
                                    </linear>
                                    <list id="account_list" w="*" h="*">
                                        <linear w="*" gravity="center_vertical" padding="8 4" clickable="true" bg="?selectableItemBackground">
                                            <text id="icon_chk_acc" text="{{this.checked ? '☑' : '☐'}}" textSize="16sp" textColor="#ffcc00" textStyle="bold" marginRight="6dp" clickable="false" />
                                            <text text="{{this.email}}" textColor="#aaaaaa" textSize="12sp" layout_weight="1" maxLines="1" ellipsize="end" clickable="false" />
                                        </linear>
                                    </list>
                                    <linear w="*" gravity="center" marginTop="15" orientation="vertical">
                                        <button id="btn_auto_import" text="自動導入" w="100dp" h="35dp" bg="#1e88e5" textColor="#ffffff" textSize="12sp" radius="6dp" minWidth="0dp" minHeight="0dp" padding="0dp" />
                                        <text text="(導入前請先開啟帳號清單界面)" textColor="#888888" textSize="10sp" marginTop="8" />
                                    </linear>
                                </vertical>
                            </ScrollView>
                        </vertical>

                        <ScrollView id="subpage_role" w="*" h="*" bg="#181818" visibility="gone">
                            <vertical padding="10">
                                <linear w="*" gravity="center_vertical" marginBottom="8">
                                    <text text="選擇掛機角色 (自動存檔)" textColor="#ffcc00" textSize="12sp" layout_weight="1" includeFontPadding="false" />
                                    <button id="btn_check_all" text="全部" w="50dp" h="35dp" textSize="11sp" bg="#1e88e5" textColor="#ffffff" radius="6dp" minWidth="0dp" minHeight="0dp" padding="0dp" />
                                </linear>
                                ${serverListXml}
                            </vertical>
                        </ScrollView>
                    </frame>
                </vertical>
                
                <ScrollView id="page2" w="*" h="*" visibility="gone">
                    <vertical padding="10">
                        <horizontal w="*" marginBottom="12" gravity="center_vertical">
                            <text text="主程序模式選擇：" textColor="#ffcc00" textSize="12sp" textStyle="bold" w="wrap_content" marginRight="6" />
                            <linear id="btn_main_mode" bg="#3a3a3a" radius="4dp" h="30dp" paddingLeft="8" gravity="center_vertical" clickable="true" w="wrap_content" minWidth="120dp">
                                <text id="txt_main_mode" text="每日任務模式" textColor="#ffcc00" textSize="11sp" layout_weight="1" includeFontPadding="false" />
                                <text text="▼" textColor="#ffcc00" textSize="8sp" w="25dp" gravity="center" includeFontPadding="false" />
                            </linear>
                            <view layout_weight="1" w="0dp" />
                            <button id="btn_check_all_tasks" text="全部" w="50dp" h="30dp" textSize="11sp" bg="#1e88e5" textColor="#ffffff" radius="6dp" minWidth="0dp" minHeight="0dp" padding="0dp" />
                        </horizontal>
                        
                        <!-- 每日任務模式設定 -->
                        <vertical id="layout_daily_mode" w="*">
                            <text text="每日任務設定 (點擊任務列展開設定)" textColor="#ffcc00" textSize="12sp" marginBottom="8" textStyle="bold" />
                            
                            <vertical w="*" borderBottom="1dp solid #333" marginBottom="2">
                                <linear id="head_task_daily_challenge" w="*" minHeight="40dp" bg="#2c2c2c" gravity="center_vertical" paddingLeft="8">
                                    <linear id="chk_task_daily_challenge" layout_weight="1" w="0dp" gravity="left|center_vertical" clickable="true" bg="?selectableItemBackground" padding="4dp 0">
                                        <text id="icon_chk_task_daily_challenge" text="☐" textSize="16sp" textColor="#ffcc00" textStyle="bold" clickable="false" />
                                        <text text="每日挑戰" textSize="12sp" textColor="#ffffff" marginLeft="4dp" clickable="false" />
                                    </linear>
                                    <text id="arrow_task_daily_challenge" text="▼" textColor="#ffcc00" textSize="12sp" w="40dp" gravity="center" />
                                </linear>
                                <vertical id="body_task_daily_challenge" visibility="gone" padding="12" bg="#1e1e1e">
                                    <linear id="chk_dc_enable_refresh" w="*" gravity="left|center_vertical" clickable="true" bg="?selectableItemBackground" padding="4dp 0" marginBottom="8">
                                        <text id="icon_chk_dc_enable_refresh" text="☐" textSize="16sp" textColor="#ffcc00" textStyle="bold" clickable="false" />
                                        <text text="自動刷新 (優先級由高至低排序)" textSize="11sp" textColor="#ffffff" marginLeft="4dp" clickable="false" />
                                    </linear>
                                    <text text="每日任務：" textColor="#ffcc00" textSize="11sp" marginBottom="4" />
                                    <horizontal w="*" marginBottom="6" gravity="center_vertical">
                                        <linear id="btn_dc_daily_1" w="145dp" bg="#3a3a3a" radius="4dp" h="30dp" paddingLeft="4" paddingRight="2" gravity="center_vertical" clickable="true" marginRight="10dp">
                                            <text id="txt_dc_daily_1" text="1: 未選擇" textColor="#ffffff" textSize="9sp" layout_weight="1" includeFontPadding="false" maxLines="1" ellipsize="end" />
                                            <text text="▼" textColor="#ffcc00" textSize="8sp" w="12dp" gravity="center" includeFontPadding="false" />
                                        </linear>
                                        <linear id="btn_dc_daily_2" w="145dp" bg="#3a3a3a" radius="4dp" h="30dp" paddingLeft="4" paddingRight="2" gravity="center_vertical" clickable="true" visibility="gone">
                                            <text id="txt_dc_daily_2" text="2: 未選擇" textColor="#ffffff" textSize="9sp" layout_weight="1" includeFontPadding="false" maxLines="1" ellipsize="end" />
                                            <text text="▼" textColor="#ffcc00" textSize="8sp" w="12dp" gravity="center" includeFontPadding="false" />
                                        </linear>
                                    </horizontal>
                                    <horizontal id="layout_dc_daily_row2" w="*" marginBottom="12" gravity="center_vertical" visibility="gone">
                                        <linear id="btn_dc_daily_3" w="145dp" bg="#3a3a3a" radius="4dp" h="30dp" paddingLeft="4" paddingRight="2" gravity="center_vertical" clickable="true" marginRight="10dp">
                                            <text id="txt_dc_daily_3" text="3: 未選擇" textColor="#ffffff" textSize="9sp" layout_weight="1" includeFontPadding="false" maxLines="1" ellipsize="end" />
                                            <text text="▼" textColor="#ffcc00" textSize="8sp" w="12dp" gravity="center" includeFontPadding="false" />
                                        </linear>
                                        <linear id="btn_dc_daily_4" w="145dp" bg="#3a3a3a" radius="4dp" h="30dp" paddingLeft="4" paddingRight="2" gravity="center_vertical" clickable="true" visibility="gone">
                                            <text id="txt_dc_daily_4" text="4: 未選擇" textColor="#ffffff" textSize="9sp" layout_weight="1" includeFontPadding="false" maxLines="1" ellipsize="end" />
                                            <text text="▼" textColor="#ffcc00" textSize="8sp" w="12dp" gravity="center" includeFontPadding="false" />
                                        </linear>
                                    </horizontal>
                                    <text text="每周任務：" textColor="#ffcc00" textSize="11sp" marginBottom="4" />
                                    <horizontal w="*" marginBottom="6" gravity="center_vertical">
                                        <linear id="btn_dc_weekly_1" w="145dp" bg="#3a3a3a" radius="4dp" h="30dp" paddingLeft="4" paddingRight="2" gravity="center_vertical" clickable="true" marginRight="10dp">
                                            <text id="txt_dc_weekly_1" text="1: 未選擇" textColor="#ffffff" textSize="9sp" layout_weight="1" includeFontPadding="false" maxLines="1" ellipsize="end" />
                                            <text text="▼" textColor="#ffcc00" textSize="8sp" w="12dp" gravity="center" includeFontPadding="false" />
                                        </linear>
                                        <linear id="btn_dc_weekly_2" w="145dp" bg="#3a3a3a" radius="4dp" h="30dp" paddingLeft="4" paddingRight="2" gravity="center_vertical" clickable="true" visibility="gone">
                                            <text id="txt_dc_weekly_2" text="2: 未選擇" textColor="#ffffff" textSize="9sp" layout_weight="1" includeFontPadding="false" maxLines="1" ellipsize="end" />
                                            <text text="▼" textColor="#ffcc00" textSize="8sp" w="12dp" gravity="center" includeFontPadding="false" />
                                        </linear>
                                    </horizontal>
                                    <horizontal id="layout_dc_weekly_row2" w="*" marginBottom="4" gravity="center_vertical" visibility="gone">
                                        <linear id="btn_dc_weekly_3" w="145dp" bg="#3a3a3a" radius="4dp" h="30dp" paddingLeft="4" paddingRight="2" gravity="center_vertical" clickable="true" marginRight="10dp">
                                            <text id="txt_dc_weekly_3" text="3: 未選擇" textColor="#ffffff" textSize="9sp" layout_weight="1" includeFontPadding="false" maxLines="1" ellipsize="end" />
                                            <text text="▼" textColor="#ffcc00" textSize="8sp" w="12dp" gravity="center" includeFontPadding="false" />
                                        </linear>
                                        <linear id="btn_dc_weekly_4" w="145dp" bg="#3a3a3a" radius="4dp" h="30dp" paddingLeft="4" paddingRight="2" gravity="center_vertical" clickable="true" visibility="gone">
                                            <text id="txt_dc_weekly_4" text="4: 未選擇" textColor="#ffffff" textSize="9sp" layout_weight="1" includeFontPadding="false" maxLines="1" ellipsize="end" />
                                            <text text="▼" textColor="#ffcc00" textSize="8sp" w="12dp" gravity="center" includeFontPadding="false" />
                                        </linear>
                                    </horizontal>
                                </vertical>
                            </vertical>

                            <vertical w="*" borderBottom="1dp solid #333" marginBottom="2">
                                <linear id="head_task_board" w="*" minHeight="40dp" bg="#2c2c2c" gravity="center_vertical" paddingLeft="8">
                                    <linear id="chk_task_board" layout_weight="1" w="0dp" gravity="left|center_vertical" clickable="true" bg="?selectableItemBackground" padding="4dp 0">
                                        <text id="icon_chk_task_board" text="☐" textSize="16sp" textColor="#ffcc00" textStyle="bold" clickable="false" />
                                        <text text="委託版" textSize="12sp" textColor="#ffffff" marginLeft="4dp" clickable="false" />
                                    </linear>
                                    <text id="arrow_task_board" text="▼" textColor="#ffcc00" textSize="12sp" w="40dp" gravity="center" />
                                </linear>
                                <vertical id="body_task_board" visibility="gone" padding="12" bg="#1e1e1e">
                                    <vertical w="*">
                                        <horizontal w="*" gravity="center_vertical" marginBottom="8">
                                            <text text="委託種類：" textColor="#dddddd" textSize="11sp" w="75dp" />
                                            <linear id="btn_board_opt" bg="#3a3a3a" radius="4dp" h="35dp" paddingLeft="8" gravity="center_vertical" clickable="true" w="wrap_content" minWidth="120dp">
                                                <text id="txt_board_opt" text="全部任務" textColor="#ffcc00" textSize="10sp" layout_weight="1" includeFontPadding="false" />
                                                <text text="▼" textColor="#ffcc00" textSize="8sp" w="20dp" gravity="center" includeFontPadding="false" />
                                            </linear>
                                        </horizontal>
                                        <horizontal w="*" gravity="center_vertical">
                                            <text text="戰鬥秒數：" textColor="#dddddd" textSize="11sp" w="75dp" />
                                            <linear bg="#2c2c2c" radius="4dp" h="35dp" gravity="center_vertical">
                                                <button id="btn_board_battle_minus" text="-" w="25dp" h="*" bg="?attr/selectableItemBackground" textColor="#ffffff" textSize="14sp" textStyle="bold" minWidth="0" minHeight="0" padding="0" />
                                                <input id="edt_board_battle_time" text="60" w="50dp" h="*" gravity="center" textColor="#ffcc00" textSize="12sp" textStyle="bold" bg="#00000000" inputType="number" padding="0" includeFontPadding="false" />
                                                <button id="btn_board_battle_plus" text="+" w="25dp" h="*" bg="?attr/selectableItemBackground" textColor="#ffffff" textSize="14sp" textStyle="bold" minWidth="0" minHeight="0" padding="0" />
                                            </linear>
                                        </horizontal>
                                    </vertical>
                                    <text text="提示：戰鬥狀態超過設定上限時，會嘗試回到面板確認進度" textColor="#888888" textSize="10sp" marginTop="8" />
                                </vertical>
                            </vertical>

                            <vertical w="*" borderBottom="1dp solid #333" marginBottom="2">
                                <linear id="head_task_pet" w="*" minHeight="40dp" bg="#2c2c2c" gravity="center_vertical" paddingLeft="8">
                                    <linear id="chk_task_pet" layout_weight="1" w="0dp" gravity="left|center_vertical" clickable="true" bg="?selectableItemBackground" padding="4dp 0">
                                        <text id="icon_chk_task_pet" text="☐" textSize="16sp" textColor="#ffcc00" textStyle="bold" clickable="false" />
                                        <text text="寵物派遣" textSize="12sp" textColor="#ffffff" marginLeft="4dp" clickable="false" />
                                    </linear>
                                    <text id="arrow_task_pet" text="▼" textColor="#ffcc00" textSize="12sp" w="40dp" gravity="center" />
                                </linear>
                                <vertical id="body_task_pet" visibility="gone" padding="12" bg="#1e1e1e">
                                    <vertical w="*">
                                        <horizontal w="*" gravity="center_vertical" marginBottom="8">
                                            <text text="活力限制：" textColor="#dddddd" textSize="11sp" w="75dp" />
                                            <linear bg="#2c2c2c" radius="4dp" h="35dp" gravity="center_vertical">
                                                <button id="btn_pet_vit_minus" text="-" w="25dp" h="*" bg="?attr/selectableItemBackground" textColor="#ffffff" textSize="14sp" textStyle="bold" minWidth="0" minHeight="0" padding="0" />
                                                <input id="edt_pet_vit" text="7500" w="65dp" h="*" gravity="center" textColor="#ffcc00" textSize="12sp" textStyle="bold" bg="#00000000" inputType="number" padding="0" includeFontPadding="false" />
                                                <button id="btn_pet_vit_plus" text="+" w="25dp" h="*" bg="?attr/selectableItemBackground" textColor="#ffffff" textSize="14sp" textStyle="bold" minWidth="0" minHeight="0" padding="0" />
                                            </linear>
                                        </horizontal>
                                        <horizontal w="*" gravity="center_vertical">
                                            <text text="委派上限：" textColor="#dddddd" textSize="11sp" w="75dp" />
                                            <linear bg="#2c2c2c" radius="4dp" h="35dp" gravity="center_vertical">
                                                <button id="btn_pet_dispatch_minus" text="-" w="25dp" h="*" bg="?attr/selectableItemBackground" textColor="#ffffff" textSize="14sp" textStyle="bold" minWidth="0" minHeight="0" padding="0" />
                                                <input id="edt_pet_dispatch" text="5" w="45dp" h="*" gravity="center" textColor="#ffcc00" textSize="12sp" textStyle="bold" bg="#00000000" inputType="number" padding="0" includeFontPadding="false" />
                                                <button id="btn_pet_dispatch_plus" text="+" w="25dp" h="*" bg="?attr/selectableItemBackground" textColor="#ffffff" textSize="14sp" textStyle="bold" minWidth="0" minHeight="0" padding="0" />
                                            </linear>
                                        </horizontal>
                                    </vertical>
                                    <text text="活力大於設定值時，領取派遣獎勵並重新委派。領取並委派的次數不會超過設定上限。" textColor="#888888" textSize="10sp" />
                                </vertical>
                            </vertical>

                            <vertical w="*" borderBottom="1dp solid #333" marginBottom="2">
                                <linear id="head_task_dungeon" w="*" minHeight="40dp" bg="#2c2c2c" gravity="center_vertical" paddingLeft="8">
                                    <linear id="chk_task_dungeon" layout_weight="1" w="0dp" gravity="left|center_vertical" clickable="true" bg="?selectableItemBackground" padding="4dp 0">
                                        <text id="icon_chk_task_dungeon" text="☐" textSize="16sp" textColor="#ffcc00" textStyle="bold" clickable="false" />
                                        <text text="地下城" textSize="12sp" textColor="#ffffff" marginLeft="4dp" clickable="false" />
                                    </linear>
                                    <text id="arrow_task_dungeon" text="▼" textColor="#ffcc00" textSize="12sp" w="40dp" gravity="center" />
                                </linear>
                                <vertical id="body_task_dungeon" visibility="gone" padding="12" bg="#1e1e1e">
                                    <horizontal w="*" marginBottom="8" gravity="center_vertical">
                                        <text text="關卡選擇模式：" textColor="#dddddd" textSize="11sp" w="wrap_content" marginRight="6" />
                                        <linear id="btn_dungeon_mode" bg="#3a3a3a" radius="4dp" h="30dp" paddingLeft="8" gravity="center_vertical" clickable="true" w="wrap_content" minWidth="100dp">
                                            <text id="txt_dungeon_mode" text="手動" textColor="#ffcc00" textSize="11sp" layout_weight="1" includeFontPadding="false" />
                                            <text text="▼" textColor="#ffcc00" textSize="8sp" w="25dp" gravity="center" includeFontPadding="false" />
                                        </linear>
                                    </horizontal>

                                    <vertical id="row_dungeon_detail" w="*">
                                        <horizontal w="*" marginBottom="8" gravity="center_vertical">
                                            <text text="等級：" textColor="#dddddd" textSize="11sp" w="75dp" />
                                            <linear id="btn_dungeon_level" bg="#3a3a3a" radius="4dp" h="30dp" paddingLeft="8" gravity="center_vertical" clickable="true" w="wrap_content" minWidth="120dp">
                                                <text id="txt_dungeon_level" text="Lv.100" textColor="#ffcc00" textSize="11sp" layout_weight="1" includeFontPadding="false" />
                                                <text text="▼" textColor="#ffcc00" textSize="8sp" w="25dp" gravity="center" includeFontPadding="false" />
                                            </linear>
                                        </horizontal>
                                        <horizontal w="*" marginBottom="8" gravity="center_vertical">
                                            <text text="難度：" textColor="#dddddd" textSize="11sp" w="75dp" />
                                            <linear id="btn_dungeon_diff" bg="#3a3a3a" radius="4dp" h="30dp" paddingLeft="8" gravity="center_vertical" clickable="true" w="wrap_content" minWidth="120dp">
                                                <text id="txt_dungeon_diff" text="普通難度" textColor="#ffcc00" textSize="11sp" layout_weight="1" includeFontPadding="false" />
                                                <text text="▼" textColor="#ffcc00" textSize="8sp" w="25dp" gravity="center" includeFontPadding="false" />
                                            </linear>
                                        </horizontal>
                                    </vertical>
                                    <text text="提示：自動模式會自動選擇最高難度的已解鎖關卡。" textColor="#888888" textSize="10sp" />
                                </vertical>
                            </vertical>

                            <vertical w="*" borderBottom="1dp solid #333" marginBottom="2">
                                <linear id="head_task_purchase" w="*" minHeight="40dp" bg="#2c2c2c" gravity="center_vertical" paddingLeft="8">
                                    <linear id="chk_task_purchase" layout_weight="1" w="0dp" gravity="left|center_vertical" clickable="true" bg="?selectableItemBackground" padding="4dp 0">
                                        <text id="icon_chk_task_purchase" text="☐" textSize="16sp" textColor="#ffcc00" textStyle="bold" clickable="false" />
                                        <text text="商會訂單" textSize="12sp" textColor="#ffffff" marginLeft="4dp" clickable="false" />
                                    </linear>
                                    <text id="arrow_task_purchase" text="▼" textColor="#ffcc00" textSize="12sp" w="40dp" gravity="center" />
                                </linear>
                                <vertical id="body_task_purchase" visibility="gone" padding="12" bg="#1e1e1e">
                                    <linear id="chk_purchase_at_least_one" w="*" gravity="left|center_vertical" clickable="true" bg="?selectableItemBackground" padding="4dp 0" marginBottom="4">
                                        <text id="icon_chk_purchase_at_least_one" text="☐" textSize="16sp" textColor="#ffcc00" textStyle="bold" clickable="false" />
                                        <text text="至少購買1商品" textSize="11sp" textColor="#ffffff" marginLeft="4dp" clickable="false" />
                                    </linear>
                                    <text text="自動提交商會物資。若材料不足則會跳過該訂單。" textColor="#aaaaaa" textSize="11sp" />
                                </vertical>
                            </vertical>

                            <vertical w="*" borderBottom="1dp solid #333" marginBottom="2">
                                <linear id="head_task_guild" w="*" minHeight="40dp" bg="#2c2c2c" gravity="center_vertical" paddingLeft="8">
                                    <linear id="chk_task_guild" layout_weight="1" w="0dp" gravity="left|center_vertical" clickable="true" bg="?selectableItemBackground" padding="4dp 0">
                                        <text id="icon_chk_task_guild" text="☐" textSize="16sp" textColor="#ffcc00" textStyle="bold" clickable="false" />
                                        <text text="公會訂單" textSize="12sp" textColor="#ffffff" marginLeft="4dp" clickable="false" />
                                    </linear>
                                    <text id="arrow_task_guild" text="▼" textColor="#ffcc00" textSize="12sp" w="40dp" gravity="center" />
                                </linear>
                                <vertical id="body_task_guild" visibility="gone" padding="12" bg="#1e1e1e">
                                    <text text="自動提交公會物資。若材料不足則會跳過該訂單。" textColor="#aaaaaa" textSize="11sp" />
                                </vertical>
                            </vertical>

                            <vertical w="*" borderBottom="1dp solid #333" marginBottom="2">
                                <linear id="head_task_guild_trial" w="*" minHeight="40dp" bg="#2c2c2c" gravity="center_vertical" paddingLeft="8">
                                    <linear id="chk_task_guild_trial" layout_weight="1" w="0dp" gravity="left|center_vertical" clickable="true" bg="?selectableItemBackground" padding="4dp 0">
                                        <text id="icon_chk_task_guild_trial" text="☐" textSize="16sp" textColor="#ffcc00" textStyle="bold" clickable="false" />
                                        <text text="公會試煉" textSize="12sp" textColor="#ffffff" marginLeft="4dp" clickable="false" />
                                    </linear>
                                    <text id="arrow_task_guild_trial" text="▼" textColor="#ffcc00" textSize="12sp" w="40dp" gravity="center" />
                                </linear>
                                <vertical id="body_task_guild_trial" visibility="gone" padding="12" bg="#1e1e1e">
                                    <vertical w="*">
                                        <horizontal w="*" gravity="center_vertical" marginBottom="8">
                                            <text text="挑戰次數：" textColor="#dddddd" textSize="11sp" w="75dp" />
                                            <linear bg="#2c2c2c" radius="4dp" h="35dp" gravity="center_vertical">
                                                <button id="btn_guild_trial_count_minus" text="-" w="25dp" h="*" bg="?attr/selectableItemBackground" textColor="#ffffff" textSize="14sp" textStyle="bold" minWidth="0" minHeight="0" padding="0" />
                                                <input id="edt_guild_trial_count" text="5" w="45dp" h="*" gravity="center" textColor="#ffcc00" textSize="12sp" textStyle="bold" bg="#00000000" inputType="number" padding="0" includeFontPadding="false" />
                                                <button id="btn_guild_trial_count_plus" text="+" w="25dp" h="*" bg="?attr/selectableItemBackground" textColor="#ffffff" textSize="14sp" textStyle="bold" minWidth="0" minHeight="0" padding="0" />
                                            </linear>
                                        </horizontal>
                                        <horizontal w="*" gravity="center_vertical" marginBottom="8">
                                            <text text="挑戰秒數：" textColor="#dddddd" textSize="11sp" w="75dp" />
                                            <linear bg="#2c2c2c" radius="4dp" h="35dp" gravity="center_vertical">
                                                <button id="btn_guild_trial_sec_minus" text="-" w="25dp" h="*" bg="?attr/selectableItemBackground" textColor="#ffffff" textSize="14sp" textStyle="bold" minWidth="0" minHeight="0" padding="0" />
                                                <input id="edt_guild_trial_sec" text="60" w="50dp" h="*" gravity="center" textColor="#ffcc00" textSize="12sp" textStyle="bold" bg="#00000000" inputType="number" padding="0" includeFontPadding="false" />
                                                <button id="btn_guild_trial_sec_plus" text="+" w="25dp" h="*" bg="?attr/selectableItemBackground" textColor="#ffffff" textSize="14sp" textStyle="bold" minWidth="0" minHeight="0" padding="0" />
                                            </linear>
                                        </horizontal>
                                    </vertical>
                                </vertical>
                            </vertical>

                            <vertical w="*" borderBottom="1dp solid #333" marginBottom="2">
                                <linear id="head_task_moon" w="*" minHeight="40dp" bg="#2c2c2c" gravity="center_vertical" paddingLeft="8">
                                    <linear id="chk_task_moon" layout_weight="1" w="0dp" gravity="left|center_vertical" clickable="true" bg="?selectableItemBackground" padding="4dp 0">
                                        <text id="icon_chk_task_moon" text="☐" textSize="16sp" textColor="#ffcc00" textStyle="bold" clickable="false" />
                                        <text text="紅月" textSize="12sp" textColor="#ffffff" marginLeft="4dp" clickable="false" />
                                    </linear>
                                    <text id="arrow_task_moon" text="▼" textColor="#ffcc00" textSize="12sp" w="40dp" gravity="center" />
                                </linear>
                                <vertical id="body_task_moon" visibility="gone" padding="12" bg="#1e1e1e">
                                    <vertical w="*">
                                        <horizontal w="*" gravity="center_vertical" marginBottom="8">
                                            <text text="關卡等級：" textColor="#dddddd" textSize="11sp" w="75dp" />
                                            <linear id="btn_moon_level" bg="#3a3a3a" radius="4dp" h="30dp" paddingLeft="8" gravity="center_vertical" clickable="true" w="wrap_content" minWidth="120dp">
                                                <text id="txt_moon_level" text="自動" textColor="#ffcc00" textSize="11sp" layout_weight="1" includeFontPadding="false" />
                                                <text text="▼" textColor="#ffcc00" textSize="8sp" w="25dp" gravity="center" includeFontPadding="false" />
                                            </linear>
                                        </horizontal>
                                        <horizontal w="*" gravity="center_vertical" marginBottom="8">
                                            <text text="領取次數：" textColor="#dddddd" textSize="11sp" w="75dp" />
                                            <linear bg="#2c2c2c" radius="4dp" h="35dp" gravity="center_vertical">
                                                <button id="btn_moon_minus" text="-" w="25dp" h="*" bg="?attr/selectableItemBackground" textColor="#ffffff" textSize="14sp" textStyle="bold" minWidth="0" minHeight="0" padding="0" />
                                                <input id="edt_moon_max" text="10" w="50dp" h="*" gravity="center" textColor="#ffcc00" textSize="12sp" textStyle="bold" bg="#00000000" inputType="number" padding="0" includeFontPadding="false" />
                                                <button id="btn_moon_plus" text="+" w="25dp" h="*" bg="?attr/selectableItemBackground" textColor="#ffffff" textSize="14sp" textStyle="bold" minWidth="0" minHeight="0" padding="0" />
                                            </linear>
                                        </horizontal>
                                        <horizontal w="*" gravity="center_vertical">
                                            <text text="死亡上限：" textColor="#dddddd" textSize="11sp" w="75dp" />
                                            <linear bg="#2c2c2c" radius="4dp" h="35dp" gravity="center_vertical">
                                                <button id="btn_moon_death_minus" text="-" w="25dp" h="*" bg="?attr/selectableItemBackground" textColor="#ffffff" textSize="14sp" textStyle="bold" minWidth="0" minHeight="0" padding="0" />
                                                <input id="edt_moon_death" text="3" w="45dp" h="*" gravity="center" textColor="#ffcc00" textSize="12sp" textStyle="bold" bg="#00000000" inputType="number" padding="0" includeFontPadding="false" />
                                                <button id="btn_moon_death_plus" text="+" w="25dp" h="*" bg="?attr/selectableItemBackground" textColor="#ffffff" textSize="14sp" textStyle="bold" minWidth="0" minHeight="0" padding="0" />
                                            </linear>
                                        </horizontal>
                                    </vertical>
                                    <horizontal w="*" marginTop="8" gravity="center_vertical">
                                        <linear id="chk_task_moon_return" layout_weight="1" w="0dp" gravity="left|center_vertical" clickable="true" bg="?selectableItemBackground" padding="4dp 0">
                                            <text id="icon_chk_task_moon_return" text="☐" textSize="16sp" textColor="#ffcc00" textStyle="bold" clickable="false" />
                                            <text text="結束時返回主城" textSize="11sp" textColor="#ffffff" marginLeft="4dp" clickable="false" />
                                        </linear>
                                        <linear id="chk_task_moon_only_exp" layout_weight="1" w="0dp" gravity="left|center_vertical" clickable="true" bg="?selectableItemBackground" padding="4dp 0" marginLeft="8dp">
                                            <text id="icon_chk_task_moon_only_exp" text="☐" textSize="16sp" textColor="#ffcc00" textStyle="bold" clickable="false" />
                                            <text text="只領取經驗獎勵" textSize="11sp" textColor="#ffffff" marginLeft="4dp" clickable="false" />
                                        </linear>
                                    </horizontal>
                                    <text text="達設定領取次數後即停止。死亡上限為領獎前死亡次數，達標將自動跳過任務（設為 0 表示不限制）。" textColor="#888888" textSize="10sp" marginTop="8" />
                                </vertical>
                            </vertical>

                            <vertical w="*" borderBottom="1dp solid #333" marginBottom="2">
                                <linear id="head_task_warcraft" w="*" minHeight="40dp" bg="#2c2c2c" gravity="center_vertical" paddingLeft="8">
                                    <linear id="chk_task_warcraft" layout_weight="1" w="0dp" gravity="left|center_vertical" clickable="true" bg="?selectableItemBackground" padding="4dp 0">
                                        <text id="icon_chk_task_warcraft" text="☐" textSize="16sp" textColor="#ffcc00" textStyle="bold" clickable="false" />
                                        <text text="獸王爭霸" textSize="12sp" textColor="#ffffff" marginLeft="4dp" clickable="false" />
                                    </linear>
                                    <text id="arrow_task_warcraft" text="▼" textColor="#ffcc00" textSize="12sp" w="40dp" gravity="center" />
                                </linear>
                                <vertical id="body_task_warcraft" visibility="gone" padding="12" bg="#1e1e1e">
                                    <horizontal w="*" gravity="center_vertical" marginBottom="8">
                                        <text text="挑戰次數：" textColor="#dddddd" textSize="11sp" w="75dp" />
                                        <linear bg="#2c2c2c" radius="4dp" h="35dp" gravity="center_vertical">
                                            <button id="btn_warcraft_attempts_minus" text="-" w="25dp" h="*" bg="?attr/selectableItemBackground" textColor="#ffffff" textSize="14sp" textStyle="bold" minWidth="0" minHeight="0" padding="0" />
                                            <input id="edt_warcraft_attempts" text="2" w="45dp" h="*" gravity="center" textColor="#ffcc00" textSize="12sp" textStyle="bold" bg="#00000000" inputType="number" padding="0" includeFontPadding="false" />
                                            <button id="btn_warcraft_attempts_plus" text="+" w="25dp" h="*" bg="?attr/selectableItemBackground" textColor="#ffffff" textSize="14sp" textStyle="bold" minWidth="0" minHeight="0" padding="0" />
                                        </linear>
                                    </horizontal>
                                </vertical>
                            </vertical>

                            <vertical w="*" borderBottom="1dp solid #333" marginBottom="2">
                                <linear id="head_task_rewards_collect" w="*" minHeight="40dp" bg="#2c2c2c" gravity="center_vertical" paddingLeft="8">
                                    <linear id="chk_task_rewards_collect" layout_weight="1" w="0dp" gravity="left|center_vertical" clickable="true" bg="?selectableItemBackground" padding="4dp 0">
                                        <text id="icon_chk_task_rewards_collect" text="☐" textSize="16sp" textColor="#ffcc00" textStyle="bold" clickable="false" />
                                        <text text="獎勵領取" textSize="12sp" textColor="#ffffff" marginLeft="4dp" clickable="false" />
                                    </linear>
                                    <text id="arrow_task_rewards_collect" text="▼" textColor="#ffcc00" textSize="12sp" w="40dp" gravity="center" />
                                </linear>
                                <vertical id="body_task_rewards_collect" visibility="gone" padding="12" bg="#1e1e1e">
                                    <linear id="chk_task_mail" w="*" gravity="left|center_vertical" clickable="true" bg="?selectableItemBackground" padding="4dp 0" marginBottom="4">
                                        <text id="icon_chk_task_mail" text="☐" textSize="16sp" textColor="#ffcc00" textStyle="bold" clickable="false" />
                                        <text text="信件領取" textSize="11sp" textColor="#ffffff" marginLeft="4dp" clickable="false" />
                                    </linear>
                                    <linear id="chk_task_daily_welfare" w="*" gravity="left|center_vertical" clickable="true" bg="?selectableItemBackground" padding="4dp 0" marginBottom="4">
                                        <text id="icon_chk_task_daily_welfare" text="☐" textSize="16sp" textColor="#ffcc00" textStyle="bold" clickable="false" />
                                        <text text="每日福利" textSize="11sp" textColor="#ffffff" marginLeft="4dp" clickable="false" />
                                    </linear>
                                    <linear id="chk_task_double_journey" w="*" gravity="left|center_vertical" clickable="true" bg="?selectableItemBackground" padding="4dp 0" marginBottom="4">
                                        <text id="icon_chk_task_double_journey" text="☐" textSize="16sp" textColor="#ffcc00" textStyle="bold" clickable="false" />
                                        <text text="雙人同行" textSize="11sp" textColor="#ffffff" marginLeft="4dp" clickable="false" />
                                    </linear>
                                    <linear id="chk_task_activity" w="*" gravity="left|center_vertical" clickable="true" bg="?selectableItemBackground" padding="4dp 0" marginBottom="4">
                                        <text id="icon_chk_task_activity" text="☐" textSize="16sp" textColor="#ffcc00" textStyle="bold" clickable="false" />
                                        <text text="活躍度獎勵" textSize="11sp" textColor="#ffffff" marginLeft="4dp" clickable="false" />
                                    </linear>
                                    <linear id="chk_task_reward_pass" w="*" gravity="left|center_vertical" clickable="true" bg="?selectableItemBackground" padding="4dp 0">
                                        <text id="icon_chk_task_reward_pass" text="☐" textSize="16sp" textColor="#ffcc00" textStyle="bold" clickable="false" />
                                        <text text="通行證獎勵" textSize="11sp" textColor="#ffffff" marginLeft="4dp" clickable="false" />
                                    </linear>
                                </vertical>
                            </vertical>
                        </vertical>

                        <!-- 特殊任務模式設定 -->
                        <vertical id="layout_main_quest_mode" w="*" visibility="gone" padding="10" bg="#1e1e1e" radius="4dp">
                            <text text="特殊任務設定" textColor="#ffcc00" textSize="12sp" marginBottom="8" textStyle="bold" />
                            
                            <!-- 任務子項目選擇下拉框 -->
                            <horizontal w="*" gravity="center_vertical" marginBottom="8">
                                <text text="特殊任務種類：" textColor="#dddddd" textSize="11sp" w="90dp" />
                                <linear id="btn_special_task" bg="#3a3a3a" radius="4dp" h="35dp" paddingLeft="8" gravity="center_vertical" clickable="true" w="wrap_content" minWidth="120dp">
                                    <text id="txt_special_task" text="主線任務" textColor="#ffcc00" textSize="10sp" layout_weight="1" includeFontPadding="false" />
                                    <text text="▼" textColor="#ffcc00" textSize="8sp" w="20dp" gravity="center" includeFontPadding="false" />
                                </linear>
                            </horizontal>

                            <!-- 主線任務子設定 -->
                            <vertical id="layout_special_main_settings" w="*">
                                <horizontal w="*" gravity="center_vertical" marginBottom="8">
                                    <text text="執行時間：" textColor="#dddddd" textSize="11sp" w="90dp" />
                                    <linear bg="#2c2c2c" radius="4dp" h="35dp" gravity="center_vertical">
                                        <button id="btn_main_time_minus" text="-" w="25dp" h="*" bg="?attr/selectableItemBackground" textColor="#ffffff" textSize="14sp" textStyle="bold" minWidth="0" minHeight="0" padding="0" />
                                        <input id="edt_main_time" text="30" w="50dp" h="*" gravity="center" textColor="#ffcc00" textSize="12sp" textStyle="bold" bg="#00000000" inputType="number" padding="0" includeFontPadding="false" />
                                        <button id="btn_main_time_plus" text="+" w="25dp" h="*" bg="?attr/selectableItemBackground" textColor="#ffffff" textSize="14sp" textStyle="bold" minWidth="0" minHeight="0" padding="0" />
                                    </linear>
                                    <text text=" 分鐘 (0為不限制)" textColor="#aaaaaa" textSize="11sp" marginLeft="6" />
                                </horizontal>
                                <text text="系統將會依序執行主線任務章節。" textColor="#aaaaaa" textSize="11sp" />
                                <text text="提示：此模式下將自動忽略日常任務，直到切換回每日任務模式。" textColor="#888888" textSize="10sp" marginTop="5" />
                            </vertical>

                            <!-- 尋寶任務子設定 -->
                            <vertical id="layout_special_treasure_settings" w="*" visibility="gone">
                                <horizontal w="*" gravity="center_vertical" marginBottom="8">
                                    <text text="任務關卡：" textColor="#dddddd" textSize="11sp" w="90dp" />
                                    <linear id="btn_treasure_level" bg="#3a3a3a" radius="4dp" h="35dp" paddingLeft="8" gravity="center_vertical" clickable="true" w="wrap_content" minWidth="120dp">
                                        <text id="txt_treasure_level" text="Level 9" textColor="#ffcc00" textSize="10sp" layout_weight="1" includeFontPadding="false" />
                                        <text text="▼" textColor="#ffcc00" textSize="8sp" w="20dp" gravity="center" includeFontPadding="false" />
                                    </linear>
                                </horizontal>

                                <horizontal w="*" gravity="center_vertical" marginBottom="8">
                                    <text text="執行上限次數：" textColor="#dddddd" textSize="11sp" w="90dp" />
                                    <linear bg="#2c2c2c" radius="4dp" h="35dp" gravity="center_vertical">
                                        <button id="btn_treasure_limit_minus" text="-" w="25dp" h="*" bg="?attr/selectableItemBackground" textColor="#ffffff" textSize="14sp" textStyle="bold" minWidth="0" minHeight="0" padding="0" />
                                        <input id="edt_treasure_limit" text="5" w="50dp" h="*" gravity="center" textColor="#ffcc00" textSize="12sp" textStyle="bold" bg="#00000000" inputType="number" padding="0" includeFontPadding="false" />
                                        <button id="btn_treasure_limit_plus" text="+" w="25dp" h="*" bg="?attr/selectableItemBackground" textColor="#ffffff" textSize="14sp" textStyle="bold" minWidth="0" minHeight="0" padding="0" />
                                    </linear>
                                    <text text=" 次 (0為不限制)" textColor="#aaaaaa" textSize="11sp" marginLeft="6" />
                                </horizontal>

                                <horizontal w="*" gravity="center_vertical" marginBottom="8">
                                    <text text="重啟設定：" textColor="#dddddd" textSize="11sp" w="90dp" />
                                    <linear bg="#2c2c2c" radius="4dp" h="35dp" gravity="center_vertical">
                                        <button id="btn_treasure_restart_minus" text="-" w="25dp" h="*" bg="?attr/selectableItemBackground" textColor="#ffffff" textSize="14sp" textStyle="bold" minWidth="0" minHeight="0" padding="0" />
                                        <input id="edt_treasure_restart" text="5" w="50dp" h="*" gravity="center" textColor="#ffcc00" textSize="12sp" textStyle="bold" bg="#00000000" inputType="number" padding="0" includeFontPadding="false" />
                                        <button id="btn_treasure_restart_plus" text="+" w="25dp" h="*" bg="?attr/selectableItemBackground" textColor="#ffffff" textSize="14sp" textStyle="bold" minWidth="0" minHeight="0" padding="0" />
                                    </linear>
                                    <text text=" 次重啟 (0為不重啟)" textColor="#aaaaaa" textSize="11sp" marginLeft="6" />
                                </horizontal>

                                <linear w="*" gravity="center_vertical" marginBottom="6">
                                    <linear id="chk_treasure_return" w="*" gravity="left|center_vertical" clickable="true" bg="?selectableItemBackground" padding="4dp 0">
                                        <text id="icon_chk_treasure_return" text="☐" textSize="16sp" textColor="#ffcc00" textStyle="bold" clickable="false" />
                                        <text text="結束時返回主城" textSize="11sp" textColor="#ffffff" marginLeft="4dp" clickable="false" />
                                    </linear>
                                </linear>
                                <text text="系統將跳轉玩法選單進行尋寶任務，支持自動使用羅盤與六分儀進入秘境戰鬥。" textColor="#aaaaaa" textSize="11sp" />
                            </vertical>
                        </vertical>

                        <!-- 跟隨模式設定 (未來擴充預留) -->
                        <vertical id="layout_follow_mode" w="*" visibility="gone" padding="10" bg="#1e1e1e" radius="4dp">
                            <text text="跟隨模式設定 (開發中)" textColor="#ffcc00" textSize="12sp" marginBottom="8" textStyle="bold" />
                            <text text="即將推出跟隨隊長、自動掛機與協助戰鬥功能..." textColor="#aaaaaa" textSize="11sp" />
                        </vertical>
                    </vertical>
                </ScrollView>

                <ScrollView id="page3" w="*" h="*" visibility="gone">
                    <vertical padding="10">
                        <text text="系統核心設定" textColor="#ffcc00" textSize="12sp" marginBottom="12" textStyle="bold" />
                        
                        <linear w="*" gravity="center_vertical" marginBottom="6">
                            <text text="強制重啟遊戲" textColor="#dddddd" textSize="12sp" layout_weight="1" />
                            <linear bg="#2c2c2c" radius="4dp" h="35dp" gravity="center_vertical">
                                <button id="btn_restart_minus" text="-" w="30dp" h="*" bg="?attr/selectableItemBackground" textColor="#ffffff" textSize="16sp" textStyle="bold" minWidth="0" minHeight="0" padding="0" />
                                <input id="edt_restart_count" text="0" w="50dp" h="*" gravity="center" textColor="#ffcc00" textSize="12sp" textStyle="bold" bg="#00000000" inputType="number" padding="0" includeFontPadding="false" />
                                <button id="btn_restart_plus" text="+" w="30dp" h="*" bg="?attr/selectableItemBackground" textColor="#ffffff" textSize="16sp" textStyle="bold" minWidth="0" minHeight="0" padding="0" />
                            </linear>
                        </linear>
                        <text text="每執行 N 個角色後重啟遊戲一次 (0 表示永不執行)" textColor="#888888" textSize="10sp" marginBottom="15" />
                        
                        <view w="*" h="1dp" bg="#333333" marginBottom="15" />
                        <text text="復原功能細節" textColor="#ffcc00" textSize="12sp" marginBottom="8" textStyle="bold" />
                        <linear w="*" gravity="center_vertical" marginBottom="6">
                            <linear id="chk_resume_skip_switch" w="*" gravity="left|center_vertical" clickable="true" bg="?selectableItemBackground" padding="4dp 0">
                                <text id="icon_chk_resume_skip_switch" text="☐" textSize="16sp" textColor="#ffcc00" textStyle="bold" clickable="false" />
                                <text text="復原時若在主畫面，跳過切換直接執行任務" textSize="11sp" textColor="#ffffff" marginLeft="4dp" clickable="false" />
                            </linear>
                        </linear>
                        <text text="勾選：當執行復原時若偵測到已在主畫面，將不再執行換帳號或自動換角，直接從上次未完成的任務繼續。" textColor="#888888" textSize="10sp" />
                    </vertical>
                </ScrollView>
                
                <ScrollView id="page4" w="*" h="*" visibility="gone">
                    <vertical padding="10">
                        <text text="環境設置" textColor="#ffcc00" textSize="12sp" marginBottom="8" includeFontPadding="false" />
                        <button id="btn_req_capture" text="📸 螢幕截圖權限" margin="5" bg="#4CAF50" textColor="#fff" h="40dp" textSize="11sp" minWidth="0" minHeight="0" padding="0" />
                        <button id="btn_req_access" text="♿ 無障礙服務設定" margin="5" bg="#2196F3" textColor="#fff" h="40dp" textSize="11sp" minWidth="0" minHeight="0" padding="0" />
                        <button id="btn_req_battery" text="🔋 忽略電池優化" margin="5" bg="#FF9800" textColor="#fff" h="40dp" textSize="11sp" minWidth="0" minHeight="0" padding="0" />
                        <button id="btn_req_storage" text="📁 所有檔案存取權限" margin="5" bg="#9C27B0" textColor="#fff" h="40dp" textSize="11sp" minWidth="0" minHeight="0" padding="0" />
                        <button id="btn_req_notif" text="🔔 通知權限設定" margin="5" bg="#607D8B" textColor="#fff" h="40dp" textSize="11sp" minWidth="0" minHeight="0" padding="0" />
                        
                        <view w="*" h="1dp" bg="#333333" margin="5 5 10 5" />
                        <text text="線上更新 (GitHub)" textColor="#ffcc00" textSize="12sp" marginBottom="5" textStyle="bold" />

                        <linear w="*" gravity="center_vertical">
                            <text id="txt_current_version" text="目前版本: 0.0.001" textColor="#aaaaaa" textSize="11sp" layout_weight="1" />
                            <button id="btn_check_update" text="檢查更新" w="80dp" h="35dp" bg="#1e88e5" textColor="#ffffff" textSize="10sp" radius="6dp" minWidth="0dp" minHeight="0dp" padding="0dp" />
                        </linear>
                    </vertical>
                </ScrollView>
                
                <vertical id="page5" w="*" h="*" bg="#111111" padding="10" visibility="gone">
                    <linear orientation="vertical" w="*" padding="0 0 8 0" marginBottom="8">
                        <linear w="*" gravity="center_vertical" marginBottom="4">
                            <text text="目標帳號：" textColor="#ffcc00" textSize="11sp" textStyle="bold" w="65dp" />
                            <text id="txt_progress_acc" text="未選定" textColor="#ffffff" textSize="11sp" layout_weight="1" />
                        </linear>
                        <linear w="*" gravity="center_vertical" marginBottom="4">
                            <text text="目標角色：" textColor="#ffcc00" textSize="11sp" textStyle="bold" w="65dp" />
                            <text id="txt_progress_char" text="單角色" textColor="#ffffff" textSize="11sp" layout_weight="1" />
                        </linear>
                        <linear w="*" gravity="center_vertical">
                            <text text="目前任務：" textColor="#ffcc00" textSize="11sp" textStyle="bold" w="65dp" marginLeft="3.5dp" />
                            <text id="txt_progress_task" text="暫無資料" textColor="#00bfff" textSize="11sp" layout_weight="1" maxLines="1" ellipsize="end" />
                        </linear>
                    </linear>
                    <view w="*" h="1dp" bg="#333333" marginBottom="8"/>
                    <scroll layout_weight="1" id="log_scroll">
                        <text id="txt_log" text="[日誌] 初始化中...\n" textColor="#00FF00" textSize="11sp"/>
                    </scroll>
                </vertical>
            </frame>
        </horizontal>
        
        <linear w="*" h="45dp">
            <button id="btn_recover" text="🔄 復原" w="90dp" bg="#00bfff" textColor="#ffffff" textSize="14sp" textStyle="bold" h="*" margin="0" radius="0" minWidth="0dp" minHeight="0dp" padding="0dp" />
            <button id="btn_start" text="▶ 執行" layout_weight="1" bg="#ffcc00" textColor="#000000" textSize="15sp" textStyle="bold" h="*" margin="0" radius="0" minWidth="0dp" minHeight="0dp" padding="0dp" />
            <button id="btn_stop" text="⛔ 停止" w="90dp" bg="#cc2200" textColor="#ffffff" textSize="14sp" textStyle="bold" h="*" margin="0" radius="0" minWidth="0dp" minHeight="0dp" padding="0dp" />
        </linear>
    </vertical>

    <frame id="floating_ball" w="45dp" h="45dp" visibility="gone">
        <card w="*" h="*" cardCornerRadius="8dp" radius="8dp" cardBackgroundColor="#ffffff" cardElevation="0dp"> 
            <card id="status_border" w="41dp" h="41dp" layout_gravity="center" cardCornerRadius="6dp" radius="6dp" cardBackgroundColor="#000000" cardElevation="0dp">
                <card w="33dp" h="33dp" layout_gravity="center" cardCornerRadius="3dp" radius="3dp" cardBackgroundColor="#cc000000" cardElevation="0dp">
                    <text text="RO" textColor="#ffcc00" gravity="center" textSize="14sp" textStyle="bold"/>
                </card>
            </card>
        </card>
    </frame>
</frame>
`;
}


var layoutXml = getLayoutXml();

var window = null;

var initChar = "未選定 | 單角色";
var initTask = "暫無資料";
try {
    var pTemp = storage.get("ProgressTemp", null);
    if (pTemp) {
        var accStr = pTemp.account || "未選定";
        var charStr = "單角色";
        if (pTemp.serverId && pTemp.charIndex) {
            charStr = (SERVER_NAMES[pTemp.serverId - 1] || "未知伺服") + " - 角" + pTemp.charIndex;
        }
        initChar = accStr + " | " + charStr;

        if (pTemp.task) {
            var taskMap = {
                "MainLine.js": "主線任務",
                "CommissionBoard.js": "委託板",
                "PetExpedition.js": "寵物派遣",
                "Dungeon.js": "地下城",
                "PurchaseOrder.js": "商會訂單",
                "GuildOrder.js": "公會訂單",
                "GuildTrial.js": "公會試煉",
                "BloodMoon.js": "紅月",
                "WarCraft.js": "獸王爭霸",
                "ActivityReward.js": "活躍度獎勵",
                "Reward_Pass.js": "通行證獎勵",
                "MailReward.js": "信件領取",
                "DailyWelfare.js": "每日福利",
                "DoubleJourney.js": "雙人同行"
            };
            initTask = taskMap[pTemp.task] || pTemp.task;
        }
    }
} catch (e) { }

var uiState = {
    isMainUI: true,
    currentTab: 0,
    isInitialized: false,
    progressChar: initChar,
    progressTask: initTask
};

function refreshUI() {
    var oldWindow = window;
    layoutXml = getLayoutXml();

    var s = _getScreenSize();
    var density = context.getResources().getDisplayMetrics().density;
    var scale = (2.025 * s.w) / (900 * density);

    var currentLayout = layoutXml
        .replace(/(\d+(\.\d+)?)(dp|sp)/g, function (match, size, p2, unit) {
            var val = parseFloat(size);
            if (unit === "sp") {
                return (val * scale * 1.15).toFixed(1) + unit;
            }
            return (val * scale).toFixed(1) + unit;
        })
        .replace(/\b(padding|margin|radius|width|height|w|h)(?![a-zA-Z]*weight)[a-zA-Z]*="([\d\s\.]+)"/g, function (match, attr, value) {
            if (value.trim() === "") return match;
            var scaled = value.split(/\s+/).map(v => {
                var n = parseFloat(v);
                return (isNaN(n) || v === "") ? v : (n * scale).toFixed(1);
            }).join(' ');
            return attr + '="' + scaled + '"';
        });

    window = floaty.window(currentLayout);

    if (oldWindow) {
        try { oldWindow.close(); } catch (e) { }
    }

    setupUIInternal();

    ui.run(() => {
        if (uiState.isMainUI) {
            window.main_window.setVisibility(0);
            window.floating_ball.setVisibility(8);
            var density = context.getResources().getDisplayMetrics().density;
            var densityScale = density / 2.0;
            var targetRealW = s.w * (823 / 900);
            var targetRealH = s.h * (1479.6 / 1600);
            var dw = Math.round((35 - (11 / 360) * (s.w - 900)) * densityScale);
            var dh = Math.round((35 - (12 / 360) * (s.w - 900)) * densityScale);
            var winW = Math.round(targetRealW + dw);
            var winH = Math.round(targetRealH + dh);
            log("螢幕真實尺寸: " + s.w + "x" + s.h + ", DPI密度: " + density + ", 設定尺寸: " + winW + "x" + winH);
            window.setSize(winW, winH);
            window.setPosition(0, 0);
        } else {
            window.main_window.setVisibility(8);
            window.floating_ball.setVisibility(0);
            window.setSize(-2, -2);
            var pos = getBallPos();
            window.setPosition(pos.x, pos.y);
        }
        var parts = uiState.progressChar.split(" | ");
        if (window.txt_progress_acc) window.txt_progress_acc.setText(parts[0] || "未選定");
        if (window.txt_progress_char) window.txt_progress_char.setText(parts[1] || "單角色");
        if (window.txt_progress_task) window.txt_progress_task.setText(uiState.progressTask);
        switchTab(uiState.currentTab);
    });

    if (!uiState.isInitialized) {
        appendLog("螢幕真實尺寸: " + s.w + "x" + s.h);
        var density = context.getResources().getDisplayMetrics().density;
        var densityScale = density / 2.0;
        var targetRealW = s.w * (823 / 900);
        var targetRealH = s.h * (1479.6 / 1600);
        var dw = Math.round((35 - (11 / 360) * (s.w - 900)) * densityScale);
        var dh = Math.round((35 - (12 / 360) * (s.w - 900)) * densityScale);
        var logW = Math.round(targetRealW + dw);
        var logH = Math.round(targetRealH + dh);
        appendLog("設定懸浮窗尺寸: " + logW + "x" + logH + " (DPI密度: " + density + ")");
        appendLog("UI 面板初始化完成。");
        uiState.isInitialized = true;
    }
    updateStartButton();
}

function setupUIInternal() {
    window.btn_check_all.on("click", function () {
        var d = storage.load();
        for (var s = 1; s <= SERVER_NAMES.length; s++) {
            for (var c = 1; c <= 3; c++) d["Config_Char_" + s + "_" + c] = true;
        }
        storage.save(d);
        refreshUI();
    });

    window.btn_minimize.on("click", function () {
        minimizeUI();
    });

    window.btn_close.on("click", function () {
        var myId = engines.myEngine().id;
        var all = engines.all();
        for (var _k = 0; _k < all.length; _k++) {
            if (all[_k].id !== myId) {
                try { all[_k].forceStop(); } catch (e) { }
            }
        }
        // 解除全域廣播與清理定時器，避免記憶體洩漏
        if (typeof events !== "undefined" && events.broadcast) {
            try { events.broadcast.removeAllListeners("append_log"); } catch (e) { }
        }
        if (typeof uiUpdateTimeout !== "undefined" && uiUpdateTimeout) {
            clearTimeout(uiUpdateTimeout);
        }
        window.close();
        exit();
    });

    window.tab1.on("click", () => { uiState.currentTab = 0; switchTab(0); });
    window.tab2.on("click", () => { uiState.currentTab = 1; switchTab(1); });
    window.tab3.on("click", () => { uiState.currentTab = 2; switchTab(2); });
    window.tab4.on("click", () => { uiState.currentTab = 3; switchTab(3); });
    window.tab5.on("click", () => { uiState.currentTab = 4; switchTab(4); });

    bindStorageCheckbox("chk_task_reward_pass", "Task_RewardPass", false);
    bindStorageCheckbox("chk_task_daily_challenge", "Task_DailyChallenge", false);
    bindStorageCheckbox("chk_dc_enable_refresh", "DailyChallenge_EnableRefresh", false);
    bindStorageCheckbox("chk_task_board", "Task_Board", false);
    bindStorageCheckbox("chk_task_purchase", "Task_Purchase", false);
    bindStorageCheckbox("chk_purchase_at_least_one", "Purchase_AtLeastOne", false);
    bindStorageCheckbox("chk_task_dungeon", "Task_Dungeon", false);
    bindStorageCheckbox("chk_task_pet", "Task_Pet", false);
    bindStorageCheckbox("chk_task_guild", "Task_Guild", false);
    bindStorageCheckbox("chk_task_guild_trial", "Task_GuildTrial", false);
    bindStorageCheckbox("chk_task_moon", "Task_Moon", false);
    bindStorageCheckbox("chk_task_moon_return", "Moon_ReturnKafra", false);
    bindStorageCheckbox("chk_task_moon_only_exp", "Moon_OnlyExp", false);
    bindStorageCheckbox("chk_task_warcraft", "Task_WarCraft", false);
    bindStorageCheckbox("chk_task_activity", "Task_Activity", false);
    bindStorageCheckbox("chk_task_rewards_collect", "Task_RewardsCollect", false);
    bindStorageCheckbox("chk_task_mail", "Task_Mail", false);
    bindStorageCheckbox("chk_task_daily_welfare", "Task_DailyWelfare", false);
    bindStorageCheckbox("chk_task_double_journey", "Task_DoubleJourney", false);
    bindStorageCheckbox("chk_resume_skip_switch", "System_Resume_SkipSwitchOnMain", true);
    bindStorageCheckbox("chk_treasure_return", "Treasure_Hunt_ReturnKafra", false);

    var tasks = ["daily_challenge", "board", "purchase", "dungeon", "pet", "guild", "guild_trial", "moon", "warcraft", "rewards_collect"];
    tasks.forEach(t => {
        bindAccordion("head_task_" + t, "body_task_" + t, "arrow_task_" + t);
    });

    if (window.subtab_account) {
        window.subtab_account.on("click", () => {
            ui.run(() => {
                window.subtab_account.setTextColor(colors.parseColor("#ffcc00"));
                window.subtab_role.setTextColor(colors.parseColor("#aaaaaa"));
                window.subpage_account.setVisibility(0);
                window.subpage_role.setVisibility(8);
            });
        });
        window.subtab_role.on("click", () => {
            ui.run(() => {
                window.subtab_role.setTextColor(colors.parseColor("#ffcc00"));
                window.subtab_account.setTextColor(colors.parseColor("#aaaaaa"));
                window.subpage_account.setVisibility(8);
                window.subpage_role.setVisibility(0);
            });
        });
    }

    if (window.btn_auto_import) {
        window.btn_auto_import.on("click", function () {
            minimizeUI();
            threads.start(function () {
                var scriptPath = (_PathResolver && _PathResolver.getLoginScriptPath("Scan_Accounts.js")) || files.path("./LOGIN/Scan_Accounts.js");
                log("[FloatUI] Scan_Accounts 路徑: " + scriptPath);

                if (files.exists(scriptPath)) {
                    toastLog("開始自動導入...");
                    var execObj = engines.execScriptFile(scriptPath);
                    while (execObj.getEngine() == null) {
                        sleep(100);
                    }
                    var engine = execObj.getEngine();
                    while (!engine.isDestroyed()) {
                        sleep(500);
                    }
                    toastLog("導入結束，正在更新 UI...");

                    ui.run(() => {
                        // 1. 定義路徑並讀取
                        var accPath = accountListPath;
                        if (files.exists(accPath)) {
                            try {
                                var rawAccounts = JSON.parse(files.read(accPath));
                                // 轉換為 list 需要的格式
                                var accounts = rawAccounts.map(email => {
                                    return { email: email, checked: storage.get("Config_Acc_Login_" + email, false) };
                                });

                                // 2. 💡 核心：刷新 List 元件
                                if (window.account_list) {
                                    window.account_list.setDataSource(accounts);
                                    log("✅ UI 已更新，載入 " + accounts.length + " 個帳號");
                                } else {
                                    log("❌ 找不到 ID 為 account_list 的元件");
                                }
                            } catch (e) {
                                log("❌ 解析帳號清單失敗: " + e);
                            }
                        }

                        // 3. 切換分頁顯示
                        uiState.currentTab = 0;
                        window.subtab_account.setTextColor(colors.parseColor("#ffcc00"));
                        window.subtab_role.setTextColor(colors.parseColor("#aaaaaa"));
                        window.subpage_account.setVisibility(0);
                        window.subpage_role.setVisibility(8);
                    });
                } else {
                    toastLog("找不到導入腳本：" + scriptPath);
                }
            });
        });
    }

    // 💡 自動加載帳號存檔
    function autoLoadSavedAccounts() {
        threads.start(function () {
            var accPath = accountListPath;
            if (files.exists(accPath)) {
                try {
                    var rawAccounts = JSON.parse(files.read(accPath));
                    ui.run(() => {
                        if (window && window.account_list) {
                            var accounts = rawAccounts.map(email => {
                                return {
                                    email: email,
                                    checked: storage.get("Config_Acc_Login_" + email, false)
                                };
                            });
                            window.account_list.setDataSource(accounts);
                        }
                    });
                } catch (e) {
                    log("❌ 自動加載存檔失敗: " + e);
                }
            } else {
                log("ℹ️ 尚未發現帳號存檔，請先手動導入一次。");
            }
        });
    }

    // 將 updateAccountCheckboxes 指向 autoLoadSavedAccounts 以保持相容性
    var updateAccountCheckboxes = autoLoadSavedAccounts;

    // 在啟動邏輯中呼叫它
    autoLoadSavedAccounts();

    // ─── 帳號清單元件綁定事件 ───
    if (window.account_list) {
        // 輔助函數：從列表項 view 中找到 icon_chk_acc 元件
        var findAccIcon = function (itemView) {
            var icon = null;
            try { icon = itemView.findView("icon_chk_acc"); } catch (e) {}
            if (!icon) {
                try {
                    if (itemView.getChildCount && itemView.getChildCount() > 0) {
                        var child = itemView.getChildAt(0);
                        if (child && typeof child.setText === "function") {
                            icon = child;
                        } else if (child && child.getChildCount && child.getChildCount() > 0) {
                            var grandChild = child.getChildAt(0);
                            if (grandChild && typeof grandChild.setText === "function") icon = grandChild;
                        }
                    }
                } catch (e) {}
            }
            return icon;
        };

        // item_bind：僅負責視覺初始化（RecyclerView 回收視圖時同步圖示狀態）
        window.account_list.on("item_bind", function (itemView, itemHolder) {
            var item = itemHolder.item;
            if (!item) return;
            var icon = findAccIcon(itemView);
            if (icon && typeof icon.setText === "function") {
                try { icon.setText(item.checked ? "☑" : "☐"); } catch (e) {}
            }
        });

        // item_click：負責實際的勾選邏輯
        window.account_list.on("item_click", function (item, i, itemView) {
            if (!item) return;
            try {
                var accounts = (typeof window.account_list.getDataSource === "function")
                    ? window.account_list.getDataSource() : null;
                if (!accounts) return;

                var actualItem = accounts[i];
                if (!actualItem) return;

                var targetChecked = !actualItem.checked;
                actualItem.checked = targetChecked;
                storage.put("Config_Acc_Login_" + actualItem.email, targetChecked);

                var icon = findAccIcon(itemView);
                if (icon && typeof icon.setText === "function") {
                    ui.run(function () {
                        try { icon.setText(targetChecked ? "☑" : "☐"); } catch (e) {}
                    });
                }
            } catch (ex) {}
        });
    }

    if (window.btn_check_all_acc) {
        window.btn_check_all_acc.removeAllListeners("click");
        window.btn_check_all_acc.on("click", function () {
            if (!window.account_list) return;
            var accounts = window.account_list.getDataSource();
            if (!accounts || accounts.length === 0) return;

            var hasUnchecked = accounts.some(item => !item.checked);
            var targetStatus = hasUnchecked;

            accounts.forEach(item => {
                item.checked = targetStatus;
                storage.put("Config_Acc_Login_" + item.email, targetStatus);
            });

            // 通知 UI 刷新
            window.account_list.setDataSource(accounts);
        });
    }

    initCustomCheckboxes();

    // 每當介面重繪或切換，也執行初始化以確保圖示狀態正確
    ui.run(() => {
        for (let s = 1; s <= SERVER_NAMES.length; s++) {
            for (let c = 1; c <= 3; c++) {
                let savedState = storage.get("Config_Char_" + s + "_" + c, false);
                setCustomChecked(s, c, savedState);
            }
        }
    });

    if (window.btn_check_all) {
        window.btn_check_all.removeAllListeners("click");
        window.btn_check_all.on("click", function () {
            var data = storage.load();
            var hasUnchecked = false;
            for (var _s = 1; _s <= SERVER_NAMES.length; _s++) {
                for (var _c = 1; _c <= 3; _c++) {
                    if (data["Config_Char_" + _s + "_" + _c] !== true) {
                        hasUnchecked = true;
                        break;
                    }
                }
                if (hasUnchecked) break;
            }
            var target = hasUnchecked;
            for (var _s2 = 1; _s2 <= SERVER_NAMES.length; _s2++) {
                for (var _c2 = 1; _c2 <= 3; _c2++) {
                    var chkKey = "Config_Char_" + _s2 + "_" + _c2;
                    storage.put(chkKey, target);
                    setCustomChecked(_s2, _c2, target);
                }
            }
            toastLog(target ? "已全部勾選" : "已全部取消");
        });
    }

    for (var i = 0; i < SERVER_NAMES.length; i++) {
        (function (sId) {
            var txtObj = window["txt_server_" + sId];
            if (txtObj) {
                txtObj.on("click", function () {
                    var rowAllChecked = true;
                    for (var c = 1; c <= 3; c++) {
                        if (!storage.get("Config_Char_" + sId + "_" + c, false)) {
                            rowAllChecked = false;
                            break;
                        }
                    }
                    var targetState = !rowAllChecked;
                    for (var c = 1; c <= 3; c++) {
                        var storageKey = "Config_Char_" + sId + "_" + c;
                        storage.put(storageKey, targetState);
                        setCustomChecked(sId, c, targetState);
                    }
                });
            }
        })(i + 1);
    }

    bindCustomDropdown("btn_board_opt", "txt_board_opt", ["全部任務", "排除戰鬥任務"], "Board_Opt", 0);

    var levels = ["30", "40", "50", "60", "70", "80", "90", "100", "110"];
    bindCustomDropdown("btn_dungeon_mode", "txt_dungeon_mode", ["手動", "自動"], "Dungeon_Mode", 1, function (idx) {
        updateDungeonUI(idx);
    });
    bindCustomDropdown("btn_dungeon_level", "txt_dungeon_level", levels, "Dungeon_TargetLevel", "110", null, true, "Lv. ");
    bindCustomDropdown("btn_dungeon_diff", "txt_dungeon_diff", ["普通", "困難"], "Dungeon_Diff", 1);

    bindCustomDropdown("btn_main_mode", "txt_main_mode", ["每日任務模式", "特殊任務模式", "跟隨模式"], "Main_Task_Mode", 0, function (idx) {
        updateMainModeUI(idx);
    });

    bindCustomDropdown("btn_special_task", "txt_special_task", ["主線任務", "尋寶任務"], "Special_Task_Selected", 0, function (idx) {
        updateSpecialTaskUI(idx);
    });

    bindCustomDropdown("btn_treasure_level", "txt_treasure_level", ["1. 普隆德拉", "2. 夢羅克", "3. 艾爾貝塔", "4. 斐揚", "5. 吉芬", "6. 古城", "7. 豐饒綠洲", "8. 淪陷之城", "9. 盧恩"], "Treasure_Hunt_Level", 8);

    var moonLevels = ["自動", "111", "108", "101", "98", "91", "88", "81", "78", "71", "68", "61", "58", "48", "38", "29", "1"];
    bindCustomDropdown("btn_moon_level", "txt_moon_level", moonLevels, "Moon_Level", "自動", null, true);

    // 每日挑戰優先級選單綁定
    var dcDailyOptions = [
        "未選擇", 
        "完成5次委託板任務",
        "完成4次公會訂單",
        "完成4次商會訂單",
        "捕捉2次寵物",
        "完成4次寵物派遣",
        "參與1次公會試煉",
        "參與1次公會派對",
        "參與1次獸王爭霸賽",
        "參與1次KVM聯賽",
        "參與3次紅月入侵",
        "挑戰3次地下城",
        "挑戰3次MVP",
        "挑戰3次MINI",
        "交易行上架4商品",
        "交易行成交10000水晶",
        "在線達到60分鐘"
    ];
    var dcWeeklyOptions = [
        "未選擇", 
        "完成20次委託板任務",
        "完成16次公會訂單",
        "完成16次商會訂單",
        "捕捉8次寵物",
        "完成16次寵物派遣",
        "參與4次公會試煉",
        "參與4次公會派對",
        "參與4次獸王爭霸賽",
        "參與4次KVM聯賽",
        "參與12次紅月入侵",
        "挑戰12次地下城",
        "挑戰12次MVP",
        "挑戰12次MINI",
        "交易行上架16商品",
        "交易行成交50000水晶"
    ];

    bindDCPriorityDropdown("btn_dc_daily_1", "txt_dc_daily_1", dcDailyOptions, "DailyChallenge_Daily_1", function(val) { updateDCPriorityVisibility(); });
    bindDCPriorityDropdown("btn_dc_daily_2", "txt_dc_daily_2", dcDailyOptions, "DailyChallenge_Daily_2", function(val) { updateDCPriorityVisibility(); });
    bindDCPriorityDropdown("btn_dc_daily_3", "txt_dc_daily_3", dcDailyOptions, "DailyChallenge_Daily_3", function(val) { updateDCPriorityVisibility(); });
    bindDCPriorityDropdown("btn_dc_daily_4", "txt_dc_daily_4", dcDailyOptions, "DailyChallenge_Daily_4", function(val) { updateDCPriorityVisibility(); });

    bindDCPriorityDropdown("btn_dc_weekly_1", "txt_dc_weekly_1", dcWeeklyOptions, "DailyChallenge_Weekly_1", function(val) { updateDCPriorityVisibility(); });
    bindDCPriorityDropdown("btn_dc_weekly_2", "txt_dc_weekly_2", dcWeeklyOptions, "DailyChallenge_Weekly_2", function(val) { updateDCPriorityVisibility(); });
    bindDCPriorityDropdown("btn_dc_weekly_3", "txt_dc_weekly_3", dcWeeklyOptions, "DailyChallenge_Weekly_3", function(val) { updateDCPriorityVisibility(); });
    bindDCPriorityDropdown("btn_dc_weekly_4", "txt_dc_weekly_4", dcWeeklyOptions, "DailyChallenge_Weekly_4", function(val) { updateDCPriorityVisibility(); });

    // 初始化優先級顯示
    updateDCPriorityVisibility();

    if (window.btn_check_all_tasks) {
        window.btn_check_all_tasks.on("click", function () {
            var keys = [
                { id: "chk_task_daily_challenge", key: "Task_DailyChallenge" },
                { id: "chk_task_board", key: "Task_Board" },
                { id: "chk_task_pet", key: "Task_Pet" },
                { id: "chk_task_dungeon", key: "Task_Dungeon" },
                { id: "chk_task_purchase", key: "Task_Purchase" },
                { id: "chk_task_guild", key: "Task_Guild" },
                { id: "chk_task_moon", key: "Task_Moon" },
                { id: "chk_task_warcraft", key: "Task_WarCraft" },
                { id: "chk_task_rewards_collect", key: "Task_RewardsCollect" }
            ];
            var hasUnchecked = keys.some(item => !storage.get(item.key, false));
            var targetStatus = hasUnchecked;
            keys.forEach(item => {
                storage.put(item.key, targetStatus);
                if (window[item.id]) {
                    ui.run(() => window[item.id].setChecked(targetStatus));
                }
            });
            toastLog(targetStatus ? "已全部勾選每日任務" : "已全部取消每日任務");
        });
    }

    updateDungeonUI(storage.get("Dungeon_Mode", 1));
    updateMainModeUI(storage.get("Main_Task_Mode", 0));

    bindStepper("btn_moon_minus", "btn_moon_plus", "edt_moon_max", "Moon_MaxAward", 10);
    bindStepper("btn_moon_death_minus", "btn_moon_death_plus", "edt_moon_death", "Moon_DeathMax", 3);
    bindStepper("btn_board_battle_minus", "btn_board_battle_plus", "edt_board_battle_time", "Board_BattleTime", 60);
    bindStepper("btn_guild_trial_count_minus", "btn_guild_trial_count_plus", "edt_guild_trial_count", "GuildTrial_Count", 5);
    bindStepper("btn_guild_trial_sec_minus", "btn_guild_trial_sec_plus", "edt_guild_trial_sec", "GuildTrial_Seconds", 60);
    bindStepper("btn_warcraft_attempts_minus", "btn_warcraft_attempts_plus", "edt_warcraft_attempts", "warcraft_attempts", 2);
    bindStepper("btn_restart_minus", "btn_restart_plus", "edt_restart_count", "System_RestartCount", 0);
    bindStepper("btn_pet_vit_minus", "btn_pet_vit_plus", "edt_pet_vit", "Pet_Min_Vitality", 7500, 500);
    bindStepper("btn_pet_dispatch_minus", "btn_pet_dispatch_plus", "edt_pet_dispatch", "Pet_Max_Dispatch", 5, 1);
    bindStepper("btn_main_time_minus", "btn_main_time_plus", "edt_main_time", "MainLine_TimeLimit", 30, 5);
    bindStepper("btn_treasure_limit_minus", "btn_treasure_limit_plus", "edt_treasure_limit", "Treasure_Hunt_MaxLimit", 5, 1);
    bindStepper("btn_treasure_restart_minus", "btn_treasure_restart_plus", "edt_treasure_restart", "Treasure_Hunt_RestartLimit", 5, 1);

    setupBallTouchLogic();
    setupActionButtons();
    setupUpdateLogic();
}

function setupUpdateLogic() {
    var Updater = require("./Utils/Updater.js");
    var projPath = "./project.json";
    var projectJson = { versionName: "0.0.000" };
    if (files.exists(projPath)) {
        try { projectJson = JSON.parse(files.read(projPath)); } catch (e) { }
    }

    ui.run(() => {
        if (window.txt_current_version) window.txt_current_version.setText("目前版本: " + projectJson.versionName);
    });

    if (window.btn_check_update) {
        window.btn_check_update.on("click", function () {
            threads.start(function () {
                appendLog("🌐 正在連線 GitHub 檢查更新...");
                Updater.init();
                var res = Updater.checkVersion();

                if (!res.success) {
                    appendLog("❌ 檢查失敗: " + res.msg);
                    return;
                }

                var remote = res.data;
                appendLog("🔍 遠端版本: " + remote.version);

                if (remote.version !== projectJson.versionName) {
                    confirm("發現新版本 " + remote.version, "更新內容:\n" + (remote.changelog || "無說明") + "\n\n是否立即下載並覆蓋？", (confirmed) => {
                        if (confirmed) {
                            startUpdateProcess(remote);
                        }
                    });
                } else {
                    toast("目前已是最新版本");
                    appendLog("✅ 目前已是最新版本 (" + projectJson.versionName + ")");
                }
            });
        });
    }

    function startUpdateProcess(remoteInfo) {
        threads.start(function () {
            appendLog("🚀 開始下載更新檔...");
            var success = Updater.doUpdate(remoteInfo.files, rootDir, function (file, cur, total) {
                appendLog("⬇️ [" + cur + "/" + total + "] 下載中: " + file);
            });

            if (success) {
                appendLog("✅ 更新完成！請完全關閉並重啟腳本以套用變更。");
                alert("更新成功", "所有檔案已同步完成。\n請點擊確定後手動重啟腳本。");
            } else {
                appendLog("❌ 更新過程中斷，部分檔案可能未同步。");
                alert("更新失敗", "下載過程中發生錯誤，請檢查網路與 Token 權限。");
            }
        });
    }
}

function bindCustomDropdown(btnId, txtId, options, storageKey, defaultValue, onSelect, isStringValue, displayPrefix) {
    var btn = window[btnId];
    var txt = window[txtId];
    if (!btn || !txt) return;

    var updateUI = (val) => {
        var displayStr = "未選擇";
        if (isStringValue) {
            displayStr = (displayPrefix || "") + val;
        } else {
            displayStr = options[val] || "未選擇";
        }
        ui.run(() => txt.setText(displayStr));
    };

    var current = storage.get(storageKey, defaultValue);
    updateUI(current);

    btn.on("click", function () {
        var popup = new android.widget.PopupMenu(context, btn);
        options.forEach((opt, idx) => {
            popup.getMenu().add(0, idx, 0, (displayPrefix || "") + opt);
        });
        popup.setOnMenuItemClickListener(new android.widget.PopupMenu.OnMenuItemClickListener({
            onMenuItemClick: function (item) {
                var resId = item.getItemId();
                var saveVal = isStringValue ? options[resId] : resId;
                storage.put(storageKey, saveVal);
                updateUI(saveVal);
                if (onSelect) onSelect(resId);
                return true;
            }
        }));
        popup.show();
    });
}

function updateDungeonUI(mode) {
    ui.run(() => {
        if (!window.row_dungeon_detail) return;
        var isAuto = (mode === 1);
        window.row_dungeon_detail.setAlpha(isAuto ? 0.4 : 1.0);
        window.btn_dungeon_level.setClickable(!isAuto);
        window.btn_dungeon_diff.setClickable(!isAuto);
    });
}

function updateSpecialTaskUI(idx) {
    ui.run(() => {
        if (window.layout_special_main_settings) {
            window.layout_special_main_settings.setVisibility(idx === 0 ? 0 : 8);
        }
        if (window.layout_special_treasure_settings) {
            window.layout_special_treasure_settings.setVisibility(idx === 1 ? 0 : 8);
        }
    });
}

function updateMainModeUI(mode) {
    ui.run(() => {
        if (window.layout_daily_mode) {
            window.layout_daily_mode.setVisibility(mode === 0 ? 0 : 8);
        }
        if (window.layout_main_quest_mode) {
            window.layout_main_quest_mode.setVisibility(mode === 1 ? 0 : 8);
        }
        if (window.layout_follow_mode) {
            window.layout_follow_mode.setVisibility(mode === 2 ? 0 : 8);
        }
        storage.put("Task_MainQuest", mode === 1);
        if (mode === 1) {
            var subIdx = storage.get("Special_Task_Selected", 0);
            updateSpecialTaskUI(subIdx);
        }
    });
}

function bindStorageInput(viewId, storageKey, defaultValue) {
    var v = window[viewId];
    if (!v) return;

    // 停用編輯框焦點，改為點擊時彈出大對話框輸入，100% 避免無障礙與鍵盤衝突
    v.setFocusable(false);
    v.setFocusableInTouchMode(false);
    v.setClickable(true);

    var val = storage.get(storageKey, defaultValue);
    ui.run(() => v.setText(String(val)));

    v.on("click", function () {
        threads.start(function () {
            var currentVal = storage.get(storageKey, defaultValue);
            var newVal = dialogs.input("請輸入新數值：", String(currentVal));
            if (newVal !== null && newVal !== "") {
                var n = parseInt(newVal);
                if (!isNaN(n)) {
                    storage.put(storageKey, n);
                    ui.run(() => v.setText(String(n)));
                }
            }
        });
    });

    v.addTextChangedListener({
        afterTextChanged: function (s) {
            var n = parseInt(s.toString());
            if (!isNaN(n)) storage.put(storageKey, n);
        }
    });
}

function bindStepper(minusId, plusId, inputId, storageKey, defaultValue, step) {
    var stepVal = step || 1;
    var minus = window[minusId];
    var plus = window[plusId];
    var input = window[inputId];
    if (!minus || !plus || !input) return;

    // 停用編輯框焦點，改為點擊時彈出大對話框輸入，100% 避免無障礙與鍵盤衝突
    input.setFocusable(false);
    input.setFocusableInTouchMode(false);
    input.setClickable(true);

    var updateUI = (val) => {
        ui.run(() => input.setText(String(val)));
    };

    var current = storage.get(storageKey, defaultValue);
    updateUI(current);

    minus.on("click", function () {
        var val = storage.get(storageKey, defaultValue);
        if (val >= stepVal) {
            val -= stepVal;
            storage.put(storageKey, val);
            updateUI(val);
        }
    });

    plus.on("click", function () {
        var val = storage.get(storageKey, defaultValue);
        val += stepVal;
        storage.put(storageKey, val);
        updateUI(val);
    });

    input.on("click", function () {
        threads.start(function () {
            var currentVal = storage.get(storageKey, defaultValue);
            var newVal = dialogs.input("請輸入新數值：", String(currentVal));
            if (newVal !== null && newVal !== "") {
                var n = parseInt(newVal);
                if (!isNaN(n)) {
                    storage.put(storageKey, n);
                    updateUI(n);
                }
            }
        });
    });

    input.addTextChangedListener({
        afterTextChanged: function (s) {
            var n = parseInt(s.toString());
            if (!isNaN(n)) storage.put(storageKey, n);
        }
    });
}

var pausedEngines = [];
var isTaskPaused = false;

function isTaskRunning() {
    var myId = engines.myEngine().id;
    var all = engines.all();
    for (var i = 0; i < all.length; i++) {
        if (all[i].id !== myId) return true;
    }
    return false;
}

function updateStartButton(forceRunning) {
    if (!window) return;
    var running = (forceRunning !== undefined) ? forceRunning : isTaskRunning();
    ui.run(() => {
        if (window.btn_start) {
            if (!running) {
                window.btn_start.setText("▶ 執行");
                window.btn_start.setBackgroundColor(colors.parseColor("#ffcc00"));
            } else {
                if (isTaskPaused) {
                    window.btn_start.setText("▶ 繼續");
                    window.btn_start.setBackgroundColor(colors.parseColor("#ffcc00"));
                } else {
                    window.btn_start.setText("⏸ 暫停");
                    window.btn_start.setBackgroundColor(colors.parseColor("#ffaa00"));
                }
            }
        }

        if (window.status_border) {
            var color = "#000000";
            if (running) {
                color = isTaskPaused ? "#FFFF00" : "#00FF00";
            }
            window.status_border.setCardBackgroundColor(colors.parseColor(color));
        }
    });
    updateRecoverButton();
}

function updateRecoverButton() {
    if (!window || !window.btn_recover) return;
    var process = storage.get("ProgressTemp", null);
    var hasProcess = !!(process && (process.account || process.serverId || process.task));
    ui.run(() => {
        if (hasProcess) {
            window.btn_recover.setEnabled(true);
            window.btn_recover.setBackgroundColor(colors.parseColor("#00bfff"));
            window.btn_recover.setTextColor(colors.parseColor("#ffffff"));
        } else {
            window.btn_recover.setEnabled(false);
            window.btn_recover.setBackgroundColor(colors.parseColor("#555555"));
            window.btn_recover.setTextColor(colors.parseColor("#aaaaaa"));
        }
    });
}

function minimizeUI() {
    resumeOtherEngines();
    uiState.isMainUI = false;
    var pos = getBallPos();
    ui.run(() => {
        if (window.main_window) window.main_window.setVisibility(8);
        if (window.floating_ball) window.floating_ball.setVisibility(0);
        window.setSize(-2, -2);
        window.setPosition(pos.x, pos.y);
    });
}

function pauseOtherEngines() {
    storage.put("Global_Paused", true);
    var myId = engines.myEngine().id;
    var all = engines.all();

    if (!pausedEngines) pausedEngines = [];

    for (var _e = 0; _e < all.length; _e++) {
        var engine = all[_e];
        if (engine.id !== myId) {
            try {
                if (typeof engine.pause === "function") {
                    engine.pause();
                } else if (engine.getControl) {
                    engine.getControl().setPaused(true);
                }

                if (pausedEngines.indexOf(engine) === -1) {
                    pausedEngines.push(engine);
                }
            } catch (e) { }
        }
    }
    if (pausedEngines.length > 0) appendLog("⏸️ 已下達暫停指令 (" + pausedEngines.length + "個)");
    updateStartButton();
}

function resumeOtherEngines() {
    if (isTaskPaused) {
        appendLog("⏸️ 處於手動暫停狀態，不恢復執行");
        return;
    }
    storage.put("Global_Paused", false);
    var resumed = 0;
    if (pausedEngines) {
        for (var _e = 0; _e < pausedEngines.length; _e++) {
            try {
                var eng = pausedEngines[_e];
                if (typeof eng.resume === "function") {
                    eng.resume();
                } else if (eng.getControl) {
                    eng.getControl().setPaused(false);
                }
                resumed++;
            } catch (e) { }
        }
    }
    if (resumed > 0) appendLog("▶️ 已恢復 " + resumed + " 個腳本");
    pausedEngines = [];
}

var logCount = 0; // 全域計數器
var logCache = [];
var N_LOG = 25; // N 值定義為可修改
var uiUpdateTimeout = null; // 節流更新定時器

function appendLog(msg, isError) {
    var now = new Date();
    var pad = function (n) { return n < 10 ? "0" + n : n; };
    var timeStr = pad(now.getHours()) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds());
    var fullMsg = "[" + timeStr + "] " + msg;

    // 1. 懸浮窗邏輯 (永遠執行)
    logCache.push(fullMsg);

    // 每達到 2N 條紀錄，就清除最前方 N 條 LOG 紀錄
    if (logCache.length >= 2 * N_LOG) {
        logCache.splice(0, N_LOG);
    }

    // 2. ⚡ 節流更新懸浮窗 UI（防止高頻更新時建立過多 Runnable 閉包導致記憶體抖動）
    if (!uiUpdateTimeout) {
        uiUpdateTimeout = setTimeout(function () {
            ui.run(function () {
                if (window && window.txt_log) {
                    window.txt_log.setText(logCache.join("\n"));
                }
            });
            uiUpdateTimeout = null;
        }, 150); // 每 150ms 最多更新一次 UI，大幅減輕 CPU 與 GC 壓力
    }

    // 3. 計數邏輯
    logCount++;

    // 4. 如果是報錯或關鍵通知，才真的 print 出來
    if (isError === true || isError === "true") {
        print("[ERROR] " + fullMsg);
    }

    // 5. 定期物理清理主控台緩存
    if (logCount >= 100) {
        try {
            console.clear();
        } catch (e) { }
        logCount = 0;
        print("--- System Auto-Cleaned ---");
    }
}

// 註冊廣播監聽器以接收來自其他腳本（如 TaskRunner）的日誌並集中發布
if (typeof events !== "undefined" && events.broadcast) {
    events.broadcast.on("append_log", appendLog); // 使用具名函式便於解綁
    events.broadcast.on("update_progress", function (charInfo, taskInfo) {
        if (charInfo !== undefined && charInfo !== null) {
            uiState.progressChar = charInfo;
        }
        if (taskInfo !== undefined && taskInfo !== null) {
            uiState.progressTask = taskInfo;
        }
        ui.run(function () {
            if (window) {
                var parts = uiState.progressChar.split(" | ");
                if (window.txt_progress_acc) window.txt_progress_acc.setText(parts[0] || "未選定");
                if (window.txt_progress_char) window.txt_progress_char.setText(parts[1] || "單角色");
                if (window.txt_progress_task) window.txt_progress_task.setText(uiState.progressTask);
            }
        });
    });
}


var tabs = ["tab1", "tab2", "tab3", "tab4", "tab5"];
var pages = ["page1", "page2", "page3", "page4", "page5"];
function switchTab(index) {
    ui.run(function () {
        for (var i = 0; i < 5; i++) {
            var tabObj = window[tabs[i]];
            if (tabObj) {
                var txtObj = tabObj.getChildAt(0);
                if (txtObj) {
                    txtObj.setTextColor(colors.parseColor(i === index ? "#ffcc00" : "#aaaaaa"));
                    txtObj.setTypeface(null, i === index ? 1 : 0);
                }
            }
            if (window[pages[i]]) window[pages[i]].setVisibility(i === index ? 0 : 8);
        }
    });
}

function bindStorageCheckbox(viewId, storageKey, defaultValue, callback) {
    var v = window[viewId];
    if (!v) return;

    var iconId = "icon_" + viewId;
    var icon = window[iconId];

    // 取得初始狀態
    var val = storage.get(storageKey, defaultValue);

    // 輔助更新圖示函式
    var updateIcon = (checked) => {
        if (icon) {
            ui.run(() => {
                icon.setText(checked ? "☑" : "☐");
            });
        }
    };

    // 初始化圖示
    updateIcon(val);

    // 🚀 動態注入 setChecked 方法，完美相容批量全選/取消全選 (如 btn_check_all_tasks 邏輯)
    v.setChecked = function (checked) {
        storage.put(storageKey, checked);
        updateIcon(checked);
        if (callback) callback(checked);
    };

    // 🚀 採用最穩定的 OnTouchListener 方案
    var touchListener = function (view, event) {
        if (event.getAction() == event.ACTION_UP) {
            var currentVal = storage.get(storageKey, defaultValue);
            var newVal = !currentVal;
            v.setChecked(newVal);
        }
        return true;
    };

    if (v && v.isClickable()) {
        v.setOnTouchListener(touchListener);
    }
    if (icon && v.isClickable()) {
        icon.setOnTouchListener(touchListener);
    }
}

function bindAccordion(headId, bodyId, arrowId) {
    if (!window[headId] || !window[bodyId]) return;
    window[headId].on("click", function () {
        var isVisible = window[bodyId].getVisibility() === 0;
        ui.run(() => {
            window[bodyId].setVisibility(isVisible ? 8 : 0);
            if (window[arrowId]) {
                window[arrowId].setText(isVisible ? "▼" : "▲");
                window[arrowId].setTextColor(colors.parseColor(isVisible ? "#ffcc00" : "#ffffff"));
            }
        });
    });
}

function setupBallTouchLogic() {
    var x = 0, y = 0, windowX, windowY, isMoving = false;
    window.floating_ball.setOnTouchListener(function (view, event) {
        switch (event.getAction()) {
            case event.ACTION_DOWN:
                x = event.getRawX(); y = event.getRawY();
                windowX = window.getX(); windowY = window.getY();
                isMoving = false; return true;
            case event.ACTION_MOVE:
                var dx = event.getRawX() - x; var dy = event.getRawY() - y;
                if (Math.abs(dx) > 5 || Math.abs(dy) > 5) isMoving = true;
                if (isMoving) window.setPosition(windowX + dx, windowY + dy);
                return true;
            case event.ACTION_UP:
                if (isMoving) {
                    var clamped = saveBallPos(window.getX(), window.getY());
                    window.setPosition(clamped.x, clamped.y);
                } else {
                    saveBallPos(window.getX(), window.getY());
                    uiState.isMainUI = true;
                    var sSize = _getScreenSize();
                    var density = context.getResources().getDisplayMetrics().density;
                    var densityScale = density / 2.0;
                    var targetRealW = sSize.w * (823 / 900);
                    var targetRealH = sSize.h * (1479.6 / 1600);
                    var dw = Math.round((35 - (11 / 360) * (sSize.w - 900)) * densityScale);
                    var dh = Math.round((35 - (12 / 360) * (sSize.w - 900)) * densityScale);
                    var winW = Math.round(targetRealW + dw);
                    var winH = Math.round(targetRealH + dh);
                    ui.run(() => {
                        window.main_window.setVisibility(0);
                        window.floating_ball.setVisibility(8);
                        window.setSize(winW, winH);
                        window.setPosition(0, 0);
                    });
                    pauseOtherEngines();
                }
                return true;
        }
        return true;
    });

    window.title_bar.setOnTouchListener(function (view, event) {
        switch (event.getAction()) {
            case event.ACTION_DOWN:
                x = event.getRawX(); y = event.getRawY();
                windowX = window.getX(); windowY = window.getY();
                isMoving = false; return true;
            case event.ACTION_MOVE:
                var dx = event.getRawX() - x; var dy = event.getRawY() - y;
                if (Math.abs(dx) > 5 || Math.abs(dy) > 5) isMoving = true;
                if (isMoving) window.setPosition(windowX + dx, windowY + dy);
                return true;
        }
        return true;
    });
}

function setupActionButtons() {
    window.btn_req_capture.on("click", function () {
        threads.start(() => {
            var success = false;
            if (PermissionHandler && typeof PermissionHandler.requestScreenCaptureAuto === "function") {
                console.log("[FloatUI] 呼叫 PermissionHandler.requestScreenCaptureAuto");
                success = PermissionHandler.requestScreenCaptureAuto(false);
            } else {
                console.warn("[FloatUI] PermissionHandler 未就緒，使用備援請求");
                success = requestScreenCapture();
            }

            if (success) {
                toastLog("✅ 截圖權限取得成功");
            } else {
                toastLog("❌ 截圖權限取得失敗");
            }
        });
    });

    window.btn_req_access.on("click", function () {
        app.startActivity({
            action: "android.settings.ACCESSIBILITY_SETTINGS"
        });
        toast("請在列表中找到並開啟此服務");
    });

    window.btn_req_battery.on("click", function () {
        try {
            var intent = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
            intent.setData(Uri.parse("package:" + context.getPackageName()));
            app.startActivity(intent);
        } catch (e) {
            app.startActivity({ action: "android.settings.IGNORE_BATTERY_OPTIMIZATION_SETTINGS" });
        }
    });

    window.btn_req_storage.on("click", function () {
        if (device.sdkInt >= 30) {
            try {
                var intent = new Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION);
                intent.setData(Uri.parse("package:" + context.getPackageName()));
                app.startActivity(intent);
            } catch (e) {
                app.startActivity({ action: "android.settings.MANAGE_ALL_FILES_ACCESS_PERMISSION" });
            }
        } else {
            toast("Android 11 以下系統不需要此權限");
        }
    });

    window.btn_req_notif.on("click", function () {
        var intent = new Intent();
        if (device.sdkInt >= 26) {
            intent.setAction("android.settings.APP_NOTIFICATION_SETTINGS");
            intent.putExtra("android.provider.extra.APP_PACKAGE", context.getPackageName());
        } else {
            intent.setAction("android.settings.APPLICATION_DETAILS_SETTINGS");
            intent.setData(Uri.parse("package:" + context.getPackageName()));
        }
        app.startActivity(intent);
    });

    if (window.btn_recover) {
        window.btn_recover.on("click", function () {
            var running = isTaskRunning();
            if (!running) {
                isTaskPaused = false;
                appendLog("讀取復原記錄，準備啟動...");
                storage.put("ResumeMode", true);
                minimizeUI();

                threads.start(function () {
                    appendLog("交接給主控腳本 TaskRunner.js...");

                    var taskPath = (_PathResolver && _PathResolver.taskRunnerPath) || files.path("./TaskRunner.js");
                    log("[FloatUI] TaskRunner 路徑: " + taskPath);
                    var execution = null;
                    try {
                        execution = engines.execScriptFile(taskPath);
                    } catch (e) {
                        appendLog("⚠️ 啟動失敗: " + e, true);
                    }

                    if (execution) {
                        updateStartButton(true);
                        var engine = null;
                        while (engine == null) {
                            engine = execution.getEngine();
                            sleep(200);
                        }
                        while (!engine.isDestroyed()) {
                            sleep(1000);
                        }
                        appendLog("🏁 TaskRunner 執行結束");
                        updateStartButton();
                    } else {
                        appendLog("⚠️ 錯誤：找不到 TaskRunner.js (" + taskPath + ")");
                        updateStartButton();
                    }
                });
            }
        });
    }

    window.btn_start.on("click", function () {
        var running = isTaskRunning();
        if (!running) {
            isTaskPaused = false;
            appendLog("儲存設定，準備啟動...");
            storage.put("ResumeMode", false);
            minimizeUI();

            threads.start(function () {
                appendLog("交接給主控腳本 TaskRunner.js...");

                var taskPath = (_PathResolver && _PathResolver.taskRunnerPath) || files.path("./TaskRunner.js");
                log("[FloatUI] TaskRunner 路徑: " + taskPath);
                var execution = null;
                try {
                    execution = engines.execScriptFile(taskPath);
                } catch (e) {
                    appendLog("⚠️ 啟動失敗: " + e, true);
                }

                if (execution) {
                    updateStartButton(true);
                    var engine = null;
                    while (engine == null) {
                        engine = execution.getEngine();
                        sleep(200);
                    }
                    while (!engine.isDestroyed()) {
                        sleep(1000);
                    }
                    appendLog("🏁 TaskRunner 執行結束");
                    updateStartButton();
                } else {
                    appendLog("⚠️ 錯誤：找不到 TaskRunner.js (" + taskPath + ")");
                    updateStartButton();
                }
            });
        } else {
            if (isTaskPaused) {
                isTaskPaused = false;
                appendLog("▶️ 恢復程序執行...");
                minimizeUI();
                updateStartButton(true);
            } else {
                isTaskPaused = true;
                appendLog("⏸️ 已設定手動暫停");
                pauseOtherEngines();
                updateStartButton(true);
            }
        }
    });

    window.btn_stop.on("click", function () {
        var myId = engines.myEngine().id;
        var all = engines.all();
        var stopped = 0;
        for (var _e = 0; _e < all.length; _e++) {
            if (all[_e].id !== myId) {
                try { all[_e].forceStop(); stopped++; } catch (e) { }
            }
        }
        isTaskPaused = false;
        updateStartButton();
        appendLog(stopped > 0 ? ("⛔ 已停止 " + stopped + " 個腳本") : "⚠️ 目前沒有其他腳本在執行");
    });
}

function _getBallRadius() {
    var s = _getScreenSize();
    var scale = s.w / 900;
    var metrics = context.getResources().getDisplayMetrics();
    var dpScaled = 45 * scale * metrics.density;
    return Math.round(dpScaled / 2);
}

var _RATIO_MIN = -0.015;
var _RATIO_MAX = 1.008;

function _getScreenSize() {
    var windowManager = context.getSystemService(context.WINDOW_SERVICE);
    var display = windowManager.getDefaultDisplay();
    var metrics = new android.util.DisplayMetrics();
    display.getRealMetrics(metrics);
    var w = metrics.widthPixels;
    var h = metrics.heightPixels;
    var conf = context.getResources().getConfiguration();
    if (conf.orientation === 1 && w > h) return { w: h, h: w };
    if (conf.orientation === 2 && h > w) return { w: h, h: w };
    return { w: w, h: h };
}

function getBallPos() {
    var s = _getScreenSize();
    var r = _getBallRadius();
    var ratioX = storage.get("Ball_RatioX", 0.85);
    var ratioY = storage.get("Ball_RatioY", 0.50);

    ratioX = Math.min(Math.max(ratioX, _RATIO_MIN), _RATIO_MAX);
    ratioY = Math.min(Math.max(ratioY, _RATIO_MIN), _RATIO_MAX);

    var centerX = Math.round(ratioX * s.w);
    var centerY = Math.round(ratioY * s.h);

    var px = centerX - r;
    var py = centerY - r;

    px = Math.min(Math.max(px, -r * 2 + 10), s.w - 10);
    py = Math.min(Math.max(py, -r * 2 + 10), s.h - 10);

    return { x: px, y: py };
}

function saveBallPos(px, py) {
    var s = _getScreenSize();
    var r = _getBallRadius();
    if (s.w <= 0 || s.h <= 0) return { x: px, y: py };

    var centerX = px + r;
    var centerY = py + r;

    var ratioX = centerX / s.w;
    var ratioY = centerY / s.h;

    ratioX = Math.min(Math.max(ratioX, _RATIO_MIN), _RATIO_MAX);
    ratioY = Math.min(Math.max(ratioY, _RATIO_MIN), _RATIO_MAX);

    storage.put("Ball_RatioX", ratioX);
    storage.put("Ball_RatioY", ratioY);

    return {
        x: Math.round(ratioX * s.w) - r,
        y: Math.round(ratioY * s.h) - r
    };
}

function bindDCPriorityDropdown(btnId, txtId, options, storageKey, onSelect) {
    var btn = window[btnId];
    var txt = window[txtId];
    if (!btn || !txt) return;

    var numMatch = btnId.match(/\d+$/);
    var slotNum = numMatch ? numMatch[0] : "";

    var updateUI = () => {
        var val = storage.get(storageKey, "未選擇");
        var displayStr = val;
        ui.run(() => txt.setText(slotNum ? slotNum + ": " + displayStr : displayStr));
    };

    updateUI();

    btn.on("click", function () {
        var title = btnId.indexOf("daily") !== -1 ? "選擇每日任務優先級 " + slotNum : "選擇每周任務優先級 " + slotNum;
        
        // 獲取其他插槽中已經選取的項目，避免重複選擇
        var otherSelected = [];
        var prefix = btnId.indexOf("daily") !== -1 ? "DailyChallenge_Daily_" : "DailyChallenge_Weekly_";
        for (var i = 1; i <= 4; i++) {
            if (i.toString() !== slotNum) {
                var selectedVal = storage.get(prefix + i, "未選擇");
                if (selectedVal !== "未選擇" && selectedVal !== "") {
                    otherSelected.push(selectedVal);
                }
            }
        }

        // 過濾掉其他插槽已經選過的項目
        var filteredOptions = options.filter(function(opt) {
            if (opt === "未選擇") return true;
            return otherSelected.indexOf(opt) === -1;
        });

        dialogs.select(title, filteredOptions, function(resId) {
            if (resId >= 0) {
                var saveVal = filteredOptions[resId];
                storage.put(storageKey, saveVal);
                updateUI();
                if (onSelect) onSelect(saveVal);
            }
        });
    });
}

function updateDCPriorityVisibility() {
    ui.run(() => {
        // Daily Compaction & Shifting
        var dailyVals = [
            storage.get("DailyChallenge_Daily_1", "未選擇"),
            storage.get("DailyChallenge_Daily_2", "未選擇"),
            storage.get("DailyChallenge_Daily_3", "未選擇"),
            storage.get("DailyChallenge_Daily_4", "未選擇")
        ];
        var activeDaily = dailyVals.filter(function(v) { return v !== "未選擇" && v !== ""; });
        while (activeDaily.length < 4) {
            activeDaily.push("未選擇");
        }
        for (var i = 0; i < 4; i++) {
            var key = "DailyChallenge_Daily_" + (i + 1);
            if (storage.get(key, "未選擇") !== activeDaily[i]) {
                storage.put(key, activeDaily[i]);
            }
        }
        var daily_1 = activeDaily[0];
        var daily_2 = activeDaily[1];
        var daily_3 = activeDaily[2];
        var daily_4 = activeDaily[3];

        if (window.txt_dc_daily_1) window.txt_dc_daily_1.setText("1: " + daily_1);
        if (window.txt_dc_daily_2) window.txt_dc_daily_2.setText("2: " + daily_2);
        if (window.txt_dc_daily_3) window.txt_dc_daily_3.setText("3: " + daily_3);
        if (window.txt_dc_daily_4) window.txt_dc_daily_4.setText("4: " + daily_4);

        var showDaily2 = (daily_1 !== "未選擇" && daily_1 !== "");
        var showDaily3 = showDaily2 && (daily_2 !== "未選擇" && daily_2 !== "");
        var showDaily4 = showDaily3 && (daily_3 !== "未選擇" && daily_3 !== "");

        if (window.btn_dc_daily_2) window.btn_dc_daily_2.setVisibility(showDaily2 ? 0 : 8);
        if (window.btn_dc_daily_3) window.btn_dc_daily_3.setVisibility(showDaily3 ? 0 : 8);
        if (window.btn_dc_daily_4) window.btn_dc_daily_4.setVisibility(showDaily4 ? 0 : 8);
        if (window.layout_dc_daily_row2) window.layout_dc_daily_row2.setVisibility(showDaily3 ? 0 : 8);

        // Weekly Compaction & Shifting
        var weeklyVals = [
            storage.get("DailyChallenge_Weekly_1", "未選擇"),
            storage.get("DailyChallenge_Weekly_2", "未選擇"),
            storage.get("DailyChallenge_Weekly_3", "未選擇"),
            storage.get("DailyChallenge_Weekly_4", "未選擇")
        ];
        var activeWeekly = weeklyVals.filter(function(v) { return v !== "未選擇" && v !== ""; });
        while (activeWeekly.length < 4) {
            activeWeekly.push("未選擇");
        }
        for (var i = 0; i < 4; i++) {
            var key = "DailyChallenge_Weekly_" + (i + 1);
            if (storage.get(key, "未選擇") !== activeWeekly[i]) {
                storage.put(key, activeWeekly[i]);
            }
        }
        var weekly_1 = activeWeekly[0];
        var weekly_2 = activeWeekly[1];
        var weekly_3 = activeWeekly[2];
        var weekly_4 = activeWeekly[3];

        if (window.txt_dc_weekly_1) window.txt_dc_weekly_1.setText("1: " + weekly_1);
        if (window.txt_dc_weekly_2) window.txt_dc_weekly_2.setText("2: " + weekly_2);
        if (window.txt_dc_weekly_3) window.txt_dc_weekly_3.setText("3: " + weekly_3);
        if (window.txt_dc_weekly_4) window.txt_dc_weekly_4.setText("4: " + weekly_4);

        var showWeekly2 = (weekly_1 !== "未選擇" && weekly_1 !== "");
        var showWeekly3 = showWeekly2 && (weekly_2 !== "未選擇" && weekly_2 !== "");
        var showWeekly4 = showWeekly3 && (weekly_3 !== "未選擇" && weekly_3 !== "");

        if (window.btn_dc_weekly_2) window.btn_dc_weekly_2.setVisibility(showWeekly2 ? 0 : 8);
        if (window.btn_dc_weekly_3) window.btn_dc_weekly_3.setVisibility(showWeekly3 ? 0 : 8);
        if (window.btn_dc_weekly_4) window.btn_dc_weekly_4.setVisibility(showWeekly4 ? 0 : 8);
        if (window.layout_dc_weekly_row2) window.layout_dc_weekly_row2.setVisibility(showWeekly3 ? 0 : 8);
    });
}

initDefaultSettings();
refreshUI();

var lastScreenWidth = -1;
var lastScreenHeight = -1;
setInterval(() => {
    var metrics = context.getResources().getDisplayMetrics();
    var currW = metrics.widthPixels;
    var currH = metrics.heightPixels;
    if (currW !== lastScreenWidth || currH !== lastScreenHeight) {
        lastScreenWidth = currW;
        lastScreenHeight = currH;
        refreshUI();
    }
}, 2000);
