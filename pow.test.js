import { describe, expect, test, it } from "vitest";
import { pow } from "./pow";

describe("pow", () => {
  it("2 raised to power 3 is 8", () => {
    expect(pow(2, 3)).toBe(8);
  });

  it("3 raised to power 4 is 81", () => {
    expect(pow(3, 4)).toBe(81);
  });
});
