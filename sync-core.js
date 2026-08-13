(function initBuraSyncCore(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.BURA_SYNC_CORE = api;
}(typeof globalThis !== "undefined" ? globalThis : this, () => {
  "use strict";

  const PROTOCOL_VERSION = 2;

  function normalizeCheckpoint(source = {}) {
    return {
      ...source,
      selectedIds: Array.isArray(source.selectedIds) ? [...source.selectedIds] : [],
      players: Array.isArray(source.players) ? source.players : [],
      trick: source.trick || { leadPlayer: null, answerPlayer: null, leadCards: [], answerCards: [] },
      lastTrick: source.lastTrick || null,
      eventCursor: Math.max(0, Number(source.eventCursor) || 0),
      eventSequence: Math.max(0, Number(source.eventSequence) || 0),
      revision: Math.max(0, Number(source.revision) || 0)
    };
  }

  function protocolMatches(settings = {}) {
    return Number(settings.protocolVersion) === PROTOCOL_VERSION;
  }

  function createActionId(randomUuid) {
    if (typeof randomUuid === "function") return randomUuid();
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
  }

  function shouldCheckpoint(eventId, lastCheckpointEventId, state = {}, action = {}) {
    if (eventId - lastCheckpointEventId >= 8) return true;
    if (["continue", "maliutka-continue"].includes(action.type)) return true;
    return ["trickPause", "dealPause", "gameOver", "buraReveal", "maliutkaPending"].includes(state.phase);
  }

  function nextRetryDelay(attempt) {
    return Math.min(4000, 350 * (2 ** Math.max(0, attempt - 1)));
  }

  function hasSequenceGap(incomingSequence, currentSequence) {
    const incoming = Math.max(0, Number(incomingSequence) || 0);
    const current = Math.max(0, Number(currentSequence) || 0);
    return incoming > current + 1;
  }

  function isCheckpointStale(checkpoint = {}, currentSequence = 0, currentEventId = 0) {
    const checkpointSequence = Math.max(0, Number(checkpoint.eventSequence) || 0);
    const localSequence = Math.max(0, Number(currentSequence) || 0);
    if (checkpointSequence !== localSequence) return checkpointSequence < localSequence;

    const checkpointEventId = Math.max(0, Number(checkpoint.eventCursor) || 0);
    const localEventId = Math.max(0, Number(currentEventId) || 0);
    return checkpointEventId < localEventId;
  }

  function isCheckpointAhead(checkpoint = {}, currentSequence = 0, currentEventId = 0) {
    const checkpointSequence = Math.max(0, Number(checkpoint.eventSequence) || 0);
    const localSequence = Math.max(0, Number(currentSequence) || 0);
    if (checkpointSequence !== localSequence) return checkpointSequence > localSequence;

    const checkpointEventId = Math.max(0, Number(checkpoint.eventCursor) || 0);
    const localEventId = Math.max(0, Number(currentEventId) || 0);
    return checkpointEventId > localEventId;
  }

  function isCheckpointRevisionNewer(roomRevision = 0, lastAppliedRevision = 0) {
    return Math.max(0, Number(roomRevision) || 0) > Math.max(0, Number(lastAppliedRevision) || 0);
  }

  return {
    PROTOCOL_VERSION,
    normalizeCheckpoint,
    protocolMatches,
    createActionId,
    shouldCheckpoint,
    nextRetryDelay,
    hasSequenceGap,
    isCheckpointStale,
    isCheckpointAhead,
    isCheckpointRevisionNewer
  };
}));
