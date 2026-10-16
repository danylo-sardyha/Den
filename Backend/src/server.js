import express from "express";
import pg from "pg";
import "dotenv/config";
import cors from "cors";

app.use(cors());

const { Pool } = pg;

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client:", err.stack);
  }
  client.query("SELECT NOW()", (err, result) => {
    release();
    if (err) {
      return console.error("Error executing query:", err.stack);
    }
    console.log(
      "✅ Successfully connected to PostgreSQL at:",
      result.rows[0].now,
    );
  });
});

app.get("/", (req, res) => {
  res.send("Den API is running!");
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
