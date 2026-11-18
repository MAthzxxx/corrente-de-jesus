import { describe, it, expect } from "vitest";
import { calcPeriod } from "./time-calc";

describe("calculadora de tempo", () => {
  it("1 mês = 30 atividades, 5h, 30 histórias", () => {
    expect(calcPeriod(30)).toEqual({ activities: 30, hours: "5h", stories: 30 });
  });
  it("1 semana = 1h10", () => {
    expect(calcPeriod(7).hours).toBe("1h10");
  });
});
