import { describe, it as test } from "node:test";
import assert from "node:assert/strict";
function expect(value: unknown) {
  return {
    toBe: (expected: unknown) => assert.equal(value, expected),
    toEqual: (expected: unknown) => assert.deepEqual(value, expected),
    toBeNull: () => assert.equal(value, null),
    toThrow: (message?: string) => assert.throws(value as () => unknown, message ? new RegExp(message) : undefined),
    not: { toThrow: () => assert.doesNotThrow(value as () => unknown) },
  };
}
import { canonicalUrl, completedLeadRate, coversWebsite, equivalentPrevious, percentChange, requireAdminRole, validateRange } from "./website-reporting";

describe("website reporting rules", () => {
  test("canonical page identity uses HTTPS www and excludes tracking parameters", () => {
    expect(canonicalUrl("/contact/?utm_source=google")).toBe("https://www.deepeaceagency.com/contact");
    expect(canonicalUrl("/?ref=ads")).toBe("https://www.deepeaceagency.com/");
  });
  test("only a confirmed admin may access reports", () => {
    expect(() => requireAdminRole(false)).toThrow("Administrator access required");
    expect(() => requireAdminRole(null)).toThrow();
    expect(() => requireAdminRole(undefined)).toThrow();
    expect(() => requireAdminRole(true)).not.toThrow();
  });
  test("previous comparison has the same inclusive length", () => {
    expect(equivalentPrevious({ start: "2026-10-01", end: "2026-10-07" })).toEqual({ start: "2026-09-24", end: "2026-09-30" });
  });
  test("completed lead share is defined from actual leads, not sessions", () => {
    expect(completedLeadRate(3, 12)).toBe(25);
    expect(completedLeadRate(0, 0)).toBeNull();
  });
  test("missing prior data does not invent a percentage", () => {
    expect(percentChange(20, 0)).toBeNull();
    expect(percentChange(120, 100)).toBe(20);
  });
  test("properties must actually cover the website", () => {
    expect(coversWebsite("sc-domain:deepeaceagency.com")).toBe(true);
    expect(coversWebsite("https://www.deepeaceagency.com/")).toBe(true);
    expect(coversWebsite("https://deepeaceagency.com/")).toBe(false);
    expect(coversWebsite("sc-domain:deepeaceagency.com.attacker.test")).toBe(false);
  });
  test("invalid or excessive date ranges are refused", () => {
    expect(() => validateRange({ start: "2026-02-30", end: "2026-03-01" })).toThrow();
    expect(() => validateRange({ start: "2024-01-01", end: "2026-01-01" })).toThrow();
  });
});