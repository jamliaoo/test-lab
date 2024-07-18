import { pool } from "./db";

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.message = message;
  }
}

export async function fetchUserData(userId) {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);
    if (rows.length === 0) {
      throw new NotFoundError("User not found");
    }
    return rows[0];
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new Error("Failed to fetch user data");
  }
}
