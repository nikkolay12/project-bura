const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("browser bundle uses the v2.126b build and pinned dependencies", () => {
  const html = read("index.html");
  assert.match(html, /v2\.126b/);
  assert.match(html, /@supabase\/supabase-js@2\.112\.3/);
  assert.match(html, /sync-core\.js\?v=2\.126b\.1/);
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
  assert.match(app, /extendLead: Boolean\(action\.extendLead\) \|\| getLeadActivityKey\(state\) !== onlineLastLeadActivityKey/);
});

test("service worker pre-caches every non-sound asset and leaves sounds lazy", () => {
  const worker = read("service-worker.js");
  assert.match(worker, /\.\/assets\/cards\//);
  assert.match(worker, /\.\/assets\/fonts\//);
  assert.match(worker, /\.\/assets\/design\//);
  assert.doesNotMatch(worker, /assets\/sound/);
  assert.match(worker, /cache\.addAll\(PRECACHE_FILES\)/);

  const context = { self: { addEventListener() {} } };
  vm.runInNewContext(`${worker}\nglobalThis.__precacheFiles = PRECACHE_FILES;`, context);
  const cachedAssets = new Set(context.__precacheFiles.filter((file) => file.startsWith("./assets/")));
  const expectedAssets = fs.readdirSync(path.join(root, "assets"), { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.relative(root, path.join(entry.parentPath, entry.name)).replaceAll("\\", "/"))
    .filter((file) => !file.startsWith("assets/sound/"))
    .map((file) => `./${file.split("/").map(encodeURIComponent).join("/")}`);

  assert.deepEqual([...cachedAssets].sort(), expectedAssets.sort());
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
