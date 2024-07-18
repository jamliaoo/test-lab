import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  vi,
} from "vitest";
import supertest from "supertest";
import app from "./app";
import { setupTestDatabase, teardownTestDatabase } from "./setup";
import * as userController from "./userController";

describe("User API", () => {
  let request;

  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(() => {
    request = supertest(app);
  });

  it("should return user data when user exists", async () => {
    const response = await request.get("/users/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: 1,
        name: "John Doe",
      }),
    );
  });

  it("should return 404 when user does not exist", async () => {
    const response = await request.get("/users/999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "User not found" });
  });

  it("should return 500 when an unexpected error occurs", async () => {
    vi.spyOn(userController, "fetchUserData").mockImplementationOnce(() => {
      throw new Error("Unexpected error");
    });

    const response = await request.get("/users/1");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Internal server error" });
  });
});
