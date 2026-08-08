const TARGET_POINTS = 61;
const HAND_SIZE = 5;
const MOVE_DELAY_MS = 200;
const CLEARANCE_MS_PER_CARD = 500;

const SUITS = [
  { id: "clubs", name: "Clubs", symbol: "\u2663", color: "black", order: 0 },
  { id: "spades", name: "Spades", symbol: "\u2660", color: "black", order: 1 },
  { id: "diamonds", name: "Diamonds", symbol: "\u2666", color: "red", order: 2 },
  { id: "hearts", name: "Hearts", symbol: "\u2665", color: "red", order: 3 }
];

const RANKS = ["6", "7", "8", "9", "J", "Q", "K", "10", "A"];
const RANK_STRENGTH = { "6": 1, "7": 2, "8": 3, "9": 4, J: 5, Q: 6, K: 7, "10": 8, A: 9 };
const CARD_POINTS = { "6": 0, "7": 0, "8": 0, "9": 0, J: 2, Q: 3, K: 4, "10": 10, A: 11 };

const elements = {
  setupPanel: document.querySelector("#setup-panel"),
  gamePanel: document.querySelector("#game-panel"),
  resultPanel: document.querySelector("#result-panel"),
  opponentLane: document.querySelector("#opponent-lane"),
  currentLane: document.querySelector("#current-lane"),
  trumpCard: document.querySelector("#trump-card"),
  stockCount: document.querySelector("#stock-count"),
  playerOneRow: document.querySelector("#player-one-row"),
  playerTwoRow: document.querySelector("#player-two-row"),
  matchPanel: document.querySelector("#match-panel"),
  turnKicker: null,
  turnTitle: null,
  turnDetail: null,
  actionButtons: null,
  resultTitle: document.querySelector("#result-title"),
  resultDetail: document.querySelector("#result-detail"),
  playerOneName: document.querySelector("#player-one-name"),
  onlineMode: document.querySelector("#online-mode"),
  onlineFields: document.querySelector("#online-fields"),
  roomCode: document.querySelector("#room-code"),
  opponentModeLabel: document.querySelector("#opponent-mode-label"),
  opponentModeDetail: document.querySelector("#opponent-mode-detail"),
  onlineStatus: document.querySelector("#online-status"),
  createdCode: document.querySelector("#created-code"),
  createdCodeValue: document.querySelector("#created-code-value"),
  startButton: document.querySelector("#start-button"),
  easyPlay: document.querySelector("#easy-play-toggle")
    || document.querySelector('input[name="play-mode"][value="easy"]'),
  matchTarget: document.querySelector("#match-target")
};

function uiLabel(group, key, variables = {}) {
  const value = window.BURA_LABELS?.[group]?.[key] ?? key;
  return String(value).replace(/\{\{(\w+)\}\}/g, (_, name) => variables[name] ?? "");
}

function applyStaticLabels() {
  document.querySelectorAll("[data-label]").forEach((element) => {
    const [group, key] = element.dataset.label.split(".");
    element.textContent = uiLabel(group, key);
  });
  document.querySelectorAll("[data-label-attr], [data-label-attr-title]").forEach((element) => {
    [element.dataset.labelAttr, element.dataset.labelAttrTitle].filter(Boolean).forEach((entry) => {
      const [attribute, path] = entry.split(":");
      if (!attribute || !path) return;
      const [group, key] = path.split(".");
      if (!group || !key) return;
      element.setAttribute(attribute, uiLabel(group, key));
    });
  });
  if (!elements.playerOneName.value) elements.playerOneName.value = uiLabel("preGame", "playerOne");
}

applyStaticLabels();

let state = createEmptyState();
let audioContext = null;
const CARD_HIT_SOURCES = Array.from(
  { length: 22 },
  (_, index) => `assets/sound/cardonmat/CM${index + 1}.wav`
);
const DEAL_WIN_SOUND_SOURCE = "assets/sound/dealwin.mp3";
const INCREASE_OFFER_SOUND_SOURCE = "assets/sound/increaseoffer.wav";
let cardHitCursor = 0;
let onlineClient = null;
let onlineRoom = null;
let onlineChannel = null;
let onlineLastActionSeq = 0;
let onlineProcessedActionSeq = 0;
let onlineStateHash = "";
let onlineAppliedStateHash = "";
let onlineActionQueue = Promise.resolve();
let onlinePendingSelection = null;
let onlinePendingPlay = null;
let onlineRematchTimer = null;
let onlineRematchStarting = false;
let onlineApplyingRemoteAction = false;

function getOnlineClient() {
  if (onlineClient) return onlineClient;
  const config = window.BURA_SUPABASE_CONFIG;
  if (!config || !window.supabase?.createClient) return null;
  onlineClient = window.supabase.createClient(config.url, config.publishableKey);
  return onlineClient;
}

function setOnlineStatus(message, tone = "") {
  if (!elements.onlineStatus) return;
  elements.onlineStatus.textContent = message;
  elements.onlineStatus.dataset.tone = tone;
}

function makeRoomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

function onlineEnabled() {
  return Boolean(state.online && onlineRoom && onlineClient);
}

function createEmptyState() {
  return {
    players: [
      createPlayer("Player 1"),
      createPlayer("Player 2")
    ],
    stock: [],
    trumpCard: null,
    trumpSuit: null,
    activePlayer: 0,
    leader: 0,
    phase: "setup",
    selectedIds: [],
    trick: createEmptyTrick(),
    lastTrick: null,
    log: [],
    privacyLock: false,
    winner: null,
    resultReason: "",
    dummyOpponent: false,
    easyPlay: false,
    dummyTimer: null,
    pauseTimer: null,
    actionTimer: null,
    actionPending: false,
    claimAvailableFor: null,
    hasTakenTrick: [false, false],
    matchTarget: 3,
    dealWeight: 1,
    lastOfferFrom: null,
    nextOfferPlayer: null,
    localPlayerIndex: 0,
    offer: null,
    dealWinner: null,
    dealTimer: null,
    dealNumber: 0,
    online: false,
    onlineRole: null,
    onlineRoomId: null,
  onlineRoomCode: null,
    onlineAssignment: null,
    rematchDeadline: null
  };
}

function createPlayer(name) {
  return {
    name,
    hand: [],
    captured: [],
    score: 0,
    matchPoints: 0
  };
}

function createEmptyTrick() {
  return {
    leadPlayer: null,
    answerPlayer: null,
    leadCards: [],
    answerCards: []
  };
}

function buildDeck() {
  return SUITS.flatMap((suit) =>
    RANKS.map((rank) => ({
      id: `${suit.id}-${rank}`,
      suit: suit.id,
      suitName: suit.name,
      symbol: suit.symbol,
      color: suit.color,
      order: suit.order,
      rank,
      points: CARD_POINTS[rank],
      strength: RANK_STRENGTH[rank]
    }))
  );
}

