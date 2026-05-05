-- Seed data for local dev / interview. Timestamps are fixed for predictable demos.

TRUNCATE TABLE items;

INSERT INTO items (id, name, created_at, deleted_at) VALUES
  ('11111111-1111-1111-1111-111111111101', 'Alpha', '2025-01-10T10:00:00Z', NULL),
  ('11111111-1111-1111-1111-111111111102', 'Bravo', '2025-01-11T12:00:00Z', NULL),
  ('11111111-1111-1111-1111-111111111103', 'Charlie', '2025-01-12T09:30:00Z', '2025-01-13T15:00:00Z');
