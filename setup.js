import { pool } from "./db";

export async function setupTestDatabase() {
  await pool.query("DROP TABLE IF EXISTS users");
  await pool.query(`
    CREATE TABLE users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    )
  `);
  await pool.query(`
    INSERT INTO users (name) VALUES
    ('John Doe'),
    ('Jane Smith')
  `);
}

export async function teardownTestDatabase() {
  await pool.query("DROP TABLE IF EXISTS users");
  await pool.end();
}
