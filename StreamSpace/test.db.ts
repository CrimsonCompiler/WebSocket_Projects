import pool from "./src/config/db.js";

async function testDB() {
  try {
    const result = await pool.query(
      "SELECT NOW() as current_time, version() as version",
    );
    console.log("✅ Database connection successful!");
    console.log("Current time:", result.rows[0].current_time);
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    await pool.end();
    process.exit(1);
  }
}

testDB();
