import { useState } from "react";
import { Check, Copy, ExternalLink, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { REVIEW_PROFILES, reviewHelpUrl, reviewInvitationMessage, shareReviewInvitationUrl } from "@/lib/review-invitations";

export function ReviewInvitation() {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  async function copyInvitation() {
    try {
      await navigator.clipboard.writeText(reviewInvitationMessage);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  }
  return (
    <section className="border-y border-border bg-secondary/30" aria-labelledby="review-invitation-heading">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">For past clients</p>
          <h2 id="review-invitation-heading" className="mt-3 font-display text-3xl font-bold sm:text-4xl">Your experience matters.</h2>
          <p className="mt-4 max-w-lg text-muted-foreground">Worked with DeePeace Agency? Share your honest experience on Trustpilot or Google to help other business owners make an informed choice. All feedback is welcome.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg"><a href={reviewHelpUrl} target="_blank" rel="noopener noreferrer"><MessageCircle /> Get review links on WhatsApp</a></Button>
            <Button asChild variant="outline"><a href={REVIEW_PROFILES.trustpilot} target="_blank" rel="noopener noreferrer">Review on Trustpilot <ExternalLink /></a></Button>
            <Button asChild variant="outline"><a href={REVIEW_PROFILES.google} target="_blank" rel="noopener noreferrer">Review on Google <ExternalLink /></a></Button>
          </div>
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold">An invitation to share</h3>
          <p className="mt-2 text-sm text-muted-foreground">A ready-to-send message for past clients. No incentives, no pressure—just genuine feedback.</p>
          <blockquote className="mt-4 whitespace-pre-line break-words border-l-2 border-accent pl-5 text-sm leading-relaxed text-muted-foreground">{reviewInvitationMessage}</blockquote>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild variant="secondary"><a href={shareReviewInvitationUrl} target="_blank" rel="noopener noreferrer"><Send /> Share invitation on WhatsApp</a></Button>
            <Button variant="outline" onClick={copyInvitation}>{copied ? <Check /> : <Copy />}{copied ? "Copied" : "Copy invitation"}</Button>
          </div>
          <p role="status" className="mt-2 text-sm text-muted-foreground">{copyError ? "Copy unavailable. Use Share invitation on WhatsApp instead." : copied ? "Invitation copied." : ""}</p>
        </div>
      </div>
    </section>
  );
}