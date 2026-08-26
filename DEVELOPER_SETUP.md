# Developer Laptop Setup

This guide prepares a design developer to work on Project Bura from her own laptop. The shared workspace is GitHub; do not share a working folder between laptops.

## 1. Owner: Grant Only the Access Needed

1. Invite the developer to the private GitHub repository as a collaborator:

   `https://github.com/nikkolay12/project-bura`

2. Send her these links:

   - `HANDOFF.md` in the repository
   - Live app: `https://project-bura-v2124b.pages.dev`

3. Do not share Supabase service-role keys, Cloudflare API tokens, OAuth client secrets, or personal machine access. UI work does not need them.

4. Keep deployment authority with the product owner or integration reviewer. The developer should use pull requests and local previews only.

## 2. Developer: Install the Basics

Install these tools before cloning:

1. Git for Windows, GitHub Desktop, or another Git client.
2. Node.js LTS, version 20 or newer.
3. Codex desktop app, signed in with her own account.
4. A browser with responsive-device tools. Visual Studio Code is optional but useful for inspecting files.

Confirm the command-line tools work:

```powershell
git --version
node --version
```

Configure her Git identity once:

```powershell
git config --global user.name "Developer Name"
git config --global user.email "developer@example.com"
```

## 3. Clone and Verify the Project

1. In GitHub, accept the repository invitation.
2. Clone the project to a normal development folder, not a cloud-sync folder:

   ```powershell
   git clone https://github.com/nikkolay12/project-bura.git
   cd project-bura
   ```

3. Confirm the starting point:

   ```powershell
   git switch master
   git pull --ff-only origin master
   git log -1 --oneline
   ```

   The expected baseline is `v3.204` or a later approved commit on `master`.

4. Read these files before changing anything:

   - `AGENTS.md`
   - `HANDOFF.md`
   - `README.md`
   - `labels.js`
   - `labelseng.js`

## 4. Open the Project in Codex

1. In Codex, create or open a local project that points to the cloned `project-bura` folder.
2. Start a task in that project, not a projectless task.
3. Begin each task by asking Codex to read `AGENTS.md` and `HANDOFF.md`.
4. Use a dedicated Git branch for every design slice. Never work directly on `master`.

Create the first branch:

```powershell
git switch -c design/ui-audit
```

## 5. Run a Local Preview

The project has no root dependency installation step. Start its included static server:

```powershell
node preview-server.js
```

Open `http://127.0.0.1:8788/` in the browser.

Use guest play for ordinary local UI checks. Google and Facebook sign-in use the production OAuth redirect and should not be reconfigured or tested locally without an explicit authentication task.

Test these viewports before sharing visual work:

- Desktop: `1280 x 800`
- Mobile: `390 x 844`

## 6. Verify Before Every Handoff

Run:

```powershell
node --test tests/*.test.js
node --check app.js
git diff --check
git status --short
```

For UI work, also provide desktop and mobile screenshots or a short screen recording.

## 7. Share Work Through GitHub

1. Push the feature branch early:

   ```powershell
   git add <intended-files>
   git commit -m "Improve <area>"
   git push -u origin design/ui-audit
   ```

2. Open a draft pull request from the feature branch into `master`.
3. In the pull request, list:

   - The UI area changed
   - Desktop and mobile evidence
   - The verification commands run
   - Behavior intentionally left unchanged
   - Any open visual decisions for the product owner

4. Push later checkpoints to the same branch and draft pull request. This is how the owner sees every file change without needing access to the developer's laptop.

## 8. Boundaries for Design Work

Allowed without separate approval:

- Layout, spacing, typography, colors, panels, controls, and responsive behavior.
- Settings and account-pane presentation.
- Label edits through `labels.js` and `labelseng.js`.

Require a separate task and approval:

- Game rules, scoring, bot decisions, deal timing, or animations with behavioral meaning.
- Supabase schema, online synchronization, reconnect logic, OAuth, or production configuration.
- Cloudflare deployment, GitHub branch deletion, force pushes, or changes to `master`.

## 9. First-Day Deliverable

The first pull request should be a design audit, not a redesign. It should identify the five highest-impact UI improvements, show desktop and mobile evidence, and propose the smallest implementation order. No code changes are needed until the product owner selects the first item.
