const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("browser bundle uses the bot-botdev v2.158b build and pinned dependencies", () => {
  const html = read("index.html");
  assert.match(html, /bot-botdev v2\.158b/);
  assert.match(html, /@supabase\/supabase-js@2\.112\.3/);
  assert.match(html, /sync-core\.js\?v=bot-botdev-v2\.158b\.1/);
  assert.match(html, /bot-rules\.js\?v=bot-botdev-v2\.158b\.1/);
});

test("mobile layout keeps the board touch-friendly without desktop overrides", () => {
  const css = read("styles.css");
  assert.match(css, /@media \(max-width: 660px\)/);
  assert.match(css, /grid-template-areas:\s*"trick score"\s*"trump score"/);
  assert.match(css, /touch-action: manipulation/);
  assert.match(css, /@media \(max-width: 390px\)/);
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
  assert.match(app, /normalizedRemoteState\.lastTrick\?\.leadPlayer === onlinePendingPlay\.playerIndex/);
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
  assert.match(app, /const isReviewingTrick = state\.phase === "trickPause" && Boolean\(state\.lastTrick\)/);
  assert.match(app, /const canShowCurrentTrick = !isReviewingTrick\s*\n\s*&& \["answer", "offerPending", "buraReveal", "maliutkaPending"\]\.includes\(state\.phase\)/);
  assert.match(app, /state\.phase === "trickPause"\s*\|\|\s*!\["lead", "answer"\]\.includes\(state\.phase\)/);
  assert.match(app, /function clearResolvedTrickPresentation\(\)/);
  assert.match(app, /clearResolvedTrickPresentation\(\);\s*\n\s*refillHands/);
  assert.match(app, /function startNextDeal\(previousWinner\) \{\s*\n\s*clearMatchSummaryTimers\(\);\s*\n\s*clearOpeningTurnSignal\(\);\s*\n\s*clearDummyFinalChoice\(\);\s*\n\s*clearResolvedTrickPresentation\(\);/);
});

test("Maliutka only auto-clears after an exhausted deal", () => {
  const app = read("app.js");
  const maliutka = app.slice(app.indexOf("function resolveMaliutka()"), app.indexOf("function finishByCards()"));
  assert.match(maliutka, /state\.claimAvailableFor = winnerIndex/);
  assert.match(maliutka, /if \(isDealExhausted\(\)\)/);
  assert.doesNotMatch(maliutka, /state\.dummyOpponent && winnerIndex === 1/);
  assert.match(maliutka, /finishOnlineAutomaticTrickPause\(winnerIndex\)/);
});

test("a dummy winner has one continuation path", () => {
  const app = read("app.js");
  const resolver = app.slice(app.indexOf("function resolveTrick()"), app.indexOf("function finishTrickPause("));
  assert.match(resolver, /if \(isDealExhausted\(\)\)/);
  assert.doesNotMatch(resolver, /state\.dummyOpponent && winnerIndex === 1/);
  assert.match(app, /state\.phase === "trickPause"[\s\S]*continueTurn\(playerIndex\)/);
});

test("dummy opponent uses card memory for offers, claims, and legal card choices", () => {
  const app = read("app.js");
  assert.match(app, /DUMMY_ACTION_EXTRA_DELAY_MS = 300/);
  assert.match(app, /function makeDummyCardMemory\(playerIndex = DUMMY_PLAYER_INDEX\)/);
  assert.match(app, /const unseenTrumps = unseenCards\.filter/);
  assert.match(app, /const unseenHighCards = unseenCards\.filter/);
  assert.match(app, /function chooseDummyLeadCards/);
  assert.match(app, /function isSafeDummyPairLead/);
  assert.match(app, /function isPreferredDummyMultiLead/);
  assert.match(app, /function isStrongDummyFourCardLead/);
  assert.match(app, /function dummyMultiLeadBonus/);
  assert.match(app, /function shouldAvoidSingleTrumpLead/);
  assert.match(app, /function dummyTrumpLeadAdjustment/);
  assert.match(app, /DUMMY_TUNING\.safePair\?\.scoreBonus/);
  assert.match(app, /function chooseDummyAnswerCards/);
  assert.match(app, /function shouldDummyOfferIncrease/);
  assert.match(app, /function shouldDummyAcceptIncrease/);
  assert.match(app, /function shouldDummyDeclareMaliutka/);
  assert.match(app, /function scheduleDummyCardPlay/);
  assert.match(app, /function playCardsByIds\(playerIndex, cardIds\)/);
  assert.match(app, /scheduleAction\(action, null, MOVE_DELAY_MS \+ DUMMY_ACTION_EXTRA_DELAY_MS\)/);
  assert.match(app, /phase: state\.phase/);
  assert.match(app, /return playCardsByIds\(choice\.playerIndex, choice\.cardIds\)/);
  assert.match(app, /state\.phase === "trickPause"[\s\S]*claimPoints\(playerIndex\)[\s\S]*continueTurn\(playerIndex\)/);
});

test("dummy card plays are applied by exact stored ids instead of shared selection", () => {
  const app = read("app.js");
  const dummyPlay = app.slice(app.indexOf("function scheduleDummyCardPlay"), app.indexOf("function scheduleDummyTurn"));
  assert.doesNotMatch(dummyPlay, /state\.selectedIds = \[\.\.\.selectedIds\]/);
  assert.doesNotMatch(dummyPlay, /playSelectedCards\(playerIndex\)/);
  assert.match(dummyPlay, /const finalChoice = Object\.freeze\(\{/);
  assert.match(dummyPlay, /cardIds: Object\.freeze\(cards\.map\(\(card\) => card\.id\)\)/);
  assert.match(dummyPlay, /dummyFinalChoice = finalChoice;/);
  assert.match(dummyPlay, /const choice = dummyFinalChoice;/);
  assert.match(dummyPlay, /if \(choice !== finalChoice/);
  assert.match(dummyPlay, /return playCardsByIds\(choice\.playerIndex, choice\.cardIds\);/);
  assert.doesNotMatch(dummyPlay, /hand\.slice\(0, needed\)/);
  assert.match(app, /function clearDummyFinalChoice\(\)/);
  assert.match(app, /const cardsById = new Map\(player\.hand\.map\(\(card\) => \[card\.id, card\]\)\)/);
  assert.match(app, /const removed = cardIds\.map\(\(id\) => cardsById\.get\(id\)\)\.filter\(Boolean\)/);
  assert.match(app, /applied = playCardsByIds\(playerIndex, cardIds\)/);
});

test("table rows are keyed by player and expose live card ownership counts", () => {
  const app = read("app.js");
  const css = read("styles.css");
  assert.match(app, /function cardOwnershipCounts\(\)/);
  assert.match(app, /const cardIds = new Set\(\);/);
  assert.match(app, /const unresolvedTrick = state\.phase === "trickPause" \? null : state\.trick;/);
  assert.match(app, /const review = state\.phase === "trickPause" && state\.lastTrick/);
  assert.match(app, /total: cardIds\.size/);
  assert.match(app, /if \(state\.dummyOpponent\) return playerIndex === state\.localPlayerIndex \? "Player" : "Bot";/);
  assert.match(app, /const capturedAudit = \(playerIndex\) => \{/);
  assert.match(app, /const capturedIds = player\.captured\.map\(\(card\) => card\.id\)\.join\(" "\) \|\| "-";/);
  assert.match(app, /Captured cards and scores/);
  assert.match(app, /Total <strong>\$\{cardCounts\.total\}<\/strong>/);
  assert.match(app, /renderPlayerPane\(elements\.playerOneRow, cardsForPlayer\(bottomPlayerIndex\), roleForPlayer\(bottomPlayerIndex\), bottomPlayerIndex\)/);
  assert.match(app, /renderPlayerPane\(elements\.playerTwoRow, cardsForPlayer\(topPlayerIndex\), roleForPlayer\(topPlayerIndex\), topPlayerIndex\)/);
  assert.match(app, /const cardsKey = `\$\{playerIndex\}:\$\{cardIdsKey\}`/);
  assert.match(app, /element\.dataset\.playerIndex = String\(playerIndex\)/);
  assert.match(app, /renderCard\(card, \{ entering: animateCards, table: true \}\)/);
  assert.match(app, /element\.dataset\.playerIndex = ""/);
  assert.match(css, /\.match-card-counts \{/);
  assert.match(css, /\.match-capture-audit \{/);
});

function countCardsForTest(state) {
  const app = read("app.js");
  const isPlayerIndex = app.slice(app.indexOf("function isPlayerIndex"), app.indexOf("function cardCombinations"));
  const counter = app.slice(app.indexOf("function cardOwnershipCounts"), app.indexOf("function renderMatchPanel"));
  const sandbox = { state };
  vm.runInNewContext(`${isPlayerIndex}\n${counter}\nresult = cardOwnershipCounts();`, sandbox);
  return JSON.parse(JSON.stringify(sandbox.result));
}

test("card counter uses the canonical locations through lead, review, and refill", () => {
  const cards = Array.from({ length: 36 }, (_, index) => ({ id: `card-${index}` }));
  const createState = (phase, playerOne, playerTwo, stock, trick, lastTrick = null) => ({
    phase,
    players: [
      { hand: playerOne.hand, captured: playerOne.captured },
      { hand: playerTwo.hand, captured: playerTwo.captured }
    ],
    stock,
    trick,
    lastTrick
  });
  const unresolved = countCardsForTest(createState(
    "answer",
    { hand: cards.slice(1, 5), captured: [] },
    { hand: cards.slice(5, 10), captured: [] },
    cards.slice(10),
    { leadCards: [cards[0]], answerCards: [] }
  ));
  assert.deepEqual({ ...unresolved }, { players: [4, 5], stock: 26, table: 1, review: 0, total: 36 });

  const resolvedTrick = { leadCards: [cards[0]], answerCards: [cards[5]] };
  const review = countCardsForTest(createState(
    "trickPause",
    { hand: cards.slice(1, 5), captured: [cards[0], cards[5]] },
    { hand: cards.slice(6, 10), captured: [] },
    cards.slice(10),
    resolvedTrick,
    resolvedTrick
  ));
  assert.deepEqual({ ...review }, { players: [6, 4], stock: 26, table: 0, review: 2, total: 36 });

  const refilled = countCardsForTest(createState(
    "lead",
    { hand: [...cards.slice(1, 5), cards[10]], captured: [cards[0], cards[5]] },
    { hand: [...cards.slice(6, 10), cards[11]], captured: [] },
    cards.slice(12),
    { leadCards: [], answerCards: [] }
  ));
  assert.deepEqual({ ...refilled }, { players: [7, 5], stock: 24, table: 0, review: 0, total: 36 });

  const duplicated = countCardsForTest(createState(
    "answer",
    { hand: cards.slice(1, 5), captured: [] },
    { hand: cards.slice(5, 10), captured: [] },
    [...cards.slice(10, 35), cards[0]],
    { leadCards: [cards[0]], answerCards: [] }
  ));
  assert.equal(duplicated.total, 35);
});

test("a lead always requires cards for the opponent to answer", () => {
  const app = read("app.js");
  assert.match(app, /if \(!cards\.length \|\| cards\.length > otherPlayer\(\)\.hand\.length\) return false;/);
  assert.match(app, /const maximumLead = Math\.min\(hand\.length, opponentCards\);/);
  assert.doesNotMatch(app, /function canLeadWithoutAnswer/);
  assert.doesNotMatch(app, /function resolveUnansweredFinalLead/);
});

test("the bot does not substitute a lead if the hand-count invariant is broken", () => {
  const app = read("app.js");
  const combinations = app.slice(app.indexOf("function cardCombinations"), app.indexOf("function makeDummyCardMemory"));
  const leadOptions = app.slice(app.indexOf("function legalDummyLeadOptions"), app.indexOf("function legalDummyAnswerOptions"));
  const sandbox = {
    state: {
      stock: [],
      activePlayer: 1,
      players: [
        { hand: [] },
        { hand: [
          { id: "clubs-6", suit: "clubs" },
          { id: "clubs-7", suit: "clubs" },
          { id: "hearts-A", suit: "hearts" }
        ] }
      ]
    },
    SUITS: [{ id: "clubs" }, { id: "hearts" }],
    otherPlayerIndex: (playerIndex) => 1 - playerIndex
  };
  vm.runInNewContext(`${combinations}\n${leadOptions}\nresult = legalDummyLeadOptions(1);`, sandbox);
  assert.deepEqual(JSON.parse(JSON.stringify(sandbox.result)), []);
});

test("resolved tricks award only their actual trick cards", () => {
  const app = read("app.js");
  assert.match(app, /const trickCards = leadCards\.concat\(answerCards\);/);
  assert.match(app, /const trickPoints = cardPointTotal\(trickCards\);/);
  assert.match(app, /winner\.score \+= trickPoints;/);
  assert.match(app, /winner\.captured\.push\(\.\.\.trickCards\);/);
  assert.doesNotMatch(app, /normalizeExhaustedDealScores/);
  assert.doesNotMatch(app, /DECK_POINTS_TOTAL/);
});

test("bot rules and tuning are editable in one dedicated file", () => {
  const rules = read("bot-rules.js");
  assert.match(rules, /window\.BURA_BOT_RULES/);
  assert.match(rules, /leading:/);
  assert.match(rules, /safePair:/);
  assert.match(rules, /multiLead:/);
  assert.match(rules, /fourCardLead:/);
  assert.match(rules, /trumpLead:/);
  assert.match(rules, /scoreBonus: 18/);
  assert.match(rules, /singleLeadPenalty: 96/);
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
