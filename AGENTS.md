# Project Bura Working Guide

## Project

- This is a 2-player, 5-card Bura game with a 36-card deck.
- The game is a static web app with online play backed by Supabase. Do not change the online protocol, Supabase schema, or reconnect behavior unless the task explicitly asks for it.
- User-facing text is primarily Georgian. Keep existing Georgian copy and card terminology intact unless asked to change it.

## Layout Scope Tags

The user marks layout-specific requests with these prefixes:

- `[M]` means mobile only. Make the change in `mobile.css` or another mobile-only path. Do not change desktop behavior.
- `[D]` means desktop only. Use a desktop-only rule, normally `@media (min-width: 661px)` in `styles.css`, so mobile remains unaffected.
- `[Shared]` means both mobile and desktop.
- When no prefix is given, infer the smallest sensible scope from the request. Ask only when the scope is genuinely ambiguous.

## UI Language

- **Playing pane / central pane / mat**: the center table area where lead and answer cards appear.
- **Hand pane**: a player's area containing their cards and action buttons.
- **Score pane**: the panel beside the playing pane containing match scores, deal weight, and match target.
- The local player should always be presented as the south/bottom player from that user's perspective.
- Use Lucide icons for familiar controls. Existing examples include `ChevronRight` for going back, `RefreshCw` for lobby refresh, and `Settings` for settings.
- Preserve the established green, red, and blue theme system. A theme choice is local to that user unless the task explicitly says otherwise.

## Text, Fonts, and Assets

- Keep all player-visible labels centralized in `labels.js`; do not add hard-coded UI labels in `app.js` or HTML when a label belongs there.
- `labels.js` controls label text and label style metadata. Preserve its editable structure.
- Use existing card, ornament, font, and sound assets from `assets/`. Do not replace the established card design without an explicit request.

## Versioning

- Every app code or UI change gets a new version number and cache-busted asset references in `index.html`.
- Update the matching version expectations in `tests/source-contracts.test.js`.
- State the resulting version number in the chat after each completed change.
- Documentation-only changes do not need an app version bump unless the user asks for one.

## Git and Worktrees

- The primary worktree is `C:\Users\nikol\Documents\App\Project Bura` on `master`.
- Existing branch/worktree names can change. Inspect with `git branch` and `git worktree list` before branch operations.
- Never discard, reset, revert, stage, commit, or deploy unrelated user changes. This repository is often intentionally dirty.
- Create narrowly scoped commits for completed tasks. Leave unrelated modifications unstaged.
- Do not delete branches or worktrees without an explicit request.

## Publishing

- Never push, publish, or deploy unless the user explicitly says `publish`, `deploy`, or clearly requests an online update.
- When deploying from a dirty worktree, deploy an exact clean committed snapshot through a temporary worktree. Do not upload the whole current folder.
- Confirm the live URL serves the intended build marker after deployment.
- Current and historical Cloudflare Page URLs are technical state, not permanent instructions; record them in `CURRENT-STATE.md` when that file exists.

## Verification

- For normal changes, run:

  ```powershell
  node --test tests/*.test.js
  node --check app.js
  git diff --check
  ```

- Add focused regression coverage when changing online synchronization, deal resolution, action availability, timers, or mobile/desktop layout rules.
- If visual validation is possible, check both a mobile viewport and desktop viewport. Do not claim visual testing was done when it was not.

## Gameplay Guardrails

- Maintain 36 cards, not 49 or 52.
- Preserve the established Bura, Maliutka, claim, deal-weight increase, match, timer, rematch, dummy/bot, and reconnect rules unless the user asks to modify them.
- Online actions and timing are sensitive. Prefer small, deterministic changes and protect host/guest parity with tests.
- Do not expose hidden opponent cards or allow one client to see controls that belong only to the other player.

## Collaboration Style

- Be decisive on ordinary implementation work. Read the relevant code before editing.
- Give short progress updates before meaningful edits and during longer work.
- Keep explanations concise unless the user asks for depth.
