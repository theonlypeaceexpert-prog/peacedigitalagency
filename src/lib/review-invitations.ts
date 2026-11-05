export const REVIEW_PROFILES = {
  trustpilot: "https://www.trustpilot.com/review/deepeaceagency.com",
  google: "https://share.google/Gc3flLJhLurFq0OLS",
} as const;

export const reviewInvitationMessage = `Hi! Thank you for working with DeePeace Agency. If you'd like to share your experience, please leave an honest review on either platform:

Trustpilot: ${REVIEW_PROFILES.trustpilot}
Google: ${REVIEW_PROFILES.google}

All feedback is welcome. There is no reward or requirement to leave a positive review. Thank you, Peace.`;

export const reviewHelpUrl = `https://wa.me/2347047858283?text=${encodeURIComponent("Hi Peace, I am a past client and would like the links to leave an honest review on Trustpilot or Google.")}`;
export const shareReviewInvitationUrl = `https://wa.me/?text=${encodeURIComponent(reviewInvitationMessage)}`;