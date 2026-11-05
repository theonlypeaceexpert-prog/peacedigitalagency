import { describe, expect, it } from "vitest";
import { REVIEW_PROFILES, reviewHelpUrl, shareReviewInvitationUrl } from "./review-invitations";

describe("past-client review invitations", () => {
  it("sends review assistance to Peace's specified WhatsApp number", () => {
    expect(new URL(reviewHelpUrl).pathname).toBe("/2347047858283");
  });
  it("shares the exact Trustpilot public profile", () => {
    expect(new URL(shareReviewInvitationUrl).searchParams.get("text")).toContain("https://www.trustpilot.com/review/deepeaceagency.com");
    expect(REVIEW_PROFILES.trustpilot).toBe("https://www.trustpilot.com/review/deepeaceagency.com");
  });
  it("shares the exact Google public profile", () => {
    expect(new URL(shareReviewInvitationUrl).searchParams.get("text")).toContain("https://share.google/Gc3flLJhLurFq0OLS");
    expect(REVIEW_PROFILES.google).toBe("https://share.google/Gc3flLJhLurFq0OLS");
  });
});