# Rules

## Database Safety
**CRITICAL RULE: NEVER execute SQL scripts or commands that could drop, delete, or drastically alter database tables (e.g., `DROP TABLE`, `DELETE FROM`, `TRUNCATE`, migrations) without first creating a local backup of the database.**

Before making any structural or destructive changes to a Supabase or Postgres database:
1. You MUST explicitly ask the user if they have a backup.
2. If they do not, you MUST help them export a backup using `supabase db dump` or `pg_dump` and save it to the local filesystem.
3. Only proceed with the destructive SQL execution AFTER the backup is confirmed to be safely saved.

## Postgres Function / RPC Updates
**CRITICAL RULE: NEVER modify or update an existing API function (RPC) signature by yourself.**
The authority to design, update, and manage the API structure and parameters belongs ENTIRELY to the script-side AGENT (who understands the integration requirements best).
If a change to an API function is needed, you must NOT do it yourself. Instead, defer the task to the script AGENT or wait for their instructions.
