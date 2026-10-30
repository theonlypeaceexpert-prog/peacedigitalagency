<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Website reporting
- Public page identity uses the preferred custom origin; asset delivery origins remain separate to preserve working media.
- Private analytics lives under the authenticated route layout; every reporting server function independently verifies the caller's admin role because page guards do not protect endpoints.
- Reporting settings, cached aggregate snapshots, and issue review states use admin-scoped RLS; credentials never enter report payloads.
- Search Console property selection comes from currently verified covering properties; saved snapshots are read until an explicit refresh, with no fabricated traffic or indexing verdicts.
- Lead reporting counts submissions by creation date and completed leads by current status, not historic completion events, to avoid misleading conversion claims.
