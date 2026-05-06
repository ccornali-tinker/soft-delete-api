import "dotenv/config";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { pool } from "./db.js";
import { itemsRouter } from "./routes/items.js";
import { spec } from "./openapi.js";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/items", itemsRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

process.on("SIGINT", async () => {
  await pool.end();
  process.exit(0);
});
