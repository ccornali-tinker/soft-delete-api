# Soft delete items API

Backend interview exercise (**~30 minutes**): **TypeScript**, **Express**, **PostgreSQL**. The API compiles and runs, but several behaviors are **intentionally wrong or missing**—your job is to fix them.

## Setup

1. Start Postgres (from repo root):

   ```bash
   docker compose up -d
   ```

2. Configure env:

   ```bash
   cp .env.example .env
   ```

3. Install and prepare the database:

   ```bash
   npm install
   npm run db:reset
   ```

4. Run the server:

   ```bash
   npm start
   ```

## Take note

1. Styling and UI do not apply here—focus on HTTP behavior and SQL.
2. You **may** use documentation or search; if your process is observed, **talk through** what you are looking up and why.
3. This is **not** strictly pass/fail. We care about your **thought process**, **communication**, and **how you validate** your solution—not only the final diff.

## Requirements

1. **`DELETE /items/:id` should soft-delete**  
   Set `deleted_at` (e.g. `now()`). The row must **remain** in the table. Return **204** when an item was updated, **404** when no row exists for that id.

2. **`GET /items` should list only active items**  
   By default, **exclude** rows where `deleted_at` is set. Preserve sort order: **oldest first** (`created_at ASC`, tie-break by `id` if you like).

3. **`POST /items/:id/restore` should restore**  
   Clear `deleted_at` for that id. Return **200** with the item JSON when it becomes active again, **404** if the id does not exist, **409** if restoring would violate the **unique active name** rule (see schema).

4. **Timestamps**  
   New items already get `created_at` from the database default. Ensure list/create responses still expose `createdAt` in ISO 8601 (existing JSON shape).

## Stretch (only if you finish early)

- **`GET /items?includeDeleted=true`**: return **all** rows (deleted and active), still sorted by `created_at ASC`.

## Reference

| Method | Path | Notes |
|--------|------|--------|
| GET | `/health` | Liveness |
| GET | `/items` | List (fix default filter) |
| POST | `/items` | Body: `{ "name": "..." }` — already creates active items |
| DELETE | `/items/:id` | Should soft-delete |
| POST | `/items/:id/restore` | Should restore or 409 on name conflict |

## Schema reminder

- Partial unique index: at most **one active row per `name`** (`deleted_at IS NULL`).
- Duplicate names are allowed **among deleted** rows.

Most changes belong in `src/routes/items.ts`. You may add a small helper module if it keeps the code clear.
