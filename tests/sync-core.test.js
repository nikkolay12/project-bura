const test = require("node:test");
const assert = require("node:assert/strict");
const sync = require("../sync-core.js");

test("normalizes local-only checkpoint fields", () => {
  const checkpoint = sync.normalizeCheckpoint({ eventCursor: "7", players: [{ hand: [] }] });
  assert.deepEqual(checkpoint.selectedIds, []);
  assert.equal(checkpoint.eventCursor, 7);
  assert.equal(checkpoint.eventSequence, 0);
  assert.equal(checkpoint.revision, 0);
});

test("does not share a selectedIds array with the source", () => {
  const source = { selectedIds: ["c6"] };
  const checkpoint = sync.normalizeCheckpoint(source);
  checkpoint.selectedIds.push("s7");
  assert.deepEqual(source.selectedIds, ["c6"]);
});

test("requires an exact online protocol", () => {
  assert.equal(sync.protocolMatches({ protocolVersion: 2 }), true);
  assert.equal(sync.protocolMatches({ protocolVersion: 1 }), false);
  assert.equal(sync.protocolMatches({}), false);
});

test("checkpoints completed phases and every eighth event", () => {
  assert.equal(sync.shouldCheckpoint(7, 0, { phase: "answer" }), false);
  assert.equal(sync.shouldCheckpoint(8, 0, { phase: "answer" }), true);
  assert.equal(sync.shouldCheckpoint(2, 0, { phase: "trickPause" }), true);
});

test("retry delay is bounded", () => {
  assert.equal(sync.nextRetryDelay(1), 350);
  assert.equal(sync.nextRetryDelay(8), 4000);
});

test("detects missing per-room action sequences", () => {
  assert.equal(sync.hasSequenceGap(4, 2), true);
  assert.equal(sync.hasSequenceGap(3, 2), false);
  assert.equal(sync.hasSequenceGap(0, 2), false);
});
