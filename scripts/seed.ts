import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import "dotenv/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }

  const sqlPath = path.join(__dirname, "..", "sql", "002_seed.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");

  const client = new pg.Client({ connectionString: url });
  await client.connect();
  console.log("Seeding…");
  await client.query(sql);
  await client.end();
  console.log("Seed done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
