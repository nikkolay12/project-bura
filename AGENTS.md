# Project Bura

- This is a 2-player, 5-card Bura game using a 36-card deck. User-facing text is primarily Georgian.
- `[M]` means mobile only. Change `mobile.css` or another mobile-only path.
- `[D]` means desktop only. Use a desktop-only rule, normally `@media (min-width: 661px)` in `styles.css`.
- `[Shared]` means both mobile and desktop.
- Keep player-visible labels in `labels.js`; preserve its editable text/style structure.
- Use existing assets from `assets/` and Lucide icons for familiar controls.

## Versioning and Publishing

- Every app code or UI change gets a new version number and cache-busted references in `index.html`; update its source-contract test too.
- State the new version number in chat after each completed app change. Documentation-only changes do not need an app version.
- Never push, publish, or deploy unless the user explicitly asks.
- When deploying from a dirty worktree, deploy an exact clean committed snapshot, not the whole working folder.

## Safety and Verification

- Never discard, reset, stage, commit, or deploy unrelated user changes. Do not delete branches or worktrees without an explicit request.
- For normal app changes, run:

  ```powershell
  node --test tests/*.test.js
  node --check app.js
  git diff --check
  ```

- Do not change online synchronization, Supabase schema, game rules, or reconnect behavior unless the task explicitly asks for it.