function shuffle(cards) {
  const shuffled = [...cards];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function startLocalGame(onlineOptions = {}) {
  if (state.pauseTimer !== null) window.clearTimeout(state.pauseTimer);
  if (state.actionTimer !== null) window.clearTimeout(state.actionTimer);
  if (state.dealTimer !== null) window.clearTimeout(state.dealTimer);
  const deck = shuffle(buildDeck());
  const hostName = onlineOptions.hostName || elements.playerOneName.value.trim() || "Player 1";
  const guestName = onlineOptions.guestName || "Player 2";
  const hostPlayerIndex = onlineOptions.hostPlayerIndex ?? 0;
  const guestPlayerIndex = 1 - hostPlayerIndex;
  const playerNames = [];
  playerNames[hostPlayerIndex] = hostName;
  playerNames[guestPlayerIndex] = guestName;
  const playerOneHand = deck.slice(0, HAND_SIZE);
  const playerTwoHand = deck.slice(HAND_SIZE, HAND_SIZE * 2);
  const trumpCard = deck[HAND_SIZE * 2];
  const stock = deck.slice(HAND_SIZE * 2 + 1).concat(trumpCard);
  const firstLeader = Math.floor(Math.random() * 2);
  const matchTarget = Number(elements.matchTarget.value);

  state = {
    players: [
      { ...createPlayer(playerNames[0]), hand: sortHand(playerOneHand, trumpCard.suit) },
      { ...createPlayer(playerNames[1]), hand: sortHand(playerTwoHand, trumpCard.suit) }
    ],
    stock,
    trumpCard,
    trumpSuit: trumpCard.suit,
    activePlayer: firstLeader,
    leader: firstLeader,
    phase: "lead",
    selectedIds: [],
    trick: createEmptyTrick(),
    lastTrick: null,
    log: [
      `${playerNames[firstLeader]} leads the first trick.`,
      `${trumpCard.suitName} is trump.`
    ],
    privacyLock: false,
    winner: null,
    resultReason: "",
    dummyOpponent: onlineOptions.dummyOpponent ?? !elements.onlineMode.checked,
    easyPlay: elements.easyPlay.checked,
    dummyTimer: null,
    pauseTimer: null,
    actionTimer: null,
    actionPending: false,
    claimAvailableFor: null,
    hasTakenTrick: [false, false],
    matchTarget,
    dealWeight: 1,
    lastOfferFrom: null,
    nextOfferPlayer: null,
    localPlayerIndex: onlineOptions.localPlayerIndex ?? 0,
    offer: null,
    dealWinner: null,
    dealTimer: null,
    dealNumber: 1,
    online: Boolean(onlineOptions.online),
    onlineRole: onlineOptions.onlineRole || null,
    onlineRoomId: onlineOptions.onlineRoomId || null,
    onlineRoomCode: onlineOptions.onlineRoomCode || null,
    onlineAssignment: onlineOptions.onlineAssignment || null,
    rematchDeadline: null
  };


  elements.setupPanel.hidden = true;
  elements.resultPanel.hidden = true;
  elements.gamePanel.hidden = false;
  render();
}

async function startGame() {
  if (!elements.onlineMode?.checked) {
    startLocalGame();
    return;
  }
  if (elements.roomCode.value.trim()) {
    await joinOnlineRoom();
  } else {
    await createOnlineRoom();
  }
}

function onlineSettings() {
  return {
    easyPlay: Boolean(elements.easyPlay.checked),
    matchTarget: Number(elements.matchTarget.value)
  };
}

function serializedState() {
  return JSON.parse(JSON.stringify({
    ...state,
    dummyTimer: null,
    pauseTimer: null,
    actionTimer: null,
    dealTimer: null,
    actionPending: false,
    online: true,
    onlineRole: "guest"
  }));
}

async function createOnlineRoom() {
  const client = getOnlineClient();
  if (!client) {
    setOnlineStatus("Online mode is unavailable until Supabase loads.", "error");
    return;
  }
  const hostName = elements.playerOneName.value.trim() || "Player 1";
  const code = makeRoomCode();
  const { data, error } = await client.from("bura_rooms").insert({
    code,
    host_name: hostName,
    settings: onlineSettings(),
    status: "waiting"
  }).select().single();
  if (error) {
    setOnlineStatus(error.message, "error");
    return;
  }
  onlineClient = client;
  onlineRoom = data;
  onlineLastActionSeq = data.action_seq || 0;
  onlineProcessedActionSeq = data.action_seq || 0;
  state.online = true;
  state.onlineRole = "host";
  state.onlineRoomId = data.id;
  state.onlineRoomCode = data.code;
  elements.startButton.disabled = true;
  elements.createdCodeValue.textContent = code;
  elements.createdCode.hidden = false;
  setOnlineStatus("Waiting for the other player...", "success");
  await subscribeOnlineRoom();
}

async function joinOnlineRoom() {
  const client = getOnlineClient();
  const code = elements.roomCode.value.trim().toUpperCase();
  const guestName = elements.playerOneName.value.trim();
  if (!client) {
    setOnlineStatus("Online mode is unavailable until Supabase loads.", "error");
    return;
  }
  if (!/^[A-Z0-9]{6}$/.test(code)) {
    setOnlineStatus("Enter the six-character game code.", "error");
    return;
  }
  if (!guestName) {
    setOnlineStatus("Enter your player name to join the game.", "error");
    elements.playerOneName.focus();
    return;
  }
  const { data, error } = await client.from("bura_rooms").select("*").eq("code", code).maybeSingle();
  if (error || !data) {
    setOnlineStatus(error?.message || "Game not found.", "error");
    return;
  }
  if (data.guest_name && data.guest_name !== guestName) {
    setOnlineStatus("That game already has an opponent.", "error");
    return;
  }
  const { data: joined, error: joinError } = await client.from("bura_rooms")
    .update({ guest_name: guestName })
    .eq("id", data.id)
    .is("guest_name", null)
    .select().single();
  if (joinError || !joined) {
    setOnlineStatus(joinError?.message || "That game was just joined by someone else.", "error");
    return;
  }
  onlineRoom = joined;
  onlineLastActionSeq = joined.action_seq || 0;
  onlineProcessedActionSeq = joined.action_seq || 0;
  state.online = true;
  state.onlineRole = "guest";
  state.onlineRoomId = joined.id;
  state.onlineRoomCode = joined.code;
  elements.startButton.disabled = true;
  setOnlineStatus(`Joined ${code}. Waiting for the host to deal...`, "success");
  await subscribeOnlineRoom();
  if (joined.game_state) applyOnlineState(joined.game_state);
}

async function subscribeOnlineRoom() {
  if (!onlineRoom || !onlineClient) return;
  if (onlineChannel) await onlineClient.removeChannel(onlineChannel);
  onlineChannel = onlineClient.channel(`bura-room-${onlineRoom.id}`)
    .on("postgres_changes", {
      event: "UPDATE",
      schema: "public",
      table: "bura_rooms",
      filter: `id=eq.${onlineRoom.id}`
    }, ({ new: nextRoom }) => handleOnlineRoomUpdate(nextRoom))
    .subscribe();
}

function handleOnlineRoomUpdate(nextRoom) {
  onlineRoom = nextRoom;
  if (state.onlineRole === "host" && nextRoom.action && nextRoom.action_seq > onlineProcessedActionSeq) {
    onlineProcessedActionSeq = nextRoom.action_seq;
    handleRemoteOnlineAction(nextRoom.action);
    onlineClient.from("bura_rooms")
      .update({ action: null })
      .eq("id", onlineRoom.id)
      .eq("action_seq", nextRoom.action_seq);
  }
  if (state.onlineRole === "host" && nextRoom.guest_name && state.phase === "setup") {
    const sameNames = nextRoom.host_name.trim().toLowerCase() === nextRoom.guest_name.trim().toLowerCase();
    const hostPlayerIndex = sameNames && Math.random() >= 0.5 ? 1 : 0;
    const onlineAssignment = { hostIndex: hostPlayerIndex, guestIndex: 1 - hostPlayerIndex };
    onlineRoom.settings = { ...(nextRoom.settings || {}), assignment: onlineAssignment };
    onlineClient.from("bura_rooms").update({ settings: onlineRoom.settings }).eq("id", nextRoom.id);
    startLocalGame({
      online: true,
      onlineRole: "host",
      onlineRoomId: nextRoom.id,
      onlineRoomCode: nextRoom.code,
      hostName: nextRoom.host_name,
      guestName: nextRoom.guest_name,
      hostPlayerIndex,
      localPlayerIndex: hostPlayerIndex,
      onlineAssignment
    });
    return;
  }
  if (state.onlineRole !== "host" && nextRoom.game_state) applyOnlineState(nextRoom.game_state);
  if (nextRoom.status === "rematch_waiting") {
    const mine = state.onlineRole === "host" ? nextRoom.host_rematch : nextRoom.guest_rematch;
    const other = state.onlineRole === "host" ? nextRoom.guest_rematch : nextRoom.host_rematch;
    setOnlineStatus(other ? "Both players agreed. Starting again..." : mine ? "Waiting for the other player..." : "The other player wants a rematch.", "success");
    if (nextRoom.host_rematch && nextRoom.guest_rematch && state.onlineRole === "host" && !onlineRematchStarting) {
      window.setTimeout(() => startOnlineRematch(), MOVE_DELAY_MS);
    }
  }
}

function handleRemoteOnlineAction(action) {
  if (!onlineEnabled() || state.onlineRole !== "host") return;
  const guestIndex = state.onlineAssignment?.guestIndex ?? 1;
  onlineApplyingRemoteAction = true;
  if (action.type === "toggle_card" && canPlayCardsFor(guestIndex)) {
    if (!state.players[guestIndex].hand.some((card) => card.id === action.cardId)) {
      onlineApplyingRemoteAction = false;
      render();
      return;
    }
    const selected = new Set(state.selectedIds);
    if (selected.has(action.cardId)) selected.delete(action.cardId);
    else selected.add(action.cardId);
    state.selectedIds = [...selected];
  } else if (action.type === "clear" && canPlayCardsFor(guestIndex)) {
    state.selectedIds = [];
  } else if (action.type === "continue") scheduleRemoteAction(continueTurn, guestIndex);
  else if (action.type === "play") {
    if (canPlayCardsFor(guestIndex) && Array.isArray(action.cardIds)) {
      state.selectedIds = action.cardIds.filter((cardId) => state.players[guestIndex].hand.some((card) => card.id === cardId));
      scheduleRemoteAction(playSelectedCards, guestIndex);
    }
  }
  else if (action.type === "claim") scheduleRemoteAction(claimPoints, guestIndex);
  else if (action.type === "bura") scheduleRemoteAction(declareBura, guestIndex);
  else if (action.type === "maliutka") scheduleRemoteAction(declareMaliutka, guestIndex);
  else if (action.type === "offer" && canOfferIncreaseFor(guestIndex)) scheduleRemoteAction(offerIncrease, guestIndex);
  else if (action.type === "accept-offer") scheduleRemoteAction(() => respondToOffer(true), guestIndex);
  else if (action.type === "decline-offer") scheduleRemoteAction(() => respondToOffer(false), guestIndex);
  onlineApplyingRemoteAction = false;
  render();
}

function scheduleRemoteAction(action, actingPlayerIndex) {
  if (state.actionPending || state.phase === "gameOver") return;
  state.actionPending = true;
  render();
  state.actionTimer = window.setTimeout(() => {
    state.actionTimer = null;
    state.actionPending = false;
    const previousLocalIndex = state.localPlayerIndex;
    state.localPlayerIndex = actingPlayerIndex;
    onlineApplyingRemoteAction = true;
    action();
    state.localPlayerIndex = previousLocalIndex;
    onlineApplyingRemoteAction = false;
    render();
  }, MOVE_DELAY_MS);
}

function applyOnlineState(remoteState) {
  const remoteHash = JSON.stringify(remoteState);
  if (onlineAppliedStateHash === remoteHash) return;
  onlineAppliedStateHash = remoteHash;
  const onlineAssignment = remoteState.onlineAssignment || onlineRoom?.settings?.assignment || null;
  const localIndex = state.onlineRole === "guest"
    ? onlineAssignment?.guestIndex ?? 1
    : onlineAssignment?.hostIndex ?? 0;
  state = {
    ...remoteState,
    localPlayerIndex: localIndex,
    online: true,
    onlineRole: state.onlineRole || "guest",
    onlineRoomId: onlineRoom?.id || remoteState.onlineRoomId,
    onlineRoomCode: onlineRoom?.code || remoteState.onlineRoomCode,
    onlineAssignment,
    dummyTimer: null,
    pauseTimer: null,
    actionTimer: null,
    dealTimer: null,
    actionPending: false
  };
  if (state.onlineRole === "guest" && state.activePlayer === localIndex && onlinePendingSelection) {
    const remoteSelection = JSON.stringify(remoteState.selectedIds || []);
    const pendingSelection = JSON.stringify(onlinePendingSelection);
    if (remoteSelection === pendingSelection) onlinePendingSelection = null;
    else state.selectedIds = [...onlinePendingSelection];
  } else {
    onlinePendingSelection = null;
  }
  if (state.onlineRole === "guest" && onlinePendingPlay) {
    const playedCards = onlinePendingPlay.phase === "lead"
      ? remoteState.trick?.leadPlayer === onlinePendingPlay.playerIndex && remoteState.trick?.leadCards
      : (remoteState.trick?.answerPlayer === onlinePendingPlay.playerIndex && remoteState.trick?.answerCards)
        || (remoteState.lastTrick?.answerPlayer === onlinePendingPlay.playerIndex && remoteState.lastTrick?.answerCards);
    const confirmedIds = Array.isArray(playedCards) ? playedCards.map((card) => card.id) : [];
    const pendingIds = onlinePendingPlay.cardIds;
    if (pendingIds.length === confirmedIds.length && pendingIds.every((id) => confirmedIds.includes(id))) {
      onlinePendingPlay = null;
    } else if (state.activePlayer === localIndex && state.phase !== "gameOver") {
      state.actionPending = true;
    } else {
      onlinePendingPlay = null;
    }
  }
  elements.setupPanel.hidden = true;
  if (state.phase === "gameOver") showResultPanel();
  else elements.resultPanel.hidden = true;
  elements.gamePanel.hidden = false;
  render();
}

function publishOnlineState() {
  if (onlineApplyingRemoteAction || !onlineEnabled() || state.onlineRole !== "host") return;
  const nextState = serializedState();
  const nextHash = JSON.stringify(nextState);
  if (onlineStateHash === nextHash) return;
  onlineStateHash = nextHash;
  onlineClient.from("bura_rooms").update({ game_state: nextState, status: state.phase === "gameOver" ? "finished" : "playing" }).eq("id", onlineRoom.id).then(({ error }) => {
    if (error) setOnlineStatus(error.message, "error");
  });
}

function sendOnlineAction(type, payload = {}) {
  if (!onlineEnabled() || state.onlineRole !== "guest") return;
  onlineLastActionSeq += 1;
  const actionSeq = onlineLastActionSeq;
  onlineActionQueue = onlineActionQueue
    .catch(() => {})
    .then(() => onlineClient.from("bura_rooms").update({
      action_seq: actionSeq,
      action: { type, ...payload }
    }).eq("id", onlineRoom.id))
    .then(({ error }) => {
      if (error) setOnlineStatus(error.message, "error");
    });
}

function requestRematch() {
  if (!onlineEnabled()) {
    startLocalGame();
    return;
  }
  const field = state.onlineRole === "host" ? "host_rematch" : "guest_rematch";
  const deadline = onlineRoom.rematch_deadline || new Date(Date.now() + 10000).toISOString();
  onlineClient.from("bura_rooms").update({ [field]: true, status: "rematch_waiting", rematch_deadline: deadline }).eq("id", onlineRoom.id).then(({ error }) => {
    if (error) setOnlineStatus(error.message, "error");
  });
  if (!onlineRematchTimer) {
    onlineRematchTimer = window.setTimeout(() => {
      onlineRematchTimer = null;
      if (onlineRoom?.status !== "rematch_waiting" || (onlineRoom.host_rematch && onlineRoom.guest_rematch)) return;
      onlineClient.from("bura_rooms").update({ host_rematch: false, guest_rematch: false, rematch_deadline: null, status: "finished" }).eq("id", onlineRoom.id);
      setOnlineStatus("The rematch window expired.", "error");
    }, 10000);
  }
}

function startOnlineRematch() {
  if (!onlineEnabled() || state.onlineRole !== "host" || onlineRematchStarting) return;
  onlineRematchStarting = true;
  if (onlineRematchTimer) window.clearTimeout(onlineRematchTimer);
  onlineRematchTimer = null;
  const onlineAssignment = state.onlineAssignment || onlineRoom.settings?.assignment || { hostIndex: 0, guestIndex: 1 };
  startLocalGame({
    online: true,
    onlineRole: "host",
    onlineRoomId: onlineRoom.id,
    onlineRoomCode: onlineRoom.code,
    hostName: state.players[onlineAssignment.hostIndex].name,
    guestName: state.players[onlineAssignment.guestIndex].name,
    hostPlayerIndex: onlineAssignment.hostIndex,
    localPlayerIndex: onlineAssignment.hostIndex,
    onlineAssignment
  });
  onlineClient.from("bura_rooms").update({ host_rematch: false, guest_rematch: false, rematch_deadline: null, status: "playing" }).eq("id", onlineRoom.id);
  window.setTimeout(() => { onlineRematchStarting = false; }, MOVE_DELAY_MS * 2);
}

function sortHand(hand, trumpSuit = state.trumpSuit) {
  return [...hand].sort((first, second) => {
    const firstTrump = first.suit === trumpSuit ? 0 : 1;
    const secondTrump = second.suit === trumpSuit ? 0 : 1;
    if (firstTrump !== secondTrump) return firstTrump - secondTrump;
    if (first.order !== second.order) return first.order - second.order;
    return second.strength - first.strength;
  });
}

function showSetup() {
  if (state.pauseTimer !== null) window.clearTimeout(state.pauseTimer);
  if (state.actionTimer !== null) window.clearTimeout(state.actionTimer);
  if (state.dealTimer !== null) window.clearTimeout(state.dealTimer);
  if (onlineChannel && onlineClient) onlineClient.removeChannel(onlineChannel);
  onlineChannel = null;
  onlineRoom = null;
  onlineLastActionSeq = 0;
  onlineProcessedActionSeq = 0;
  onlineStateHash = "";
  onlineAppliedStateHash = "";
  onlineActionQueue = Promise.resolve();
  onlinePendingSelection = null;
  onlinePendingPlay = null;
  elements.createdCode.hidden = true;
  elements.createdCodeValue.textContent = "";
  state = createEmptyState();
  elements.setupPanel.hidden = false;
  elements.gamePanel.hidden = true;
  elements.resultPanel.hidden = true;
  render();
}

function currentPlayer() {
  return state.players[state.activePlayer];
}

function otherPlayerIndex(playerIndex = state.activePlayer) {
  return playerIndex === 0 ? 1 : 0;
}

function otherPlayer(playerIndex = state.activePlayer) {
  return state.players[otherPlayerIndex(playerIndex)];
}

function canAct() {
  return state.phase !== "setup" && state.phase !== "gameOver" && state.phase !== "dealPause" && state.phase !== "offerPending";
}

function canPlayCardsFor(playerIndex) {
  return canAct()
    && state.activePlayer === playerIndex
    && (state.phase === "lead" || state.phase === "answer");
}

function canOfferIncreaseFor(playerIndex) {
  const openingLead = state.phase === "lead" && !state.hasTakenTrick?.some(Boolean);
  const hasTakenTrick = Boolean(state.hasTakenTrick?.[playerIndex]);
  return canAct()
    && !state.offer
    && state.activePlayer === playerIndex
    && (state.phase === "lead" || state.phase === "answer")
    && state.dealWeight < 6
    && (openingLead || hasTakenTrick)
    && (state.nextOfferPlayer == null || state.nextOfferPlayer === playerIndex);
}

function canOfferIncrease(playerIndex = state.localPlayerIndex) {
  return playerIndex === state.localPlayerIndex && canOfferIncreaseFor(playerIndex);
}

function canReviewWonTrickFor(playerIndex) {
  return canAct()
    && state.phase === "trickPause"
    && state.activePlayer === playerIndex
    && state.claimAvailableFor === playerIndex
    && state.lastTrick?.winnerIndex === playerIndex;
}

function toggleCard(cardId) {
  if (!canPlayCardsFor(state.localPlayerIndex) || state.actionPending) return;
  if (onlineEnabled() && state.onlineRole === "guest") {
    const selected = new Set(state.selectedIds);
    if (selected.has(cardId)) selected.delete(cardId);
    else selected.add(cardId);
    state.selectedIds = [...selected];
    onlinePendingSelection = [...state.selectedIds];
    if (state.easyPlay && shouldAutoPlay()) {
      queueGuestPlay(selectedCards());
    } else {
      render();
      sendOnlineAction("toggle_card", { cardId });
    }
    return;
  }
  const selected = new Set(state.selectedIds);
  if (selected.has(cardId)) selected.delete(cardId);
  else selected.add(cardId);
  state.selectedIds = [...selected];
  render();
  if (state.easyPlay && shouldAutoPlay()) scheduleAction(playSelectedCards);
}

function shouldAutoPlay() {
  const cards = selectedCards();
  if (!cards.length) return false;

  if (state.phase === "answer") return cards.length === state.trick.leadCards.length;

  const suit = cards[0].suit;
  const suitCards = currentPlayer().hand.filter((card) => card.suit === suit);
  return cards.length === suitCards.length && cards.every((card) => card.suit === suit);
}

function clearSelection() {
  state.selectedIds = [];
  render();
}

function queueGuestPlay(cards = selectedCards()) {
  if (!cards.length) return;
  onlinePendingSelection = null;
  onlinePendingPlay = {
    playerIndex: state.localPlayerIndex,
    cardIds: cards.map((card) => card.id),
    cards: [...cards],
    phase: state.phase
  };
  state.actionPending = true;
  render();
  sendOnlineAction("play", { cardIds: onlinePendingPlay.cardIds });
}

function selectedCards() {
  const selected = new Set(state.selectedIds);
  return currentPlayer().hand.filter((card) => selected.has(card.id));
}

function validateLead(cards) {
  if (!cards.length) return uiLabel("game", "chooseAtLeast");
  if (cards.length > otherPlayer().hand.length) return uiLabel("game", "tooManyLead");
  const suit = cards[0].suit;
  if (!cards.every((card) => card.suit === suit)) return uiLabel("game", "sameSuit");
  return "";
}

function validateAnswer(cards) {
  const needed = state.trick.leadCards.length;
  if (cards.length !== needed) {
    return uiLabel("game", "exactCards", {
      needed,
      cardWord: uiLabel("game", needed === 1 ? "card" : "cards")
    });
  }
  return "";
}

function playSelectedCards() {
  const actingPlayerIndex = state.dummyOpponent && state.activePlayer === 1
    ? 1
    : state.localPlayerIndex;
  if (!canPlayCardsFor(actingPlayerIndex)) return;
  const cards = selectedCards();

  if (state.phase === "lead") {
    const error = validateLead(cards);
    if (error) {
      addLog(error);
      render();
      return;
    }
    playTurnSound("lead");
    state.trick = {
      leadPlayer: state.activePlayer,
      answerPlayer: otherPlayerIndex(),
      leadCards: removeCardsFromHand(state.activePlayer, cards.map((card) => card.id)),
      answerCards: []
    };
    state.phase = "answer";
    state.activePlayer = state.trick.answerPlayer;
    state.selectedIds = [];
    state.claimAvailableFor = null;
    state.privacyLock = false;
    addLog(`${state.players[state.trick.leadPlayer].name} led ${cards.length} ${cards.length === 1 ? "card" : "cards"}.`);
    render();
    return;
  }

  if (state.phase === "answer") {
    const error = validateAnswer(cards);
    if (error) {
      addLog(error);
      render();
      return;
    }

    playTurnSound("answer");
    state.trick.answerCards = removeCardsFromHand(state.activePlayer, cards.map((card) => card.id));
    resolveTrick();
  }
}

function removeCardsFromHand(playerIndex, cardIds) {
  const selected = new Set(cardIds);
  const player = state.players[playerIndex];
  const removed = player.hand.filter((card) => selected.has(card.id));
  player.hand = player.hand.filter((card) => !selected.has(card.id));
  return removed;
}

function resolveTrick() {
  const leadCards = state.trick.leadCards;
  const answerCards = state.trick.answerCards;
  const answerBeatsLead = canBeatCards(leadCards, answerCards);
  const winnerIndex = answerBeatsLead ? state.trick.answerPlayer : state.trick.leadPlayer;
  const loserIndex = otherPlayerIndex(winnerIndex);
  const trickCards = leadCards.concat(answerCards);
  const trickPoints = trickCards.reduce((total, card) => total + card.points, 0);
  const winner = state.players[winnerIndex];

  winner.score += trickPoints;
  winner.captured.push(...trickCards);
  state.lastTrick = {
    winnerIndex,
    points: trickPoints,
    leadPlayer: state.trick.leadPlayer,
    answerPlayer: state.trick.answerPlayer,
    leadCards: [...leadCards],
    answerCards: [...answerCards]
  };

  state.activePlayer = winnerIndex;
  state.leader = winnerIndex;
  state.claimAvailableFor = winnerIndex;
  state.hasTakenTrick[winnerIndex] = true;
  state.phase = "trickPause";
  state.selectedIds = [];
  render();
  if (state.dummyOpponent && winnerIndex === 1) {
    state.pauseTimer = window.setTimeout(
      () => finishTrickPause(winnerIndex, loserIndex, trickPoints),
      trickCards.length * CLEARANCE_MS_PER_CARD
    );
  }
}

function finishTrickPause(winnerIndex, loserIndex, trickPoints) {
  state.pauseTimer = null;
  const drawText = refillHands(winnerIndex, loserIndex);
  state.claimAvailableFor = null;
  state.phase = "lead";
  state.selectedIds = [];
  state.trick = createEmptyTrick();
  state.lastTrick = null;
  state.privacyLock = false;

  addLog(`${state.players[winnerIndex].name} won the trick for ${trickPoints} ${trickPoints === 1 ? "point" : "points"}.${drawText}`);

  if (isDealExhausted()) {
    finishByCards();
    return;
  }

  render();
}

function canBeatCards(leadCards, answerCards) {
  if (leadCards.length !== answerCards.length) return false;

  const orderedLead = [...leadCards].sort((first, second) => {
    const firstIsTrump = first.suit === state.trumpSuit ? 1 : 0;
    const secondIsTrump = second.suit === state.trumpSuit ? 1 : 0;
    if (firstIsTrump !== secondIsTrump) return secondIsTrump - firstIsTrump;
    return second.strength - first.strength;
  });

  const used = new Set();

  function backtrack(leadIndex) {
    if (leadIndex === orderedLead.length) return true;
    const lead = orderedLead[leadIndex];
    for (let index = 0; index < answerCards.length; index += 1) {
      if (used.has(index)) continue;
      if (!cardBeats(answerCards[index], lead)) continue;
      used.add(index);
      if (backtrack(leadIndex + 1)) return true;
      used.delete(index);
    }
    return false;
  }

  return backtrack(0);
}

function cardBeats(challenger, target) {
  if (challenger.suit === target.suit && challenger.strength > target.strength) return true;
  return challenger.suit === state.trumpSuit && target.suit !== state.trumpSuit;
}

function refillHands(winnerIndex, loserIndex) {
  const winner = state.players[winnerIndex];
  const loser = state.players[loserIndex];
  const winnerNeeds = HAND_SIZE - winner.hand.length;
  const loserNeeds = HAND_SIZE - loser.hand.length;
  let drawn = 0;

  if (winnerNeeds + loserNeeds === 0) return "";

  for (let count = 0; count < Math.max(winnerNeeds, loserNeeds); count += 1) {
    if (count < winnerNeeds && state.stock.length) {
      winner.hand.push(state.stock.shift());
      drawn += 1;
    }
    if (count < loserNeeds && state.stock.length) {
      loser.hand.push(state.stock.shift());
      drawn += 1;
    }
  }

  winner.hand = sortHand(winner.hand);
  loser.hand = sortHand(loser.hand);
  if (!drawn) return "";
  return ` Drew ${drawn} from the stock.`;
}

function claimPoints() {
  if (!canReviewWonTrickFor(state.localPlayerIndex)) return;
  const player = currentPlayer();
  const opponentIndex = otherPlayerIndex();

  if (player.score >= TARGET_POINTS) {
    clearTrickPauseTimer();
    finishDeal(state.activePlayer, `${player.name} claimed ${TARGET_POINTS} points.`);
    return;
  }

  clearTrickPauseTimer();
  finishDeal(opponentIndex, `${player.name} made a false 61 claim.`);
}

function clearTrickPauseTimer() {
  if (state.pauseTimer === null) return;
  window.clearTimeout(state.pauseTimer);
  state.pauseTimer = null;
}

function declareBura() {
  if (state.phase === "setup" || state.phase === "gameOver") return;
  if (!hasBura(state.activePlayer)) return;
  finishDeal(state.activePlayer, `${currentPlayer().name} declared Bura with all five trumps.`);
}

function offerIncrease() {
  if (!canOfferIncrease()) return;
  const from = state.activePlayer;
  const to = otherPlayerIndex(from);
  state.offer = {
    from,
    to,
    proposedWeight: state.dealWeight + 1,
    returnPhase: state.phase
  };
  state.phase = "offerPending";
  state.activePlayer = to;
  state.selectedIds = [];
  state.privacyLock = false;
  playIncreaseOfferSound();
  addLog(`${state.players[from].name} offered to raise the deal to ${state.dealWeight + 1}.`);
  render();
}

function respondToOffer(accepted) {
  if (state.phase !== "offerPending" || !state.offer || state.activePlayer !== state.offer.to || state.localPlayerIndex !== state.offer.to) return;
  const offer = state.offer;
  const offerer = state.players[offer.from];
  const responder = state.players[offer.to];
  state.offer = null;

  if (!accepted) {
    finishDeal(offer.from, `${responder.name} declined the raise. ${offerer.name} wins the deal.`, state.dealWeight);
    return;
  }

  state.dealWeight = offer.proposedWeight;
  state.lastOfferFrom = offer.from;
  state.nextOfferPlayer = offer.to;
  state.phase = offer.returnPhase;
  state.activePlayer = offer.from;
  state.privacyLock = false;
  addLog(`${responder.name} accepted. The deal is now worth ${state.dealWeight}.`);
  render();
}

function hasBura(playerIndex) {
  const hand = state.players[playerIndex].hand;
  return hand.length === HAND_SIZE && hand.every((card) => card.suit === state.trumpSuit);
}

function maliutkaCards(playerIndex = state.activePlayer) {
  const hand = state.players[playerIndex].hand;
  const fiveOfKind = RANKS.map((rank) => hand.filter((card) => card.rank === rank))
    .find((cards) => cards.length === HAND_SIZE);
  if (fiveOfKind) return fiveOfKind;

  return SUITS.map((suit) => hand.filter((card) => card.suit === suit.id))
    .find((cards) => cards.length === HAND_SIZE) || [];
}

function declareMaliutka() {
  if (state.phase === "setup" || state.phase === "gameOver" || state.phase === "trickPause") return;
  const claimantIndex = state.localPlayerIndex;
  const defenderIndex = otherPlayerIndex(claimantIndex);
  const cards = maliutkaCards(claimantIndex);
  if (cards.length !== HAND_SIZE) return;
  const defenderPaneCards = state.trick.leadPlayer === defenderIndex
    ? [...state.trick.leadCards]
    : state.trick.answerPlayer === defenderIndex
      ? [...state.trick.answerCards]
      : [];
  const defenderNeeds = HAND_SIZE - defenderPaneCards.length;
  if (defenderNeeds < 0 || state.players[defenderIndex].hand.length < defenderNeeds) return;

  const leadCards = removeCardsFromHand(claimantIndex, cards.map((card) => card.id));
  const remainingDefenderCards = state.players[defenderIndex].hand.slice(0, defenderNeeds);
  const answerCards = defenderPaneCards.concat(
    removeCardsFromHand(defenderIndex, remainingDefenderCards.map((card) => card.id))
  );
  const canCut = answerCards.length === HAND_SIZE && canBeatCards(leadCards, answerCards);
  const winnerIndex = canCut ? defenderIndex : claimantIndex;
  const loserIndex = otherPlayerIndex(winnerIndex);
  const trickCards = leadCards.concat(answerCards);
  const trickPoints = trickCards.reduce((total, card) => total + card.points, 0);

  state.players[winnerIndex].score += trickPoints;
  state.players[winnerIndex].captured.push(...trickCards);
  state.lastTrick = {
    winnerIndex,
    points: trickPoints,
    leadPlayer: claimantIndex,
    answerPlayer: defenderIndex,
    leadCards: [...leadCards],
    answerCards: [...answerCards]
  };
  state.trick = {
    leadPlayer: claimantIndex,
    answerPlayer: defenderIndex,
    leadCards,
    answerCards
  };
  state.activePlayer = winnerIndex;
  state.leader = winnerIndex;
  state.claimAvailableFor = winnerIndex;
  state.phase = "trickPause";
  state.selectedIds = [];
  state.privacyLock = false;
  addLog(`${state.players[claimantIndex].name} declared Maliutka. ${canCut ? `${state.players[defenderIndex].name} cut it.` : `${state.players[claimantIndex].name} takes the pile.`}`);
  playTurnSound("answer");
  render();
  state.pauseTimer = window.setTimeout(
    () => finishTrickPause(winnerIndex, loserIndex, trickPoints),
    trickCards.length * CLEARANCE_MS_PER_CARD
  );
}

function finishByCards() {
  const [first, second] = state.players;

  if (first.score === 60 && second.score === 60) {
    finishDeal(null, `The deal ended ${first.score}-${second.score}.`);
  } else {
    const winnerIndex = first.score > second.score ? 0 : 1;
    finishDeal(winnerIndex, `${state.players[winnerIndex].name} finished with more captured points.`);
  }
}

function finishDeal(winnerIndex, reason, awardWeight = state.dealWeight) {
  const awarded = winnerIndex === null ? 0 : awardWeight;
  if (winnerIndex !== null) state.players[winnerIndex].matchPoints += awarded;

  const matchWon = winnerIndex !== null && state.players[winnerIndex].matchPoints >= state.matchTarget;
  state.winner = winnerIndex;
  state.resultReason = winnerIndex === null
    ? `${reason} No match points were awarded.`
    : `${reason} ${state.players[winnerIndex].name} received ${awarded} match ${awarded === 1 ? "point" : "points"}.`;
  state.privacyLock = false;
  state.offer = null;

  if (matchWon) {
    state.phase = "gameOver";
    playDealWinSound();
    playResultSound(winnerIndex === state.localPlayerIndex ? "win" : "lose");
    showResultPanel();
    render();
    return;
  }

  playDealWinSound();
  state.phase = "dealPause";
  state.dealWinner = winnerIndex;
  state.selectedIds = [];
  state.dealTimer = window.setTimeout(() => startNextDeal(winnerIndex), MOVE_DELAY_MS * 3);
  render();
}

function startNextDeal(previousWinner) {
  const playerNames = state.players.map((player) => player.name);
  const matchPoints = state.players.map((player) => player.matchPoints);
  const firstLeader = previousWinner === null ? Math.floor(Math.random() * 2) : previousWinner;
  const deck = shuffle(buildDeck());
  const playerOneHand = deck.slice(0, HAND_SIZE);
  const playerTwoHand = deck.slice(HAND_SIZE, HAND_SIZE * 2);
  const trumpCard = deck[HAND_SIZE * 2];
  const stock = deck.slice(HAND_SIZE * 2 + 1).concat(trumpCard);

  state = {
    players: [
      { ...createPlayer(playerNames[0]), hand: sortHand(playerOneHand, trumpCard.suit), matchPoints: matchPoints[0] },
      { ...createPlayer(playerNames[1]), hand: sortHand(playerTwoHand, trumpCard.suit), matchPoints: matchPoints[1] }
    ],
    stock,
    trumpCard,
    trumpSuit: trumpCard.suit,
    activePlayer: firstLeader,
    leader: firstLeader,
    phase: "lead",
    selectedIds: [],
    trick: createEmptyTrick(),
    lastTrick: null,
    log: [`${playerNames[firstLeader]} leads deal ${state.dealNumber + 1}.`, `${trumpCard.suitName} is trump.`],
    privacyLock: false,
    winner: null,
    resultReason: "",
    dummyOpponent: state.dummyOpponent,
    easyPlay: state.easyPlay,
    dummyTimer: null,
    pauseTimer: null,
    actionTimer: null,
    actionPending: false,
    claimAvailableFor: null,
    hasTakenTrick: [false, false],
    matchTarget: state.matchTarget,
    dealWeight: 1,
    lastOfferFrom: null,
    nextOfferPlayer: null,
    localPlayerIndex: state.localPlayerIndex,
    offer: null,
    dealWinner: null,
    dealTimer: null,
    dealNumber: state.dealNumber + 1,
    online: state.online,
    onlineRole: state.onlineRole,
    onlineRoomId: state.onlineRoomId,
    onlineRoomCode: state.onlineRoomCode,
    onlineAssignment: state.onlineAssignment,
    rematchDeadline: null
  };
  render();
}

function playResultSound(result) {
  try {
    const context = getAudioContext();
    if (!context) return;
    context.resume();
    const notes = result === "win" ? [523.25, 659.25, 783.99] : [392, 329.63, 261.63];
    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = context.currentTime + index * 0.12;
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.16, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.3);
    });
  } catch (error) {
    // Audio is optional and may be unavailable in a locked-down browser.
  }
}

