const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("browser bundle identifies the mobile worktree build and pins dependencies", () => {
  const html = read("index.html");
  assert.match(html, /mobile-mobile v2\.159/);
  assert.match(html, /styles\.css\?v=2\.159-mobile\.1/);
  assert.match(html, /mobile\.css\?v=2\.159-mobile\.1" media="\(max-width: 660px\)"/);
  assert.match(html, /app\.js\?v=2\.159-mobile\.1/);
  assert.match(html, /@supabase\/supabase-js@2\.112\.3/);
  assert.match(html, /sync-core\.js\?v=2\.159-mobile\.1/);
  assert.match(html, /bot-rules\.js\?v=2\.159-mobile\.1/);
});

test("mobile layout keeps the board touch-friendly without desktop overrides", () => {
  const css = read("mobile.css");
  const sharedCss = read("styles.css");
  const app = read("app.js");
  assert.doesNotMatch(sharedCss, /@media \(max-width: 660px\)/);
  assert.match(css, /Mobile control sheet/);
  assert.match(css, /--mobile-main-pane-padding: 16px;/);
  assert.doesNotMatch(css, /--mobile-[\w-]*font-size/);
  assert.match(css, /\.primary-button\s*\{\s*font-size: 1rem;/);
  assert.match(css, /\.online-status\s*\{\s*font-size: 0\.7rem;/);
  assert.match(css, /\.join-button\s*\{[\s\S]*?font-size: 0\.62rem;/);
  assert.match(css, /body:has\(#setup-panel:not\(\[hidden\]\)\)\s*\{\s*height: 100dvh;\s*overflow: hidden;/);
  assert.match(css, /#setup-panel:not\(\[hidden\]\)\s*\{[\s\S]*?grid-template-rows: auto auto auto auto auto minmax\(0, 1fr\);[\s\S]*?overflow: hidden;/);
  assert.match(css, /#setup-panel:not\(\[hidden\]\)\s*\{[\s\S]*?display: grid;/);
  assert.doesNotMatch(css, /#setup-panel\s*\{\s*min-height: 0;\s*height: 100%;\s*display: grid;/);
  assert.match(css, /\.lobby-list\s*\{[\s\S]*?overflow-y: auto;/);
  assert.match(css, /\.table-zone\s*\{\s*display: contents;/);
  assert.match(css, /\.game-panel:not\(\[hidden\]\)\s*\{[\s\S]*?grid-template-areas:\s*"score"\s*"opponent"\s*"trick"\s*"trump"\s*"current"/);
  assert.doesNotMatch(css, /\.game-panel\s*\{\s*display: grid;/);
  assert.match(css, /\.match-score-stack\s*\{[\s\S]*?grid-template-areas: "north middle south"/);
  assert.match(css, /\.match-score-heading\s*\{[\s\S]*?grid-column: 1 \/ -1;[\s\S]*?grid-row: 1;/);
  assert.match(css, /\.match-score-player\s*\{[\s\S]*?grid-template-columns: auto minmax\(0, 1fr\);/);
  assert.match(css, /\.match-score-track\s*\{[\s\S]*?grid-column: 2;[\s\S]*?grid-row: 2;[\s\S]*?width: 100%;/);
  assert.match(css, /\.playing-card \.card-image\s*\{\s*object-fit: contain;/);
  assert.match(css, /\.playing-card\s*\{[\s\S]*?overflow: hidden;[\s\S]*?border-radius: 6\.667% \/ 4\.762%;/);
  assert.match(read("index.html"), /id="mobile-trump-card"/);
  assert.match(app, /mobileTrumpCard: document\.querySelector\("#mobile-trump-card"\)/);
  assert.match(app, /elements\.mobileTrumpCard\.innerHTML = trumpCardMarkup;/);
  assert.match(css, /\.stock-panel\s*\{\s*display: none;/);
  assert.match(css, /\.mobile-trump-slot\s*\{[\s\S]*?left: 0;[\s\S]*?overflow: hidden;/);
  assert.match(css, /\.mobile-trump-slot \.playing-card\.trump-display-card\s*\{[\s\S]*?transform: rotate\(90deg\);/);
  assert.match(css, /\.opponent-lane \.lane-heading-main h2,\s*\.current-lane \.lane-heading-main h2\s*\{\s*font-size: 1rem;/);
  assert.match(css, /\.match-deal-info span\s*\{[\s\S]*?font-size: 0\.486rem;/);
  assert.match(css, /\.trick-panel\s*\{[\s\S]*?padding: 7px;/);
  assert.doesNotMatch(css, /\.trick-panel \.played-row\s*\{[\s\S]*?transform: translateX/);
  assert.match(css, /\.turn-timer\s*\{\s*left: calc\(50% \+ 55px\);/);
  assert.match(css, /\.mobile-trump-slot \.playing-card\.trump-display-card\s*\{[\s\S]*?filter: brightness\(0\.78\) saturate\(0\.78\);[\s\S]*?opacity: 0\.66;/);
  assert.match(css, /\.mobile-stock-count\s*\{[\s\S]*?font-weight: 400;/);
  assert.match(css, /\.match-panel:has\(\.match-deal-result\)\s*\{\s*margin-bottom: 62px;/);
  assert.match(css, /\.match-score-south\s*\{[\s\S]*?position: static;/);
  assert.match(css, /\.match-deal-result\s*\{[\s\S]*?position: absolute;[\s\S]*?top: calc\(100% \+ 5px\);/);
  assert.match(css, /\.match-score-middle\s*\{[\s\S]*?position: static;/);
  assert.match(css, /\.match-captured-score\s*\{[\s\S]*?position: absolute;[\s\S]*?top: calc\(100% \+ 24px\);[\s\S]*?font-size: 2rem;/);
  assert.match(css, /\.current-lane \.hand-row\s*\{[\s\S]*?justify-content: flex-start;/);
  assert.match(css, /\.current-lane \.hand-row:has\(\.playing-card:nth-child\(5\)\)\s*\{\s*justify-content: space-between;/);
  assert.match(css, /\.room-code-entry\s*\{\s*grid-template-columns: minmax\(0, 1fr\) 6\.4rem;/);
  assert.match(css, /\.room-code-entry\s*\{[\s\S]*?margin-top: 3px;/);
  assert.doesNotMatch(css, /\.setup-online-grid:has\(\.online-fields\[hidden\]\)\s*\{/);
  assert.match(css, /\.lobby-refresh-button\s*\{[\s\S]*?display: grid;[\s\S]*?place-items: center;/);
  assert.match(app, /elements\.mobileStockCount\.textContent = `\$\{stockCount\}-ში`;/);
  assert.match(css, /\.opponent-lane\s*\{\s*grid-area: opponent;\s*min-height: 44px;\s*padding: 4px 7px;/);
  assert.match(css, /\.hand-controls-row\s*\{[\s\S]*?align-items: stretch;[\s\S]*?flex-direction: column;/);
  assert.match(css, /\.current-lane \.hand-row\s*\{[\s\S]*?justify-content: space-between;/);
  assert.match(css, /\.current-lane \.playing-card\s*\{[\s\S]*?calc\(\(100% - 16px\) \/ 5\)/);
  assert.match(css, /\.match-deal-info span\s*\{[\s\S]*?overflow-wrap: anywhere;/);
  assert.match(css, /\.trick-panel \.playing-card \+ \.playing-card\s*\{[\s\S]*?margin-left: clamp\(-38px, -9vw, -26px\);/);
  assert.match(css, /height: clamp\(212px, 30svh, 252px\)/);
  assert.match(app, /<source media="\(max-width: 660px\)" srcset="\$\{mobileCardAssetPath\(card\)\}" type="image\/svg\+xml">/);
  assert.match(app, /assets\/cards\/mobile\/\$\{card\.suit\}-\$\{card\.rank\.toLowerCase\(\)\}\.svg/);
  assert.match(css, /touch-action: manipulation/);
  assert.match(css, /@media \(max-width: 390px\)/);
  assert.match(css, /@media \(max-width: 390px\)\s*\{[\s\S]*?\.room-code-entry\s*\{\s*grid-template-columns: minmax\(0, 1fr\) 6\.2rem;\s*gap: 0\.4rem;/);
  assert.match(css, /@media \(max-width: 390px\)\s*\{[\s\S]*?\.join-button\s*\{\s*width: auto;\s*min-width: 0;/);

  const mobileCardFiles = fs.readdirSync(path.join(root, "assets", "cards", "mobile"));
  assert.equal(mobileCardFiles.filter((file) => file.endsWith(".svg")).length, 36);
  assert.equal(mobileCardFiles.filter((file) => file.endsWith(".png")).length, 0);
});

test("online client uses token-checked RPCs instead of direct game tables", () => {
  const app = read("app.js");
  assert.doesNotMatch(app, /\.from\(["']bura_(?:rooms|room_actions)["']\)/);
  for (const rpc of ["bura_create_room", "bura_join_room", "bura_get_room", "bura_submit_action", "bura_fetch_actions"]) {
    assert.match(app, new RegExp(`\\b${rpc}\\b`));
  }
  assert.doesNotMatch(app, /emitOnlineAction\(["']request["']/);
  assert.match(app, /state\.onlineRole !== "host" && nextRoom\.game_state\s*\n\s*&& !checkpointIsStale/);
  assert.match(app, /SYNC_CORE\.hasSequenceGap/);
  assert.match(app, /SYNC_CORE\.isCheckpointStale/);
  assert.match(app, /SYNC_CORE\.isCheckpointAhead/);
  assert.match(app, /SYNC_CORE\.isCheckpointRevisionNewer/);
  assert.match(app, /eventSequence <= state\.eventSequence/);
  assert.match(app, /eventSequence: onlineLastEventSequence \+ 1/);
  assert.match(app, /startOnlineConsistencySync\(\)/);
  assert.match(app, /ONLINE_CONSISTENCY_SYNC_INTERVAL_MS = 1500/);
  assert.match(app, /LOBBY_REFRESH_INTERVAL_MS = 15000/);
  assert.match(app, /TURN_RESERVE_MS = 60 \* 1000/);
  assert.doesNotMatch(app, /function shouldReconcileActiveOnlineGame\(\)/);
  assert.match(app, /compact action stream is the normal safety net/);
  assert.match(app, /await recoverOnlineState\(\{ forceCheckpoint: true, deferActionReplay: true \}\)/);
  assert.match(app, /function applyOnlineState\(remoteState, roomRevision = onlineLatestRevision, options = \{\}\)/);
  assert.match(app, /hostedRoomAccess\(room\.id\)/);
  assert.match(app, /pollJoinedHostedRooms\(\)/);
  assert.match(app, /extendLead: Boolean\(action\.extendLead\) \|\| getLeadActivityKey\(state\) !== onlineLastLeadActivityKey/);
  assert.match(app, /\/\/ Room action sequences are monotonic across rematches\. The fresh match\s*\n\s*\/\/ begins from this cursor so both clients accept its first lead\.\s*\n\s*eventSequence: onlineLastEventSequence,/);
});

test("the setup screen separates room creation from joining by code", () => {
  const app = read("app.js");
  const html = read("index.html");
  assert.match(app, /async function startGame\(\) \{[\s\S]*?await createOnlineRoom\(\);/);
  assert.match(app, /elements\.joinButton\?\.addEventListener\("click", \(\) => \{\s*void joinOnlineRoom\(\);/);
  assert.match(html, /id="join-button"/);
  assert.match(html, /class="room-code-entry"/);
});

test("online pending actions keep controls visible and disabled", () => {
  const app = read("app.js");
  assert.doesNotMatch(app, /if \(state\.actionPending\) \{\s*elements\.actionButtons\.innerHTML = ""/);
  assert.match(app, /button\.setAttribute\("aria-busy", "true"\)/);
  assert.match(app, /cardIds: compactCards\(cards\)/);
  assert.match(app, /const confirmedIds = compactCards\(playedCards\)/);
  assert.match(app, /clearPendingOnlineAction\(\);\s*\n\s*onlinePendingSelection = null;\s*\n\s*onlinePendingPlay = null;\s*\n\s*state\.actionPending = false;\s*\n\s*render\(\);/);
});

test("the host owns delayed online phase completion", () => {
  const app = read("app.js");
  assert.match(app, /if \(!onlineEnabled\(\) \|\| state\.onlineRole === "host"\) \{/);
  assert.match(app, /finishOnlineAutomaticTrickPause/);
  assert.match(app, /await onlineEventQueue/);
});

test("the table only shows a completed trick during its review phase", () => {
  const app = read("app.js");
  assert.match(app, /const canShowCurrentTrick = \["answer", "trickPause", "offerPending", "buraReveal", "maliutkaPending"\]\.includes\(state\.phase\)/);
  assert.match(app, /const isReviewingTrick = state\.phase === "trickPause" && Boolean\(state\.lastTrick\)/);
  assert.match(app, /state\.phase === "trickPause"\s*\|\|\s*!\["lead", "answer"\]\.includes\(state\.phase\)/);
  assert.match(app, /function clearResolvedTrickPresentation\(\)/);
  assert.match(app, /clearResolvedTrickPresentation\(\);\s*\n\s*refillHands/);
  assert.match(app, /function startNextDeal\(previousWinner\) \{\s*\n\s*clearMatchSummaryTimers\(\);\s*\n\s*clearOpeningTurnSignal\(\);\s*\n\s*clearResolvedTrickPresentation\(\);/);
});

test("Maliutka waits for its winner unless the deal is exhausted", () => {
  const app = read("app.js");
  const maliutka = app.slice(app.indexOf("function resolveMaliutka()"), app.indexOf("function finishByCards()"));
  assert.match(maliutka, /state\.claimAvailableFor = winnerIndex/);
  assert.match(maliutka, /if \(isDealExhausted\(\) \|\| \(state\.dummyOpponent && winnerIndex === 1\)\)/);
  assert.match(maliutka, /finishOnlineAutomaticTrickPause\(winnerIndex\)/);
});

test("dummy opponent uses card memory for offers, claims, and legal card choices", () => {
  const app = read("app.js");
  assert.match(app, /function makeDummyCardMemory\(playerIndex = DUMMY_PLAYER_INDEX\)/);
  assert.match(app, /const unseenTrumps = unseenCards\.filter/);
  assert.match(app, /const unseenHighCards = unseenCards\.filter/);
  assert.match(app, /function chooseDummyLeadCards/);
  assert.match(app, /function isSafeDummyPairLead/);
  assert.match(app, /function isPreferredDummyMultiLead/);
  assert.match(app, /function isStrongDummyFourCardLead/);
  assert.match(app, /function dummyMultiLeadBonus/);
  assert.match(app, /DUMMY_TUNING\.safePair\?\.scoreBonus/);
  assert.match(app, /function chooseDummyAnswerCards/);
  assert.match(app, /function shouldDummyOfferIncrease/);
  assert.match(app, /function shouldDummyAcceptIncrease/);
  assert.match(app, /function shouldDummyDeclareMaliutka/);
  assert.match(app, /state\.phase === "trickPause"[\s\S]*claimPoints\(playerIndex\)[\s\S]*continueTurn\(playerIndex\)/);
});

test("bot rules and tuning are editable in one dedicated file", () => {
  const rules = read("bot-rules.js");
  assert.match(rules, /window\.BURA_BOT_RULES/);
  assert.match(rules, /leading:/);
  assert.match(rules, /safePair:/);
  assert.match(rules, /multiLead:/);
  assert.match(rules, /fourCardLead:/);
  assert.match(rules, /scoreBonus: 18/);
});

test("the game title remains visible in the game view", () => {
  const app = read("app.js");
  const css = read("styles.css");
  assert.match(app, /brandHeading\.classList\.add\("in-game"\)/);
  assert.doesNotMatch(css, /\.brand-heading\.in-game \.brand-meta/);
  assert.doesNotMatch(css, /\.brand-heading\.in-game h1/);
});

test("service worker pre-caches ordinary sounds and warms result sounds after setup", () => {
  const worker = read("service-worker.js");
  const app = read("app.js");
  assert.match(worker, /\.\/assets\/cards\//);
  assert.match(worker, /\.\/assets\/cards\/mobile\/\$\{suit\}-\$\{rank\}\.svg/);
  assert.doesNotMatch(worker, /\.\/assets\/cards\/mobile\/\$\{suit\}-\$\{rank\}\.png/);
  assert.match(worker, /\.\/assets\/fonts\//);
  assert.match(worker, /\.\/assets\/design\//);
  assert.match(worker, /cache\.addAll\(PRECACHE_FILES\)/);
  assert.match(worker, /CACHE_BACKGROUND_SOUNDS/);
  assert.match(app, /showSetup\(\);\s*\n\s*function warmBackgroundSounds/);
  assert.match(app, /requestIdleCallback/);

  const context = { self: { addEventListener() {} } };
  vm.runInNewContext(`${worker}\nglobalThis.__precacheFiles = PRECACHE_FILES; globalThis.__backgroundSoundFiles = BACKGROUND_SOUND_FILES;`, context);
  const cachedAssets = new Set(context.__precacheFiles.filter((file) => file.startsWith("./assets/")));
  const backgroundSounds = new Set(context.__backgroundSoundFiles);
  const allAssets = fs.readdirSync(path.join(root, "assets"), { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.relative(root, path.join(entry.parentPath, entry.name)).replaceAll("\\", "/"))
    .map((file) => encodeURI(`./${file}`));
  const expectedBackgroundSounds = [
    "./assets/sound/matchwon.wav",
    "./assets/sound/matchlost.wav",
    "./assets/sound/pointsup.wav",
    "./assets/sound/pointsdown.wav",
    "./assets/sound/dealwin.mp3"
  ];
  const expectedPrecacheAssets = allAssets.filter((file) => !backgroundSounds.has(file));

  assert.deepEqual([...backgroundSounds].sort(), expectedBackgroundSounds.sort());
  assert.deepEqual([...cachedAssets].sort(), expectedPrecacheAssets.sort());
});

test("database protocol includes idempotency, per-room ordering, and participant policies", () => {
  const protocol = read("supabase-v2.125-additive.sql");
  const policies = read("supabase-v2.125-lockdown.sql");
  assert.match(protocol, /bura_room_actions_idempotency_idx/);
  assert.match(protocol, /room_sequence/);
  assert.match(protocol, /bura_server_time/);
  assert.match(protocol, /room\.protocol_version = 2/);
  assert.match(policies, /using \(protocol_version = 1\)/);
  assert.match(policies, /revoke execute on function public\.broadcast_bura_action/);
});

test("the pre-game brand cannot occupy game layout while hidden", () => {
  assert.match(read("styles.css"), /\.brand-heading\[hidden\]\s*\{\s*display:\s*none;/);
});
