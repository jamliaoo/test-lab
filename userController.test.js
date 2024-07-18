import { describe, it, expect, vi, beforeEach } from "vitest";
import { pool } from "./db";
import { fetchUserData } from "./userController";

vi.mock("./db", () => ({
  pool: {
    query: vi.fn(),
  },
}));

describe("fetchUserData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return user data when DB query is successful", async () => {
    const mockUser = { id: 1, name: "John Doe" };
    pool.query.mockResolvedValue([[mockUser]]);

    const result = await fetchUserData(1);

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE id = ?",
      [1],
    );
    expect(result).toEqual(mockUser);
  });

  it("should throw an error when user is not found", async () => {
    pool.query.mockResolvedValue([[]]);

    await expect(fetchUserData(1)).rejects.toThrow("User not found");
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE id = ?",
      [1],
    );
  });

  it("should throw an error when DB query fails", async () => {
    pool.query.mockRejectedValue(new Error("DB error"));

    await expect(fetchUserData(1)).rejects.toThrow("Failed to fetch user data");
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE id = ?",
      [1],
    );
  });
});
