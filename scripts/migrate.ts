import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import "dotenv/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set. Copy .env.example to .env");
    process.exit(1);
  }

  const sqlDir = path.join(__dirname, "..", "sql");
  const files = fs
    .readdirSync(sqlDir)
    .filter((f) => f.endsWith(".sql") && !f.toLowerCase().includes("seed"))
    .sort();

  const client = new pg.Client({ connectionString: url });
  await client.connect();

  for (const file of files) {
    const full = path.join(sqlDir, file);
    const sql = fs.readFileSync(full, "utf8");
    console.log("Running", file);
    await client.query(sql);
  }

  await client.end();
  console.log("Migrations done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
