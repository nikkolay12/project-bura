# Project Bura Design Handoff

## Baseline

- Shared repository: `https://github.com/nikkolay12/project-bura`
- Baseline branch: `master`
- Baseline release: `v3.204`
- Baseline commit: `a90c30b` (`Release v3.204`)
- Live app: `https://project-bura-v2124b.pages.dev`

The design developer should begin from the latest `origin/master`, not from a copied local folder.

## Roles

- Product owner: sets priorities, approves visual direction, and authorizes releases.
- Design developer: makes UI and UX changes in a dedicated branch and submits them through a pull request.
- Integration reviewer: checks behavior, responsive layouts, labels, tests, and release readiness before merge.

## Scope

The design developer may improve:

- Layout, visual hierarchy, spacing, typography, color use, and responsiveness.
- Game panes, scoreboards, controls, settings menus, account pane, and lobby presentation.
- Existing component styling and interaction affordances.

The design developer must not change without an explicit task:

- Game rules, scoring, bot decisions, or timing behavior.
- Supabase schema, online synchronization, reconnect behavior, or OAuth flow.
- Release configuration, deployment project, or production environment.

Keep user-facing Georgian labels in `labels.js` and English labels in `labelseng.js`. Do not hardcode visible text in app code.

## Working Process

1. Clone the repository and create a branch from the current `origin/master`:

   ```powershell
   git checkout -b design/<short-feature-name> origin/master
   ```

2. Open a draft pull request immediately. Use it as the shared review space.

3. Work in small slices. One pull request should cover one coherent area, for example:

   - Top bar and navigation
   - Game board and score presentation
   - Account and settings controls
   - Mobile layout refinement

4. Push at meaningful checkpoints. The product owner can inspect the GitHub **Files changed** tab and any Cloudflare Pages preview produced for the branch.

5. Describe each pull request with:

   - The user flow improved
   - Desktop and mobile screenshots
   - Files changed
   - Behavior intentionally preserved
   - Test results

6. Do not merge into `master` or publish directly. Wait for review and explicit approval.

## Design Review Checklist

- Test desktop and mobile layouts before requesting review.
- Check `1280 x 800` desktop and `390 x 844` mobile at minimum.
- Confirm text fits, controls remain reachable, and no panels overlap incoherently.
- Use existing visual patterns: restrained panels, 8px-or-less card corners, Lucide icons for familiar actions, and no new decorative clutter.
- Preserve the current game state while restyling it. Do not replace working animations or interactions unless the task calls for it.
- Keep settings discoverable and preferences persistent where the current app already saves them locally.

## Required Checks

Run these before every pull-request handoff:

```powershell
node --test tests/*.test.js
node --check app.js
git diff --check
```

For visual changes, include screenshots or a preview URL for both required viewports.

## Release Flow

1. Reviewer approves a pull request.
2. Merge the approved branch into `master`.
3. Run the required checks again from the merge commit.
4. Create a clean, committed deployment snapshot.
5. Publish only after the product owner explicitly approves the release.
6. Verify the live page reports the new version and cache references.

## First Assignment

Start with a design audit only. List the five highest-impact UI improvements, include desktop and mobile evidence, and propose the smallest reviewable implementation order. Do not change code in this first pull request unless the product owner approves a selected item.
