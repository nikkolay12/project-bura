const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("browser bundle uses the v2.131b build and pinned dependencies", () => {
  const html = read("index.html");
  assert.match(html, /v2\.131b/);
  assert.match(html, /@supabase\/supabase-js@2\.112\.3/);
  assert.match(html, /sync-core\.js\?v=2\.131b\.1/);
});

test("online client uses token-checked RPCs instead of direct game tables", () => {
  const app = read("app.js");
  assert.doesNotMatch(app, /\.from\(["']bura_(?:rooms|room_actions)["']\)/);
  for (const rpc of ["bura_create_room", "bura_join_room", "bura_get_room", "bura_submit_action", "bura_fetch_actions"]) {
    assert.match(app, new RegExp(`\\b${rpc}\\b`));
  }
  assert.doesNotMatch(app, /emitOnlineAction\(["']request["']/);
  assert.match(app, /nextRoom\.game_state && !onlinePendingAction/);
  assert.match(app, /SYNC_CORE\.hasSequenceGap/);
  assert.match(app, /SYNC_CORE\.isCheckpointStale/);
  assert.match(app, /SYNC_CORE\.isCheckpointAhead/);
  assert.match(app, /eventSequence <= state\.eventSequence/);
  assert.match(app, /eventSequence: onlineLastEventSequence \+ 1/);
  assert.match(app, /startOnlineConsistencySync\(\)/);
  assert.match(app, /hostedRoomAccess\(room\.id\)/);
  assert.match(app, /pollJoinedHostedRooms\(\)/);
  assert.match(app, /extendLead: Boolean\(action\.extendLead\) \|\| getLeadActivityKey\(state\) !== onlineLastLeadActivityKey/);
});

test("online pending actions keep controls visible and disabled", () => {
  const app = read("app.js");
  assert.doesNotMatch(app, /if \(state\.actionPending\) \{\s*elements\.actionButtons\.innerHTML = ""/);
  assert.match(app, /button\.setAttribute\("aria-busy", "true"\)/);
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