function playTurnSound(type) {
  try {
    const source = CARD_HIT_SOURCES[cardHitCursor % CARD_HIT_SOURCES.length];
    cardHitCursor += 1;
    const audio = new Audio(source);
    audio.preload = "auto";
    audio.volume = type === "lead" ? 0.48 : 0.42;
    audio.playbackRate = type === "lead" ? 1 : 0.94;
    audio.play().catch(() => {});
  } catch (error) {
    // Audio is optional and may be unavailable in a locked-down browser.
  }
}

function playDealWinSound() {
  if (state.winner !== state.localPlayerIndex) return;
  try {
    const audio = new Audio(DEAL_WIN_SOUND_SOURCE);
    audio.preload = "auto";
    audio.volume = 0.58;
    audio.play().catch(() => {});
  } catch (error) {
    // Audio is optional and may be unavailable in a locked-down browser.
  }
}

function playIncreaseOfferSound() {
  try {
    const audio = new Audio(INCREASE_OFFER_SOUND_SOURCE);
    audio.preload = "auto";
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch (error) {
    // Audio is optional and may be unavailable in a locked-down browser.
  }
}

function getAudioContext() {
  if (audioContext) return audioContext;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  audioContext = new AudioContext();
  return audioContext;
}

function showResultPanel() {
  elements.resultPanel.hidden = false;
  const playAgainButton = document.querySelector("#play-again-button");
  playAgainButton.textContent = onlineEnabled() ? "I want to play again" : uiLabel("preGame", "dealAgain");
  const [first, second] = state.players;
  if (state.winner === null) {
    elements.resultTitle.textContent = uiLabel("game", "splitDeal");
  } else {
    elements.resultTitle.textContent = uiLabel("game", "wonGame", { name: state.players[state.winner].name });
  }
  elements.resultDetail.textContent = `${state.resultReason} ${uiLabel("game", "finalScore", {
    firstName: first.name,
    firstMatch: first.matchPoints,
    secondName: second.name,
    secondMatch: second.matchPoints,
    firstScore: first.score,
    secondScore: second.score
  })}`;
}

function isDealExhausted() {
  return state.stock.length === 0 && state.players.every((player) => player.hand.length === 0);
}

function continueTurn() {
  if (!canReviewWonTrickFor(state.localPlayerIndex)) return;
  const winnerIndex = state.lastTrick.winnerIndex;
  finishTrickPause(winnerIndex, otherPlayerIndex(winnerIndex), state.lastTrick.points);
}

function scheduleAction(action) {
  if (state.actionPending || state.phase === "gameOver") return;
  state.actionPending = true;
  render();
  state.actionTimer = window.setTimeout(() => {
    state.actionTimer = null;
    state.actionPending = false;
    action();
    render();
  }, MOVE_DELAY_MS);
}

function addLog(message) {
  state.log = [message, ...state.log].slice(0, 6);
}

function render() {
  renderTable();
  renderPlayerLanes();
  renderActions();
  scheduleDummyTurn();
  publishOnlineState();
}

function scheduleDummyTurn() {
  if (!state.dummyOpponent || state.actionPending || state.activePlayer !== 1 || state.phase === "setup" || state.phase === "gameOver" || state.phase === "trickPause" || state.phase === "dealPause") return;
  if (state.dummyTimer !== null) return;
  state.dummyTimer = window.setTimeout(() => {
    state.dummyTimer = null;
    playDummyTurn();
  }, 420);
}

function playDummyTurn() {
  if (!state.dummyOpponent || state.activePlayer !== 1 || state.phase === "gameOver") return;
  if (state.phase === "offerPending") {
    scheduleAction(() => respondToOffer(true));
    return;
  }
  state.privacyLock = false;
  const needed = state.phase === "answer" ? state.trick.leadCards.length : 1;
  state.selectedIds = state.players[1].hand.slice(0, needed).map((card) => card.id);
  scheduleAction(playSelectedCards);
}

function renderTable() {
  if (state.phase === "setup") return;

  elements.trumpCard.innerHTML = renderCard(state.trumpCard, { trumpDisplay: true });
  elements.stockCount.textContent = uiLabel("game", "stockCount", { count: state.stock.length });
  const hasCurrentTrick = state.trick.leadCards.length || state.trick.answerCards.length;
  const activeLeadCards = hasCurrentTrick ? state.trick.leadCards : state.lastTrick?.leadCards || [];
  const activeAnswerCards = hasCurrentTrick ? state.trick.answerCards : state.lastTrick?.answerCards || [];
  const leadPlayer = hasCurrentTrick ? state.trick.leadPlayer : state.lastTrick?.leadPlayer;
  const answerPlayer = hasCurrentTrick ? state.trick.answerPlayer : state.lastTrick?.answerPlayer;

  const roleForPlayer = (playerIndex) => {
    return state.phase === "trickPause" && state.lastTrick?.winnerIndex === playerIndex
      ? "winner-glow"
      : "";
  };
  const bottomPlayerIndex = state.localPlayerIndex;
  const topPlayerIndex = otherPlayerIndex(bottomPlayerIndex);
  const cardsForPlayer = (playerIndex) => {
    const confirmedCards = leadPlayer === playerIndex
      ? activeLeadCards
      : answerPlayer === playerIndex
        ? activeAnswerCards
        : [];
    if (confirmedCards.length || onlinePendingPlay?.playerIndex !== playerIndex) return confirmedCards;
    return onlinePendingPlay.cards;
  };

  renderPlayerPane(elements.playerOneRow, cardsForPlayer(bottomPlayerIndex), roleForPlayer(bottomPlayerIndex));
  renderPlayerPane(elements.playerTwoRow, cardsForPlayer(topPlayerIndex), roleForPlayer(topPlayerIndex));
  renderMatchPanel();

}

function renderMatchPanel() {
  const renderMatchScore = (playerIndex, seat) => {
    const player = state.players[playerIndex];
    const progress = Math.min(100, (player.matchPoints / state.matchTarget) * 100);
    return `
      <div class="match-score-player ${state.activePlayer === playerIndex ? "active" : ""}">
      <div class="match-score-heading">
          <span class="match-seat">${uiLabel("game", seat.toLowerCase())}</span>
          <strong>${escapeHtml(player.name)}</strong>
        </div>
        <div class="match-score-value">${player.matchPoints}</div>
        <div class="match-score-track"><span style="width: ${progress}%"></span></div>
      </div>
    `;
  };

  elements.matchPanel.innerHTML = `
    <div class="match-score-stack">
      ${renderMatchScore(1, "NORTH")}
      <div class="match-deal-info">
        <div>
          <span>${uiLabel("game", "dealWeight")}</span>
          <strong>${state.dealWeight}</strong>
        </div>
        <div>
          <span>${uiLabel("game", "matchTarget")}</span>
          <strong>${state.matchTarget}</strong>
        </div>
      </div>
      ${renderMatchScore(0, "SOUTH")}
    </div>
  `;
}

function renderPlayerPane(element, cards, role) {
  const cardsKey = cards.map((card) => card.id).join("|");
  const cardsUnchanged = cardsKey === element.dataset.cardsKey;
  const animateCards = cardsKey && !cardsUnchanged;
  element.dataset.cardsKey = cardsKey;
  element.className = `played-row ${role}`.trim();
  if (cardsUnchanged) return;
  element.innerHTML = cards.length
    ? cards.map((card) => renderCard(card, { entering: animateCards })).join("")
    : "";
}

function renderPlayerLanes() {
  if (state.phase === "setup") return;

  if (state.phase === "gameOver") {
    elements.opponentLane.innerHTML = "";
    elements.currentLane.innerHTML = renderLane(state.localPlayerIndex, false);
    syncLaneControls();
    return;
  }

  const localPlayerIndex = state.localPlayerIndex;
  const opponentPlayerIndex = localPlayerIndex === 0 ? 1 : 0;
  elements.opponentLane.innerHTML = renderLane(opponentPlayerIndex, state.activePlayer === opponentPlayerIndex);
  elements.currentLane.innerHTML = renderLane(localPlayerIndex, state.activePlayer === localPlayerIndex);
  syncLaneControls();
}

function syncLaneControls() {
  elements.turnKicker = document.querySelector("#turn-kicker");
  elements.turnTitle = document.querySelector("#turn-title");
  elements.turnDetail = document.querySelector("#turn-detail");
  elements.actionButtons = document.querySelector("#current-lane-actions");
}

function renderLane(playerIndex, isCurrentLane) {
  const player = state.players[playerIndex];
  const laneTitle = isCurrentLane ? uiLabel("game", "currentTurn") : uiLabel("game", "waiting");
  const showHand = playerIndex === state.localPlayerIndex;
  const pendingCardIds = onlinePendingPlay?.playerIndex === playerIndex
    ? new Set(onlinePendingPlay.cardIds)
    : null;
  const cardsMarkup = showHand
    ? player.hand.filter((card) => !pendingCardIds?.has(card.id)).map((card) => renderCard(card, {
      interactive: true,
      selected: state.selectedIds.includes(card.id)
    })).join("")
    : "";

  return `
    <div class="lane-heading">
      <div class="lane-heading-main">
        <h2>${escapeHtml(player.name)}</h2>
        <p class="mini-label">${laneTitle}</p>
      </div>
      <div class="turn-ornaments ${isCurrentLane ? "active" : ""}" aria-hidden="true">
        <img src="assets/design/ornament1%201.svg" alt="">
        <img src="assets/design/ornament1%201.svg" alt="">
        <img src="assets/design/ornament1%201.svg" alt="">
      </div>
    </div>
    ${playerIndex === state.localPlayerIndex ? `
      <div class="hand-controls-row">
        <div class="hand-row">${cardsMarkup || `<div class="empty-slot">${uiLabel("game", "noCards")}</div>`}</div>
        <div class="lane-actions" id="current-lane-actions">
          <span class="visually-hidden" id="turn-kicker">Turn</span>
          <span class="visually-hidden" id="turn-title">Waiting</span>
          <span class="visually-hidden" id="turn-detail"></span>
        </div>
      </div>
    ` : ""}
  `;
}

function renderActions() {
  if (state.phase === "setup") return;

  const player = currentPlayer();
  elements.turnKicker.textContent = uiLabel("game", state.phase === "answer" ? "answer" : "lead");
  const localIndex = state.localPlayerIndex;
  const playerOneMaliutka = !hasBura(localIndex) && maliutkaCards(localIndex).length === HAND_SIZE;
  const playerOneMaliutkaButton = playerOneMaliutka
    ? `<button class="secondary-button gold" type="button" data-action="maliutka">${uiLabel("game", "declareMaliutka")}</button>`
    : "";

  if (state.actionPending) {
    elements.turnTitle.textContent = uiLabel("game", "makingMove");
    elements.turnDetail.textContent = "";
    elements.actionButtons.innerHTML = "";
    return;
  }

  if (state.phase === "dealPause") {
    elements.turnKicker.textContent = uiLabel("game", "dealComplete");
    elements.turnTitle.textContent = state.winner === null
      ? uiLabel("game", "tieDeal")
      : uiLabel("game", "wonDeal", { name: state.players[state.winner].name });
    elements.turnDetail.textContent = `${state.resultReason} ${uiLabel("game", "dealingNext")}`;
    elements.actionButtons.innerHTML = "";
    return;
  }

  if (state.phase === "gameOver") {
    elements.turnTitle.textContent = state.winner === null
      ? uiLabel("game", "splitDeal")
      : uiLabel("game", "wonGame", { name: state.players[state.winner].name });
    elements.turnDetail.textContent = state.resultReason;
    elements.actionButtons.innerHTML = `<button class="secondary-button" type="button" data-action="setup">${uiLabel("game", "newTable")}</button>`;
    bindActionButtons();
    return;
  }

  if (state.phase === "trickPause") {
    elements.turnKicker.textContent = uiLabel("game", "trickComplete");
    elements.turnTitle.textContent = uiLabel("game", "cardsRevealed");
    elements.turnDetail.textContent = uiLabel("game", "nextTurn");
    const canContinue = canReviewWonTrickFor(state.localPlayerIndex);
    elements.actionButtons.innerHTML = canContinue
      ? `
        <button class="secondary-button" type="button" data-action="claim">${uiLabel("game", "claim61")}</button>
        <button class="primary-button" type="button" data-action="continue">${uiLabel("game", "continue")}</button>
      `
      : "";
    bindActionButtons();
    return;
  }

  if (state.phase === "offerPending" && state.offer) {
    const offer = state.offer;
    const offerer = state.players[offer.from];
    elements.turnKicker.textContent = uiLabel("game", "dealOffer");
    elements.turnTitle.textContent = uiLabel("game", "offerTitle", { name: offerer.name });
    elements.turnDetail.textContent = uiLabel("game", "offerDetail", {
      weight: offer.proposedWeight,
      pointWord: uiLabel("game", offer.proposedWeight === 1 ? "point" : "points")
    });
    if (state.localPlayerIndex !== offer.to || (state.dummyOpponent && state.activePlayer === 1)) {
      elements.actionButtons.innerHTML = "";
    } else {
      elements.actionButtons.innerHTML = `
        <button class="primary-button" type="button" data-action="accept-offer">${uiLabel("game", "acceptOffer")}</button>
        <button class="secondary-button" type="button" data-action="decline-offer">${uiLabel("game", "declineOffer")}</button>
      `;
    }
    bindActionButtons();
    return;
  }

  if (state.dummyOpponent && state.activePlayer === 1) {
    elements.turnTitle.textContent = uiLabel("game", "dummyPlaying");
    elements.turnDetail.textContent = uiLabel("game", "dummyDetail");
    elements.actionButtons.innerHTML = playerOneMaliutkaButton;
    bindActionButtons();
    return;
  }

  const isLocalTurn = state.activePlayer === state.localPlayerIndex;
  const cards = isLocalTurn ? selectedCards() : [];
  const error = !isLocalTurn
    ? uiLabel("game", "waiting")
    : state.phase === "lead" ? validateLead(cards) : validateAnswer(cards);
  const playText = state.phase === "lead"
    ? uiLabel("game", "makingLead", { count: cards.length || "" }).trim()
    : uiLabel("game", "makingAnswer", { selected: cards.length, needed: state.trick.leadCards.length });

  elements.turnTitle.textContent = state.phase === "lead"
    ? uiLabel("game", "leadTitle", { name: player.name })
    : uiLabel("game", "answerTitle", { name: player.name });
  elements.turnDetail.textContent = error || selectionSummary(cards);

  const buraButton = hasBura(state.activePlayer)
    ? `<button class="secondary-button gold" type="button" data-action="bura">${uiLabel("game", "declareBura")}</button>`
    : "";
  const maliutkaButton = playerOneMaliutkaButton;
  const claimButton = state.claimAvailableFor === state.activePlayer
    && state.activePlayer === state.localPlayerIndex
    && state.lastTrick?.winnerIndex === state.activePlayer
    ? `<button class="secondary-button" type="button" data-action="claim">${uiLabel("game", "claim61")}</button>`
    : "";
  const canOffer = canOfferIncrease();
  const offerButton = canOffer
    ? `<button class="secondary-button" type="button" data-action="offer">Increase</button>`
    : "";
  elements.actionButtons.innerHTML = `
    <button class="primary-button" type="button" data-action="play" ${!isLocalTurn || error ? "disabled" : ""}>${playText}</button>
    <button class="secondary-button" type="button" data-action="clear" ${isLocalTurn && cards.length ? "" : "disabled"}>${uiLabel("game", "clear")}</button>
    ${claimButton}
    ${offerButton}
    ${buraButton}
    ${maliutkaButton}
  `;
  bindActionButtons();
}

function selectionSummary(cards) {
  if (!cards.length) return uiLabel("game", "chooseCards");
  const points = cards.reduce((total, card) => total + card.points, 0);
  return uiLabel("game", "scorePoints", {
    count: cards.length,
    points,
    pointWord: uiLabel("game", points === 1 ? "point" : "points")
  });
}

function bindActionButtons() {
  elements.actionButtons.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      if (["accept-offer", "decline-offer"].includes(action) && (!state.offer || state.localPlayerIndex !== state.offer.to)) return;
      if (onlineEnabled() && state.onlineRole === "guest") {
        if (action === "setup") return;
        if (action === "play") {
          const cards = selectedCards();
          const error = state.phase === "lead" ? validateLead(cards) : validateAnswer(cards);
          if (error) return;
          queueGuestPlay(cards);
          return;
        }
        if (action === "clear") {
          onlinePendingSelection = null;
          onlinePendingPlay = null;
          clearSelection();
        }
        sendOnlineAction(action);
        return;
      }
      if (action === "continue") scheduleAction(continueTurn);
      if (action === "play") scheduleAction(playSelectedCards);
      if (action === "clear") clearSelection();
      if (action === "claim") scheduleAction(claimPoints);
      if (action === "bura") scheduleAction(declareBura);
      if (action === "maliutka") scheduleAction(declareMaliutka);
      if (action === "offer") scheduleAction(offerIncrease);
      if (action === "accept-offer") scheduleAction(() => respondToOffer(true));
      if (action === "decline-offer") scheduleAction(() => respondToOffer(false));
      if (action === "setup") showSetup();
    });
  });
}

