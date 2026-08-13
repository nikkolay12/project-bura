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
  assert.equal(sync.shouldCheckpoint(2, 0, { phase: "lead" }, { type: "continue" }), true);
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

test("rejects checkpoints older than already applied actions", () => {
  assert.equal(sync.isCheckpointStale({ eventSequence: 4, eventCursor: 20 }, 5, 21), true);
  assert.equal(sync.isCheckpointStale({ eventSequence: 5, eventCursor: 20 }, 5, 21), true);
  assert.equal(sync.isCheckpointStale({ eventSequence: 5, eventCursor: 21 }, 5, 21), false);
  assert.equal(sync.isCheckpointStale({ eventSequence: 6, eventCursor: 22 }, 5, 21), false);
});

test("only applies checkpoints that advance the action cursor", () => {
  assert.equal(sync.isCheckpointAhead({ eventSequence: 6, eventCursor: 22 }, 5, 21), true);
  assert.equal(sync.isCheckpointAhead({ eventSequence: 5, eventCursor: 22 }, 5, 21), true);
  assert.equal(sync.isCheckpointAhead({ eventSequence: 5, eventCursor: 21 }, 5, 21), false);
  assert.equal(sync.isCheckpointAhead({ eventSequence: 4, eventCursor: 20 }, 5, 21), false);
});

test("accepts a newer room revision for a host-only timed transition", () => {
  assert.equal(sync.isCheckpointRevisionNewer(14, 13), true);
  assert.equal(sync.isCheckpointRevisionNewer(13, 13), false);
  assert.equal(sync.isCheckpointRevisionNewer(12, 13), false);
});
