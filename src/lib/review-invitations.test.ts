import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { REVIEW_PROFILES, reviewHelpUrl, shareReviewInvitationUrl } from "./review-invitations";

describe("past-client review invitations", () => {
  it("sends review assistance to Peace's specified WhatsApp number", () => {
    assert.equal(new URL(reviewHelpUrl).pathname, "/2347047858283");
  });
  it("shares the exact Trustpilot public profile", () => {
    assert.ok(new URL(shareReviewInvitationUrl).searchParams.get("text")?.includes("https://www.trustpilot.com/review/deepeaceagency.com"));
    assert.equal(REVIEW_PROFILES.trustpilot, "https://www.trustpilot.com/review/deepeaceagency.com");
  });
  it("shares the exact Google public profile", () => {
    assert.ok(new URL(shareReviewInvitationUrl).searchParams.get("text")?.includes("https://share.google/Gc3flLJhLurFq0OLS"));
    assert.equal(REVIEW_PROFILES.google, "https://share.google/Gc3flLJhLurFq0OLS");
  });
});