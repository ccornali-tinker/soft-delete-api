# Soft delete items API

Backend interview exercise (**~30 minutes**): **TypeScript**, **Express**, **PostgreSQL**. The API compiles and runs, but several behaviors are **intentionally wrong or missing**—your job is to fix them.

> **Most changes belong in `src/routes/items.ts`.** You may add a small helper module if it keeps the code clear.

## Setup

Prerequisites: **Docker Compose v2** (`docker compose`, not `docker-compose`). A `.nvmrc` is provided — if you use `nvm` or `fnm`, run `nvm use` / `fnm use` before installing.

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

- You ARE allowed to use google or other resources to look things up, just make sure you share your screen for that and talk through the process. AI tools are not allowed.
- This is not a PASS/FAIL coding challenge, and you don't automatically fail if you miss something or one of the points. We are reviewing your overall **thought process**, **communication**, and the way you determine a solution just as much are we are reviewing the final product.


## Requirements

1. **`DELETE /items/:id` should not destroy data**
   Deleting an item should make it disappear from normal use, but the record must be recoverable. Return an appropriate status code whether or not the item exists.

2. **`GET /items` should reflect active items only**
   The list should not include items that have been deleted. Preserve the existing sort order and response shape.

3. **`POST /items/:id/restore` should make a deleted item active again**
   Return the restored item on success, or an appropriate error if the item cannot be found or cannot be restored. Check the schema—there may be constraints worth considering.

State any assumptions you make about HTTP status codes or edge cases (e.g. delete twice, restore while a name collision exists). If something is ambiguous, pick a reasonable default and note it.

## Stretch (only if you finish early)

- **`GET /items?includeDeleted=true`**: return all rows regardless of status, in the same sort order. Think about what the response shape should look like for deleted items.

## Reference

| Method | Path | Notes |
|--------|------|--------|
| GET | `/health` | Liveness |
| GET | `/items` | List active items |
| POST | `/items` | Body: `{ "name": "..." }` — already creates active items |
| DELETE | `/items/:id` | Should soft-delete |
| POST | `/items/:id/restore` | Should restore or 409 on name conflict |

## Schema reminder

- Partial unique index: at most **one active row per `name`** (`deleted_at IS NULL`).
- Duplicate names are allowed **among deleted** rows.