function renderCard(card, options = {}) {
  const classNames = [
    "playing-card",
    options.compact ? "compact-card" : "",
    options.table ? "table-card" : "",
    options.trumpDisplay ? "trump-display-card" : "",
    options.entering ? "entering-card" : "",
    options.interactive ? "interactive-card" : "",
    options.selected ? "selected" : "",
    card?.color === "red" ? "red" : "black",
    card?.suit === state.trumpSuit ? "trump" : ""
  ].filter(Boolean).join(" ");

  const label = formatCard(card);
  const cardContent = `
    <img class="card-image" src="${cardAssetPath(card)}" alt="${label}">
  `;

  if (options.interactive) {
    return `
      <button class="${classNames}" type="button" data-card-id="${card.id}" aria-pressed="${options.selected ? "true" : "false"}" aria-label="${label}">
        ${cardContent}
      </button>
    `;
  }

  return `<div class="${classNames}" aria-label="${label}">${cardContent}</div>`;
}

function cardAssetPath(card) {
  return `assets/cards/${card.suit}-${card.rank.toLowerCase()}.svg`;
}

function formatCard(card) {
  return `${card.rank} of ${card.suitName}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

document.querySelector("#start-button").addEventListener("click", startGame);
document.querySelector("#restart-button").addEventListener("click", showSetup);
document.querySelector("#play-again-button").addEventListener("click", requestRematch);
elements.matchTarget.addEventListener("input", () => {
  document.querySelector("#match-target-value").value = elements.matchTarget.value;
  document.querySelector("#match-target-value").textContent = elements.matchTarget.value;
});

elements.onlineMode?.addEventListener("change", () => {
  const enabled = elements.onlineMode.checked;
  elements.onlineFields.hidden = !enabled;
  elements.opponentModeLabel.textContent = enabled ? "Online game" : "Dummy opponent";
  elements.opponentModeDetail.textContent = enabled ? "Invite another player with a code" : "Play against the development opponent";
  elements.createdCode.hidden = true;
  elements.createdCodeValue.textContent = "";
  setOnlineStatus(enabled ? "Leave the code empty to create a game, or enter a code to join." : "");
});

elements.roomCode?.addEventListener("input", () => {
  const hasCode = elements.roomCode.value.trim().length > 0;
  elements.startButton.textContent = hasCode ? "კოდით შესვლა" : uiLabel("preGame", "dealCards");
  if (hasCode) {
    elements.createdCode.hidden = true;
    setOnlineStatus("");
  }
});

elements.currentLane.addEventListener("click", (event) => {
  const button = event.target.closest("[data-card-id]");
  if (button) toggleCard(button.dataset.cardId);
});

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("service-worker.js");
}

showSetup();
