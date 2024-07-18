import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import supertest from "supertest";
import app from "./app";
import { pool } from "./db";

vi.mock("./db", () => ({
  pool: {
    query: vi.fn(),
  },
}));

describe("User Route", () => {
  let request;

  beforeEach(() => {
    request = supertest(app);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should return user data when user exists", async () => {
    const mockUser = { id: 1, name: "John Doe" };
    pool.query.mockResolvedValue([[mockUser]]);

    const response = await request.get("/users/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE id = ?",
      [1],
    );
  });

  it("should return 404 when user does not exist", async () => {
    pool.query.mockResolvedValue([[]]);

    const response = await request.get("/users/2");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "User not found" });
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE id = ?",
      [2],
    );
  });

  it("should return 500 when database query fails", async () => {
    pool.query.mockRejectedValue(new Error("DB error"));

    const response = await request.get("/users/1");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Internal server error" });
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE id = ?",
      [1],
    );
  });
});
