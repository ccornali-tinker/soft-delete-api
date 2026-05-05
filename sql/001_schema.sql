-- Interview schema: items with soft delete.
-- At most one *active* (non-deleted) row per name — enforced in the database.

CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ NULL
);

-- Active = deleted_at IS NULL. Duplicate names allowed among deleted rows.
CREATE UNIQUE INDEX IF NOT EXISTS items_unique_name_active
  ON items (name)
  WHERE deleted_at IS NULL;
