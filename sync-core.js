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

  function shouldCheckpoint(eventId, lastCheckpointEventId, state = {}) {
    if (eventId - lastCheckpointEventId >= 8) return true;
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

  return {
    PROTOCOL_VERSION,
    normalizeCheckpoint,
    protocolMatches,
    createActionId,
    shouldCheckpoint,
    nextRetryDelay,
    hasSequenceGap
  };
}));
