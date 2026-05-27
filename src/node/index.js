const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = 5641;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB接続
const pool = new Pool({
  user: "user_5641",
  host: "postgres",
  database: "crm_5641",
  password: "pass_5641",
  port: 5432,
});

// 起動
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${port}`);
});

// 一覧取得
app.get("/customers", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM customers ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

// 詳細取得（今回の核心）
app.get("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM customers WHERE id = $1",
      [id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

// 登録
app.post("/add-customer", async (req, res) => {
  try {
    const { companyName, industry, contact, location } = req.body;

    const result = await pool.query(
      "INSERT INTO customers (company_name, industry, contact, location) VALUES ($1, $2, $3, $4) RETURNING *",
      [companyName, industry, contact, location]
    );

    res.json({ success: true, customer: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});
