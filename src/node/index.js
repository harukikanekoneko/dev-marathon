const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = 5641;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  user: "user_ha_kaneko",
  host: "localhost",
  database: "db_ha_kaneko",
  password: "5Rw5YDaWc5jc",
  port: 5432,
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${port}`);
});

/* =========================
   一覧
========================= */
app.get("/customers", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM customers ORDER BY customer_id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   詳細
========================= */
app.get("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM customers WHERE customer_id = $1",
      [id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   登録
========================= */
app.post("/add-customer", async (req, res) => {
  try {
    const { companyName, industry, contact, location } = req.body;

    const result = await pool.query(
      `INSERT INTO customers (company_name, industry, contact, location)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [companyName, industry, contact, location]
    );

    res.json({ success: true, customer: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =========================
   更新（UPDATE）
========================= */
app.put("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { company_name, industry, contact, location } = req.body;

    const result = await pool.query(
      `UPDATE customers
       SET company_name = $1,
           industry = $2,
           contact = $3,
           location = $4,
           updated_date = NOW()
       WHERE customer_id = $5
       RETURNING *`,
      [company_name, industry, contact, location, id]
    );

    res.json({ success: true, customer: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =========================
   削除
========================= */
app.delete("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM customers WHERE customer_id = $1",
      [id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});