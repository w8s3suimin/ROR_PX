# Rules

## Database Safety
**CRITICAL RULE: NEVER execute SQL scripts or commands that could drop, delete, or drastically alter database tables (e.g., `DROP TABLE`, `DELETE FROM`, `TRUNCATE`, migrations) without first creating a local backup of the database.**

Before making any structural or destructive changes to a Supabase or Postgres database:
1. You MUST explicitly ask the user if they have a backup.
2. If they do not, you MUST help them export a backup by running the project's official backup script `.\backup.ps1` to save it to the local `db_backups/` directory.
3. Only proceed with the destructive SQL execution AFTER the backup is confirmed to be safely saved.

## Postgres Function / RPC Updates
**CRITICAL RULE: NEVER modify or update an existing API function (RPC) signature by yourself.**
The authority to design, update, and manage the API structure and parameters belongs ENTIRELY to the script-side AGENT (who understands the integration requirements best).
If a change to an API function is needed, you must NOT do it yourself. Instead, defer the task to the script AGENT or wait for their instructions.

## 版本發布管理提示
**REMINDER**: 當使用者詢問或尋找網頁的版本更新日誌發布腳本時，請主動提醒使用者：「網頁的新版本發布日誌與版本號，是由 AI 腳本 (專屬 SKILL) 全自動管理的。」使用者不需要自己尋找並手動執行腳本更新頁面，只需請 AI 執行更新即可。
