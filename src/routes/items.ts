import { Router, type Request, type Response } from "express";
import { pool } from "../db.js";
import type { ItemRow } from "../types.js";

/**
 * Interview starter: several behaviors are wrong or missing on purpose.
 * Fix them to match README.md requirements.
 */
export const itemsRouter = Router();

function rowToJson(row: ItemRow) {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at.toISOString(),
    deletedAt: row.deleted_at ? row.deleted_at.toISOString() : null,
  };
}

// BUG: returns deleted rows too — should default to active-only.
itemsRouter.get("/", async (_req: Request, res: Response) => {
  const { rows } = await pool.query<ItemRow>(
    `SELECT id, name, created_at, deleted_at FROM items ORDER BY created_at ASC`,
  );
  res.json({ items: rows.map(rowToJson) });
});

itemsRouter.post("/", async (req: Request, res: Response) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  if (!name) {
    res.status(400).json({ error: "name is required" });
    return;
  }

  try {
    const { rows } = await pool.query<ItemRow>(
      `INSERT INTO items (name) VALUES ($1)
       RETURNING id, name, created_at, deleted_at`,
      [name],
    );
    res.status(201).json(rowToJson(rows[0]!));
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === "23505") {
      res.status(409).json({ error: "An active item with this name already exists" });
      return;
    }
    throw e;
  }
});

// BUG: hard-deletes the row — should soft-delete (set deleted_at).
itemsRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const { rowCount } = await pool.query(`DELETE FROM items WHERE id = $1`, [id]);
  if (!rowCount) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.status(204).send();
});

// MISSING: implement restore (clear deleted_at), handle uniqueness conflicts.
itemsRouter.post("/:id/restore", async (_req: Request, res: Response) => {
  res.status(501).json({ error: "Not implemented" });
});
