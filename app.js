const TARGET_POINTS = 61;
const HAND_SIZE = 5;
const MOVE_DELAY_MS = 200;
const CLEARANCE_MS_PER_CARD = 500;
const DEAL_SUMMARY_MS = 5000;
const DEAL_SCORE_TRANSFER_DELAY_MS = 250;
const DEAL_SCORE_POPUP_MS = 1050;
const DEAL_SCORE_WEIGHT_RESET_MS = 520;
const DEAL_SCORE_POINT_INTERVAL_MS = 430;
const MATCH_SUMMARY_MS = 10000;
const BURA_REVEAL_MS = 2000;
const ONLINE_SYNC_INTERVAL_MS = 1500;
const ONLINE_INACTIVITY_MS = 5 * 60 * 1000;
const ONLINE_SESSION_KEY = "bura-online-session-v1";
const HOST_OWNER_ID_STORAGE_KEY = "bura-host-owner-v1";
const MAX_WAITING_ROOMS_PER_HOST = 3;
const THEME_STORAGE_KEY = "bura-theme-v1";
const THEME_NAMES = ["green", "red", "blue"];
const THEME_META_COLORS = {
  green: "#0f201a",
  red: "#241011",
  blue: "#0d192d"
};
const LABEL_FONT_KEYS = [
  "regular", "ui", "display", "square", "squareCaps", "glahoBold",
  "glahoWeb", "arialGeo", "alkSanet", "alkDots", "archyEdtBold", "bpgWeb002Caps"
];

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
  appShell: document.querySelector(".app-shell"),
  setupPanel: document.querySelector("#setup-panel"),
  gamePanel: document.querySelector("#game-panel"),
  dealScoreDimmer: document.querySelector("#deal-score-dimmer"),
  resultPanel: document.querySelector("#result-panel"),
  brandHeading: document.querySelector("#brand-heading"),
  opponentLane: document.querySelector("#opponent-lane"),
  currentLane: document.querySelector("#current-lane"),
  trumpCard: document.querySelector("#trump-card"),
  stockCount: document.querySelector("#stock-count"),
  playerOneRow: document.querySelector("#player-one-row"),
  playerTwoRow: document.querySelector("#player-two-row"),
  matchPanel: document.querySelector("#match-panel"),
  actionButtons: null,
  resultKicker: document.querySelector("#result-kicker"),
  resultTitle: document.querySelector("#result-title"),
  resultDetail: document.querySelector("#result-detail"),
  resultScores: document.querySelector("#result-scores"),
  resultCountdown: document.querySelector("#result-countdown"),
  resultExitButton: document.querySelector("#result-exit-button"),
  playAgainButton: document.querySelector("#play-again-button"),
  playerOneName: document.querySelector("#player-one-name"),
  onlineMode: document.querySelector("#online-mode"),
  onlineFields: document.querySelector("#online-fields"),
  roomCode: document.querySelector("#room-code"),
  opponentModeLabel: document.querySelector("#opponent-mode-label"),
  opponentModeDetail: document.querySelector("#opponent-mode-detail"),
  onlineStatus: document.querySelector("#online-status"),
  lobbyPanel: document.querySelector("#lobby-panel"),
  lobbyList: document.querySelector("#lobby-list"),
  lobbyOpenButton: document.querySelector("#lobby-open-button"),
  lobbyActiveButton: document.querySelector("#lobby-active-button"),
  lobbyRefreshButton: document.querySelector("#lobby-refresh-button"),
  createdCode: document.querySelector("#created-code"),
  createdCodeValue: document.querySelector("#created-code-value"),
  reconnectButton: document.querySelector("#reconnect-button"),
  syncButton: document.querySelector("#sync-button"),
  startButton: document.querySelector("#start-button"),
  easyPlay: document.querySelector("#easy-play-toggle")
    || document.querySelector('input[name="play-mode"][value="easy"]'),
  matchTarget: document.querySelector("#match-target")
};

function labelDefinition(group, key) {
  return window.BURA_LABELS?.[group]?.[key];
}

function uiLabel(group, key, variables = {}) {
  const definition = labelDefinition(group, key);
  const value = typeof definition === "object" ? definition.text : definition ?? key;
  return String(value).replace(/\{\{(\w+)\}\}/g, (_, name) => variables[name] ?? "");
}

function labelStyleFor(group, key) {
  const definition = labelDefinition(group, key);
  if (definition && typeof definition === "object") {
    return {
      font: definition.font ?? "regular",
      weight: definition.weight ?? 400,
      size: definition.size ?? null
    };
  }

  return { font: "regular", weight: 400, size: null };
}

function labelFontKey(group, key) {
  const configuredFont = labelStyleFor(group, key).font ?? "regular";
  return LABEL_FONT_KEYS.includes(configuredFont) ? configuredFont : "regular";
}

function labelWeight(group, key) {
  const weight = labelStyleFor(group, key).weight;
  return weight === null || weight === undefined || weight === "" ? null : String(weight);
}

function labelSize(group, key) {
  const size = labelStyleFor(group, key).size;
  if (typeof size === "number" && Number.isFinite(size)) return `${size}px`;
  return typeof size === "string" && size.trim() ? size.trim() : null;
}

function labelFontClass(group, key) {
  return `label-font-${labelFontKey(group, key)}`;
}

function applyLabelStyle(element, group, key) {
  element.classList.remove(...LABEL_FONT_KEYS.map((font) => `label-font-${font}`));
  element.classList.add(labelFontClass(group, key));
  const weight = labelWeight(group, key);
  if (weight === null) element.style.removeProperty("font-weight");
  else element.style.fontWeight = weight;
  const size = labelSize(group, key);
  if (size === null) element.style.removeProperty("font-size");
  else element.style.fontSize = size;
  element.lang = "ka";
}

function setLabelText(element, group, key, variables = {}) {
  element.textContent = uiLabel(group, key, variables);
  applyLabelStyle(element, group, key);
}

function labelMarkup(group, key, variables = {}, text = uiLabel(group, key, variables)) {
  const weight = labelWeight(group, key);
  const size = labelSize(group, key);
  const style = [
    weight === null ? "" : `font-weight: ${escapeHtml(weight)};`,
    size === null ? "" : `font-size: ${escapeHtml(size)};`
  ].filter(Boolean).join(" ");
  const styleAttribute = style ? ` style="${style}"` : "";
  return `<span class="${labelFontClass(group, key)}" lang="ka"${styleAttribute}>${escapeHtml(text)}</span>`;
}

function playerNameMarkup(playerIndex, name) {
  const nameKey = playerIndex === 0 ? "playerOne" : "playerTwo";
  return labelMarkup("preGame", nameKey, {}, name);
}

function applyStaticLabels() {
  document.title = uiLabel("preGame", "appTitle");
  document.querySelectorAll("[data-label]").forEach((element) => {
    const [group, key] = element.dataset.label.split(".");
    setLabelText(element, group, key);
  });
  document.querySelectorAll("[data-label-attr], [data-label-attr-title]").forEach((element) => {
    [element.dataset.labelAttr, element.dataset.labelAttrTitle].filter(Boolean).forEach((entry) => {
      const [attribute, path] = entry.split(":");
      if (!attribute || !path) return;
      const [group, key] = path.split(".");
      if (!group || !key) return;
      element.setAttribute(attribute, uiLabel(group, key));
      if (attribute === "placeholder") applyLabelStyle(element, group, key);
    });
  });
}

applyStaticLabels();

function getSavedTheme() {
  try {
    const theme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return THEME_NAMES.includes(theme) ? theme : "green";
  } catch (error) {
    return "green";
  }
}

function setTheme(theme) {
  if (!THEME_NAMES.includes(theme)) return;
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_META_COLORS[theme]);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    // The theme still applies for the current session when storage is unavailable.
  }
  document.querySelectorAll("[data-theme-choice]").forEach((button) => {
    const selected = button.dataset.themeChoice === theme;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}

setTheme(getSavedTheme());

let state = createEmptyState();
let audioContext = null;
const CARD_HIT_SOURCES = Array.from(
  { length: 22 },
  (_, index) => `assets/sound/cardonmat/CM${index + 1}.wav`
);
const DEAL_WIN_SOUND_SOURCE = "assets/sound/dealwin.mp3";
const INCREASE_OFFER_SOUND_SOURCE = "assets/sound/increaseoffer.wav";
const ENTER_GAME_SOUND_SOURCE = "assets/sound/entergame.mp3";
const MATCH_WIN_SOUND_SOURCE = "assets/sound/matchwon.wav";
const MATCH_LOSS_SOUND_SOURCE = "assets/sound/matchlost.wav";
const POINTS_UP_SOUND_SOURCE = "assets/sound/pointsup.wav";
const POINTS_DOWN_SOUND_SOURCE = "assets/sound/pointsdown.wav";
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
let onlineSoundSnapshot = null;
let matchSummaryTimer = null;
let matchSummaryCountdownTimer = null;
let dealScoreAnimationFrame = null;
let dealScorePopupTimer = null;
let dealScoreWeightResetTimer = null;
let dealScoreTransferTimer = null;
let dealScorePopupSoundKey = "";
let onlineRematchStarting = false;
let onlineApplyingRemoteAction = false;
let onlineSyncTimer = null;
let onlineSyncInFlight = false;
let onlineLatestRoomUpdate = 0;
let onlinePendingRemoteActionSeq = 0;
let onlineClearedActionSeq = 0;
let onlineLastLeadActivityKey = "";
let openingTurnSignalTimer = null;
let matchStartSoundPlayed = false;
let lobbyRooms = [];
let lobbyRefreshTimer = null;
let lobbyRefreshing = false;
let lobbyRequestId = 0;
let lobbyView = "open";
let hostOwnerId = null;
let hostedRoomsChannel = null;
let hostedRoomStartInFlight = false;
let onlineRoomCreationInFlight = false;

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

function readOnlineSession() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(ONLINE_SESSION_KEY));
    if (!saved?.roomId || !saved?.code || !saved?.role || !saved?.playerName) return null;
    return saved;
  } catch (error) {
    return null;
  }
}

function saveOnlineSession(room, role, playerName) {
  try {
    window.localStorage.setItem(ONLINE_SESSION_KEY, JSON.stringify({
      roomId: room.id,
      code: room.code,
      role,
      playerName
    }));
  } catch (error) {
    // Reconnection remains available with a room code when storage is unavailable.
  }
  updateOnlineConnectionControls();
}

function clearOnlineSession(roomId = null) {
  try {
    const saved = readOnlineSession();
    if (!roomId || saved?.roomId === roomId) {
      window.localStorage.removeItem(ONLINE_SESSION_KEY);
    }
  } catch (error) {
    // The setup screen still works when local storage is unavailable.
  }
  updateOnlineConnectionControls();
}

function isRoomExpired(room) {
  const expiresAt = Date.parse(room?.expires_at || "");
  return room?.status === "expired"
    || (Number.isFinite(expiresAt) && expiresAt <= Date.now());
}

function leaveExpiredOnlineRoom(room) {
  if (!isRoomExpired(room)) return false;
  if (onlineClient && room.status !== "expired") {
    void onlineClient.from("bura_rooms")
      .update({ status: "expired", action: null })
      .eq("id", room.id)
      .neq("status", "expired");
  }
  clearOnlineSession(room.id);
  showSetup();
  setOnlineStatus(uiLabel("preGame", "roomExpired"), "error");
  return true;
}

function updateOnlineConnectionControls() {
  const saved = readOnlineSession();
  if (elements.reconnectButton) {
    elements.reconnectButton.hidden = !saved || onlineEnabled();
    if (saved) {
      elements.reconnectButton.textContent = `${uiLabel("preGame", "reconnect")} ${saved.code}`;
      applyLabelStyle(elements.reconnectButton, "preGame", "reconnect");
    }
  }
  if (elements.syncButton) elements.syncButton.hidden = !onlineEnabled();
}

function useSavedSessionDetails(session) {
  if (!session) return;
  elements.onlineMode.checked = true;
  elements.onlineFields.hidden = false;
  elements.opponentModeLabel.textContent = uiLabel("preGame", "onlineGame");
  elements.opponentModeDetail.textContent = uiLabel("preGame", "onlineGameDetail");
  elements.playerOneName.value = session.playerName;
  elements.roomCode.value = session.code;
  setLabelText(elements.startButton, "preGame", "joinWithCode");
}

function makeRoomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

function getHostOwnerId() {
  if (hostOwnerId) return hostOwnerId;
  try {
    const savedOwnerId = window.localStorage.getItem(HOST_OWNER_ID_STORAGE_KEY);
    if (savedOwnerId) {
      hostOwnerId = savedOwnerId;
      return hostOwnerId;
    }
  } catch (error) {
    // A temporary id still allows the current browser session to host rooms.
  }

  hostOwnerId = window.crypto?.randomUUID?.()
    || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  try {
    window.localStorage.setItem(HOST_OWNER_ID_STORAGE_KEY, hostOwnerId);
  } catch (error) {
    // The temporary id remains available for this page session.
  }
  return hostOwnerId;
}

function isOwnedWaitingRoom(room) {
  return room?.settings?.hostOwnerId === getHostOwnerId()
    || (room?.id === onlineRoom?.id && state.onlineRole === "host");
}

function easyPlayFor(playerIndex) {
  if (Array.isArray(state.easyPlayByPlayer) && typeof state.easyPlayByPlayer[playerIndex] === "boolean") {
    return state.easyPlayByPlayer[playerIndex];
  }
  return Boolean(state.easyPlay);
}

function roomEasyPlayByPlayer(room, assignment) {
  const settings = room?.settings || {};
  const legacyMode = typeof settings.easyPlay === "boolean" ? settings.easyPlay : true;
  const hostMode = typeof settings.hostEasyPlay === "boolean" ? settings.hostEasyPlay : legacyMode;
  const guestMode = typeof settings.guestEasyPlay === "boolean" ? settings.guestEasyPlay : legacyMode;
  const modes = [];
  modes[assignment.hostIndex] = hostMode;
  modes[assignment.guestIndex] = guestMode;
  return modes;
}

async function getOwnedWaitingRooms(client) {
  const { data, error } = await client.from("bura_rooms")
    .select("id, code, host_name, settings, created_at, expires_at")
    .eq("status", "waiting")
    .is("guest_name", null)
    .gt("expires_at", new Date().toISOString());
  if (error) return null;
  return (data || []).filter(isOwnedWaitingRoom);
}

async function closeOtherHostedWaitingRooms(client, joinedRoom) {
  const ownerId = joinedRoom?.settings?.hostOwnerId;
  if (!ownerId) return;
  const { data, error } = await client.from("bura_rooms")
    .select("id, settings")
    .eq("status", "waiting")
    .is("guest_name", null);
  if (error) return;

  const roomIds = (data || [])
    .filter((room) => room.id !== joinedRoom.id && room.settings?.hostOwnerId === ownerId)
    .map((room) => room.id);
  if (!roomIds.length) return;

  await client.from("bura_rooms")
    .update({ status: "finished", action: null })
    .in("id", roomIds)
    .eq("status", "waiting")
    .is("guest_name", null);
}

function onlineEnabled() {
  return Boolean(state.online && onlineRoom && onlineClient);
}

function renderLobby() {
  if (!elements.lobbyPanel || !elements.lobbyList) return;
  const hostingWaitingRoom = onlineRoom?.status === "waiting" && state.onlineRole === "host";
  const visible = Boolean(elements.onlineMode?.checked) && (!onlineRoom || hostingWaitingRoom);
  elements.lobbyPanel.hidden = !visible;
  if (!visible) return;

  elements.lobbyOpenButton?.classList.toggle("is-active", lobbyView === "open");
  elements.lobbyActiveButton?.classList.toggle("is-active", lobbyView === "active");

  if (lobbyRefreshing) {
    elements.lobbyList.innerHTML = `<p class="lobby-empty">${labelMarkup("preGame", "lobbyLoading")}</p>`;
    return;
  }
  if (!lobbyRooms.length) {
    elements.lobbyList.innerHTML = `<p class="lobby-empty">${labelMarkup("preGame", "lobbyEmpty")}</p>`;
    return;
  }

  elements.lobbyList.innerHTML = lobbyRooms.map((room) => {
    const matchTarget = Number(room.settings?.matchTarget) || 3;
    const isActiveRoom = room.status === "playing";
    const isOwnWaitingRoom = isOwnedWaitingRoom(room);
    const playerNames = isActiveRoom
      ? `<div class="lobby-room-players"><strong>${escapeHtml(room.host_name)}</strong><span aria-hidden="true">/</span><strong>${escapeHtml(room.guest_name)}</strong></div>`
      : `<strong>${escapeHtml(room.host_name)}</strong>`;
    return `
      <article class="lobby-room">
        <div class="lobby-room-info">
          ${playerNames}
          <span>${isActiveRoom ? `${labelMarkup("preGame", "lobbyPlaying")} / ` : ""}${labelMarkup("preGame", "lobbyMatch", { points: matchTarget })}</span>
        </div>
        ${isActiveRoom
          ? ""
          : isOwnWaitingRoom
            ? `<div class="lobby-room-actions">
                <span class="lobby-room-status">${labelMarkup("preGame", "lobbyHosting")}</span>
                <button class="lobby-room-code" type="button" data-lobby-copy-code="${room.code}" aria-label="${uiLabel("preGame", "copyGameCode", { code: room.code })}">${escapeHtml(room.code)}</button>
                <button class="secondary-button lobby-cancel-button" type="button" data-lobby-cancel-id="${room.id}">${labelMarkup("preGame", "lobbyCancel")}</button>
              </div>`
            : `<button class="secondary-button lobby-join-button" type="button" data-lobby-room-id="${room.id}">${labelMarkup("preGame", "lobbyJoin")}</button>`}
      </article>
    `;
  }).join("");
}

async function refreshLobby() {
  if (!elements.onlineMode?.checked) {
    lobbyRooms = [];
    renderLobby();
    return;
  }
  const client = getOnlineClient();
  if (!client) {
    lobbyRooms = [];
    renderLobby();
    return;
  }
  const requestId = ++lobbyRequestId;
  lobbyRefreshing = true;
  renderLobby();
  const isOpenView = lobbyView === "open";
  const activeQuery = client.from("bura_rooms")
    .select("id, code, host_name, guest_name, settings, status, created_at, expires_at")
    .eq("status", "playing")
    .not("guest_name", "is", null)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(12);
  const openQuery = client.from("bura_rooms")
    .select("id, code, host_name, guest_name, settings, status, created_at, expires_at")
    .eq("status", "waiting")
    .is("guest_name", null)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(12);
  const [roomResult, ownedWaitingRooms] = await Promise.all([
    isOpenView ? openQuery : activeQuery,
    isOpenView ? getOwnedWaitingRooms(client) : Promise.resolve([])
  ]);
  if (requestId !== lobbyRequestId) return;
  lobbyRefreshing = false;
  if (roomResult.error) {
    lobbyRooms = [];
    renderLobby();
    return;
  }
  const roomsById = new Map((roomResult.data || []).map((room) => [room.id, room]));
  (ownedWaitingRooms || []).forEach((room) => roomsById.set(room.id, room));
  lobbyRooms = [...roomsById.values()]
    .sort((first, second) => Date.parse(second.created_at) - Date.parse(first.created_at));
  renderLobby();
}

function startLobbyUpdates() {
  if (!elements.onlineMode?.checked) return;
  if (lobbyRefreshTimer !== null) return;
  void refreshLobby();
  subscribeHostedWaitingRooms();
  lobbyRefreshTimer = window.setInterval(() => void refreshLobby(), 10000);
}

function stopLobbyUpdates() {
  if (lobbyRefreshTimer !== null) window.clearInterval(lobbyRefreshTimer);
  lobbyRefreshTimer = null;
  lobbyRefreshing = false;
  lobbyRooms = [];
  stopHostedWaitingRooms();
  renderLobby();
}

function subscribeHostedWaitingRooms() {
  const client = getOnlineClient();
  if (!client || hostedRoomsChannel || state.phase !== "setup" || !elements.onlineMode?.checked) return;
  hostedRoomsChannel = client.channel(`bura-hosted-rooms-${getHostOwnerId()}`)
    .on("postgres_changes", {
      event: "UPDATE",
      schema: "public",
      table: "bura_rooms"
    }, ({ new: nextRoom }) => {
      void startHostedWaitingRoom(nextRoom);
    })
    .subscribe();
}

function stopHostedWaitingRooms() {
  const channel = hostedRoomsChannel;
  hostedRoomsChannel = null;
  if (channel && onlineClient) void onlineClient.removeChannel(channel);
}

async function startHostedWaitingRoom(room) {
  if (hostedRoomStartInFlight
    || state.phase !== "setup"
    || !elements.onlineMode?.checked
    || room?.status !== "waiting"
    || !room.guest_name
    || !isOwnedWaitingRoom(room)) return;

  const client = getOnlineClient();
  if (!client) return;
  hostedRoomStartInFlight = true;
  stopHostedWaitingRooms();
  try {
    await connectToOnlineRoom(client, room, "host", room.host_name);
  } finally {
    hostedRoomStartInFlight = false;
  }
}

async function joinLobbyRoom(roomId) {
  const room = lobbyRooms.find((candidate) => candidate.id === roomId);
  if (!room || room.id === onlineRoom?.id) return;
  elements.roomCode.value = room.code;
  setLabelText(elements.startButton, "preGame", "joinWithCode");
  setOnlineStatus("");
  await joinOnlineRoom();
}

async function cancelLobbyRoom(roomId) {
  const room = lobbyRooms.find((candidate) => candidate.id === roomId);
  const client = getOnlineClient();
  if (!room || !client || !isOwnedWaitingRoom(room)) return;

  const { error } = await client.from("bura_rooms")
    .update({ status: "finished", action: null })
    .eq("id", room.id)
    .eq("status", "waiting")
    .is("guest_name", null);
  if (error) {
    setOnlineStatus(uiLabel("preGame", "onlineActionFailed"), "error");
    return;
  }

  lobbyRooms = lobbyRooms.filter((candidate) => candidate.id !== room.id);
  if (room.id === onlineRoom?.id) {
    clearOnlineSession(room.id);
    showSetup();
    return;
  }
  renderLobby();
}

async function copyLobbyRoomCode(code) {
  const copyFallback = () => {
    const input = document.createElement("textarea");
    input.value = code;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.append(input);
    input.select();
    const copied = document.execCommand("copy");
    input.remove();
    return copied;
  };

  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(code);
    else if (!copyFallback()) throw new Error("Copy was unavailable");
    setOnlineStatus(uiLabel("preGame", "gameCodeCopied"), "success");
  } catch (error) {
    setOnlineStatus(uiLabel("preGame", "onlineActionFailed"), "error");
  }
}

function createEmptyState() {
  return {
    players: [
      createPlayer(uiLabel("preGame", "playerOne")),
      createPlayer(uiLabel("preGame", "playerTwo"))
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
    privacyLock: false,
    winner: null,
    matchWon: false,
    resultReason: "",
    dummyOpponent: false,
    easyPlay: false,
    easyPlayByPlayer: [false, false],
    dummyTimer: null,
    pauseTimer: null,
    actionTimer: null,
    actionPending: false,
    claimAvailableFor: null,
    hasTakenTrick: [false, false],
    matchTarget: 3,
    dealWeight: 1,
    nextOfferPlayer: null,
    localPlayerIndex: 0,
    offer: null,
    maliutkaPending: null,
    dealWinner: null,
    dealScoreAnimation: null,
    dealTimer: null,
    dealNumber: 0,
    online: false,
    onlineRole: null,
    onlineRoomId: null,
    onlineRoomCode: null,
    onlineAssignment: null,
    processedActionSeq: 0,
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
  stopLobbyUpdates();
  setDealScoreSummaryVisible(false);
  onlineSoundSnapshot = null;
  onlineLastLeadActivityKey = "";
  clearOpeningTurnSignal();
  if (!onlineOptions.isRematch) matchStartSoundPlayed = false;
  clearMatchSummaryTimers();
  if (state.pauseTimer !== null) window.clearTimeout(state.pauseTimer);
  if (state.actionTimer !== null) window.clearTimeout(state.actionTimer);
  if (state.dealTimer !== null) window.clearTimeout(state.dealTimer);
  const deck = shuffle(buildDeck());
  const hostName = onlineOptions.hostName || elements.playerOneName.value.trim() || uiLabel("preGame", "playerOne");
  const guestName = onlineOptions.guestName || uiLabel("preGame", "playerTwo");
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
  const easyPlayByPlayer = Array.isArray(onlineOptions.easyPlayByPlayer)
    ? onlineOptions.easyPlayByPlayer.map((value) => Boolean(value))
    : [Boolean(elements.easyPlay.checked), Boolean(elements.easyPlay.checked)];

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
    privacyLock: false,
    winner: null,
    matchWon: false,
    resultReason: "",
    dummyOpponent: onlineOptions.dummyOpponent ?? !elements.onlineMode.checked,
    easyPlay: elements.easyPlay.checked,
    easyPlayByPlayer,
    dummyTimer: null,
    pauseTimer: null,
    actionTimer: null,
    actionPending: false,
    claimAvailableFor: null,
    hasTakenTrick: [false, false],
    matchTarget,
    dealWeight: 1,
    nextOfferPlayer: null,
    localPlayerIndex: onlineOptions.localPlayerIndex ?? 0,
    offer: null,
    maliutkaPending: null,
    dealWinner: null,
    dealScoreAnimation: null,
    dealTimer: null,
    dealNumber: 1,
    online: Boolean(onlineOptions.online),
    onlineRole: onlineOptions.onlineRole || null,
    onlineRoomId: onlineOptions.onlineRoomId || null,
    onlineRoomCode: onlineOptions.onlineRoomCode || null,
    onlineAssignment: onlineOptions.onlineAssignment || null,
    processedActionSeq: onlineOptions.processedActionSeq ?? 0,
    rematchDeadline: null,
    openingTurnSignal: true
  };


  elements.setupPanel.hidden = true;
  elements.resultPanel.hidden = true;
  elements.brandHeading.hidden = true;
  elements.gamePanel.hidden = false;
  render();
  startOpeningTurnSignal();
  if (!onlineOptions.isRematch) playMatchStartSound();
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
    hostEasyPlay: Boolean(elements.easyPlay.checked),
    matchTarget: Number(elements.matchTarget.value),
    hostOwnerId: getHostOwnerId()
  };
}

function getLeadActivityKey(source) {
  const trick = source?.trick;
  if (source?.phase !== "answer" || !trick?.leadCards?.length || trick.leadPlayer === null || trick.leadPlayer === undefined) {
    return "";
  }
  return `${source.dealNumber}:${trick.leadPlayer}:${trick.leadCards.map((card) => card.id).join("|")}`;
}

function getNextOnlineExpiry() {
  return new Date(Date.now() + ONLINE_INACTIVITY_MS).toISOString();
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
  if (onlineRoomCreationInFlight) return;
  const client = getOnlineClient();
  if (!client) {
    setOnlineStatus(uiLabel("preGame", "onlineUnavailable"), "error");
    return;
  }
  onlineRoomCreationInFlight = true;
  elements.startButton.disabled = true;
  try {
    const ownedWaitingRooms = await getOwnedWaitingRooms(client);
    if (ownedWaitingRooms === null) {
      setOnlineStatus(uiLabel("preGame", "onlineActionFailed"), "error");
      return;
    }
    if (ownedWaitingRooms.length >= MAX_WAITING_ROOMS_PER_HOST) {
      setOnlineStatus(uiLabel("preGame", "hostRoomLimit"), "error");
      return;
    }
    const hostName = elements.playerOneName.value.trim() || uiLabel("preGame", "playerOne");
    const code = makeRoomCode();
    const { error } = await client.from("bura_rooms").insert({
      code,
      host_name: hostName,
      settings: onlineSettings(),
      status: "waiting"
    }).select().single();
    if (error) {
      setOnlineStatus(uiLabel("preGame", "onlineCreateFailed"), "error");
      return;
    }
    clearOnlineSession();
    elements.createdCode.hidden = true;
    elements.createdCodeValue.textContent = "";
    setOnlineStatus(uiLabel("preGame", "onlineWaiting"), "success");
    await refreshLobby();
    startLobbyUpdates();
  } finally {
    onlineRoomCreationInFlight = false;
    if (state.phase === "setup" && elements.onlineMode?.checked) elements.startButton.disabled = false;
  }
}

function samePlayerName(first, second) {
  return Boolean(first && second) && first.trim().toLowerCase() === second.trim().toLowerCase();
}

function reconnectRoleForRoom(room, playerName) {
  const saved = readOnlineSession();
  if (saved?.roomId === room.id) return saved.role;
  if (room.guest_name && samePlayerName(room.guest_name, playerName)) return "guest";
  if (room.guest_name && samePlayerName(room.host_name, playerName) && !samePlayerName(room.guest_name, playerName)) return "host";
  return null;
}

async function connectToOnlineRoom(client, room, role, playerName) {
  if (leaveExpiredOnlineRoom(room)) return;
  onlineClient = client;
  onlineRoom = room;
  onlineLastActionSeq = room.action_seq || 0;
  onlineLatestRoomUpdate = Date.parse(room.updated_at || "") || 0;
  const acknowledgedActionSeq = Number(room.game_state?.processedActionSeq) || 0;
  onlineProcessedActionSeq = role === "host" ? acknowledgedActionSeq : room.action_seq || 0;
  onlinePendingRemoteActionSeq = 0;
  onlineClearedActionSeq = 0;
  onlineLastLeadActivityKey = getLeadActivityKey(room.game_state);
  stopLobbyUpdates();
  state.online = true;
  state.onlineRole = role;
  state.onlineRoomId = room.id;
  state.onlineRoomCode = room.code;
  state.processedActionSeq = acknowledgedActionSeq;
  saveOnlineSession(room, role, playerName);
  elements.startButton.disabled = true;

  if (room.game_state) {
    applyOnlineState(room.game_state);
  } else if (role === "host") {
    elements.createdCodeValue.textContent = room.code;
    elements.createdCode.hidden = false;
    setOnlineStatus(room.guest_name ? uiLabel("preGame", "onlineRestoring") : uiLabel("preGame", "onlineWaiting"), "success");
    if (room.guest_name) startHostedRoomGame(room);
  } else {
    setOnlineStatus(uiLabel("preGame", "onlineJoined", { code: room.code }), "success");
  }

  await subscribeOnlineRoom();
}

async function joinOnlineRoom() {
  const client = getOnlineClient();
  const code = elements.roomCode.value.trim().toUpperCase();
  const guestName = elements.playerOneName.value.trim() || uiLabel("preGame", "playerTwo");
  if (!client) {
    setOnlineStatus(uiLabel("preGame", "onlineUnavailable"), "error");
    return;
  }
  if (!/^[A-Z0-9]{6}$/.test(code)) {
    setOnlineStatus(uiLabel("preGame", "invalidGameCode"), "error");
    return;
  }
  const { data, error } = await client.from("bura_rooms").select("*").eq("code", code).maybeSingle();
  if (error || !data) {
    setOnlineStatus(uiLabel("preGame", "gameNotFound"), "error");
    return;
  }
  if (leaveExpiredOnlineRoom(data)) return;

  const reconnectRole = reconnectRoleForRoom(data, guestName);
  if (reconnectRole) {
    await connectToOnlineRoom(client, data, reconnectRole, guestName);
    return;
  }

  if (data.guest_name) {
    setOnlineStatus(uiLabel("preGame", "gameFull"), "error");
    return;
  }
  if (data.status !== "waiting") {
    setOnlineStatus(uiLabel("preGame", "gameNotFound"), "error");
    return;
  }
  const joinedSettings = {
    ...(data.settings || {}),
    guestEasyPlay: Boolean(elements.easyPlay.checked)
  };
  const { data: joined, error: joinError } = await client.from("bura_rooms")
    .update({ guest_name: guestName, settings: joinedSettings })
    .eq("id", data.id)
    .is("guest_name", null)
    .select().single();
  if (joinError || !joined) {
    setOnlineStatus(uiLabel("preGame", "gameJustJoined"), "error");
    return;
  }
  await closeOtherHostedWaitingRooms(client, joined);
  await connectToOnlineRoom(client, joined, "guest", guestName);
}

async function reconnectSavedRoom() {
  const session = readOnlineSession();
  const client = getOnlineClient();
  if (!session || !client) {
    setOnlineStatus(uiLabel("preGame", "reconnectNeedsCode"), "error");
    return;
  }

  useSavedSessionDetails(session);
  setOnlineStatus(uiLabel("preGame", "reconnecting"), "success");
  const { data, error } = await client.from("bura_rooms")
    .select("*")
    .eq("id", session.roomId)
    .eq("code", session.code)
    .maybeSingle();
  if (error || !data) {
    setOnlineStatus(uiLabel("preGame", "savedGameUnavailable"), "error");
    return;
  }
  if (leaveExpiredOnlineRoom(data)) return;
  if (session.role === "host" && data.status === "waiting" && !data.guest_name) {
    clearOnlineSession(data.id);
    setOnlineStatus(uiLabel("preGame", "onlineWaiting"), "success");
    startLobbyUpdates();
    return;
  }
  await connectToOnlineRoom(client, data, session.role, session.playerName);
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
    .subscribe((status, error) => {
      if (status === "SUBSCRIBED") refreshOnlineRoom();
      if ((status === "CHANNEL_ERROR" || status === "TIMED_OUT") && error) setOnlineStatus(uiLabel("preGame", "liveSyncReconnecting"), "error");
    });
  startOnlineSync();
  await refreshOnlineRoom();
}

async function refreshOnlineRoom() {
  if (!onlineRoom || !onlineClient || onlineSyncInFlight) return;
  onlineSyncInFlight = true;
  const roomId = onlineRoom.id;
  try {
    const { data, error } = await onlineClient.from("bura_rooms").select("*").eq("id", roomId).maybeSingle();
    if (error) {
      setOnlineStatus(uiLabel("preGame", "onlineActionFailed"), "error");
      return;
    }
    if (!data || onlineRoom?.id !== roomId) return;
    handleOnlineRoomUpdate(data);
  } finally {
    onlineSyncInFlight = false;
  }
}

function startOnlineSync() {
  if (onlineSyncTimer !== null) window.clearInterval(onlineSyncTimer);
  onlineSyncTimer = window.setInterval(refreshOnlineRoom, ONLINE_SYNC_INTERVAL_MS);
}

function stopOnlineSync() {
  if (onlineSyncTimer === null) return;
  window.clearInterval(onlineSyncTimer);
  onlineSyncTimer = null;
}

function startHostedRoomGame(room) {
  const savedAssignment = room.settings?.assignment;
  const hasSavedAssignment = [0, 1].includes(savedAssignment?.hostIndex)
    && [0, 1].includes(savedAssignment?.guestIndex)
    && savedAssignment.hostIndex !== savedAssignment.guestIndex;
  const sameNames = samePlayerName(room.host_name, room.guest_name);
  const hostPlayerIndex = hasSavedAssignment
    ? savedAssignment.hostIndex
    : sameNames && Math.random() >= 0.5 ? 1 : 0;
  const onlineAssignment = hasSavedAssignment
    ? savedAssignment
    : { hostIndex: hostPlayerIndex, guestIndex: 1 - hostPlayerIndex };

  if (Number.isFinite(room.settings?.matchTarget)) {
    elements.matchTarget.value = room.settings.matchTarget;
    document.querySelector("#match-target-value").value = room.settings.matchTarget;
    document.querySelector("#match-target-value").textContent = room.settings.matchTarget;
  }
  if (!hasSavedAssignment) {
    onlineRoom.settings = { ...(room.settings || {}), assignment: onlineAssignment };
    onlineClient.from("bura_rooms").update({ settings: onlineRoom.settings }).eq("id", room.id);
  }

  startLocalGame({
    online: true,
    onlineRole: "host",
    onlineRoomId: room.id,
    onlineRoomCode: room.code,
    hostName: room.host_name,
    guestName: room.guest_name,
    hostPlayerIndex: onlineAssignment.hostIndex,
    localPlayerIndex: onlineAssignment.hostIndex,
    onlineAssignment,
    easyPlayByPlayer: roomEasyPlayByPlayer(room, onlineAssignment),
    processedActionSeq: state.processedActionSeq ?? 0
  });
}

function handleOnlineRoomUpdate(nextRoom) {
  if (leaveExpiredOnlineRoom(nextRoom)) return;
  const nextUpdatedAt = Date.parse(nextRoom.updated_at || "") || 0;
  if (nextUpdatedAt && nextUpdatedAt < onlineLatestRoomUpdate) return;
  if (nextUpdatedAt) onlineLatestRoomUpdate = nextUpdatedAt;
  onlineRoom = nextRoom;
  const acknowledgedActionSeq = Math.max(
    onlineProcessedActionSeq,
    Number(state.processedActionSeq) || 0,
    onlinePendingRemoteActionSeq
  );
  if (state.onlineRole === "host" && nextRoom.action && nextRoom.action_seq > acknowledgedActionSeq) {
    handleRemoteOnlineAction(nextRoom.action, nextRoom.action_seq);
  }
  if (nextRoom.status === "finished" && state.phase === "setup" && !nextRoom.guest_name) {
    clearOnlineSession(nextRoom.id);
    showSetup();
    return;
  }
  if (state.onlineRole === "host" && nextRoom.guest_name && state.phase === "setup") {
    void closeOtherHostedWaitingRooms(onlineClient, nextRoom);
    startHostedRoomGame(nextRoom);
    return;
  }
  if (state.onlineRole !== "host" && nextRoom.game_state) applyOnlineState(nextRoom.game_state);
  if (nextRoom.status === "rematch_waiting") {
    const mine = state.onlineRole === "host" ? nextRoom.host_rematch : nextRoom.guest_rematch;
    const other = state.onlineRole === "host" ? nextRoom.guest_rematch : nextRoom.host_rematch;
    setOnlineStatus(
      other
        ? uiLabel("preGame", "rematchBothAgreed")
        : mine
          ? uiLabel("game", "rematchWaiting")
          : uiLabel("preGame", "rematchRequested"),
      "success"
    );
    if (nextRoom.host_rematch && nextRoom.guest_rematch && state.onlineRole === "host" && !onlineRematchStarting) {
      window.setTimeout(() => startOnlineRematch(), MOVE_DELAY_MS);
    }
  }
}

function acknowledgeRemoteOnlineAction(actionSeq) {
  if (!actionSeq) return;
  onlineProcessedActionSeq = Math.max(onlineProcessedActionSeq, actionSeq);
  state.processedActionSeq = Math.max(Number(state.processedActionSeq) || 0, actionSeq);
  if (onlinePendingRemoteActionSeq <= actionSeq) onlinePendingRemoteActionSeq = 0;
}

function handleRemoteOnlineAction(action, actionSeq) {
  if (!onlineEnabled() || state.onlineRole !== "host") return;
  const guestIndex = state.onlineAssignment?.guestIndex ?? 1;
  onlineApplyingRemoteAction = true;
  let deferred = false;
  if (action.type === "toggle_card" && canPlayCardsFor(guestIndex)) {
    if (!state.players[guestIndex].hand.some((card) => card.id === action.cardId)) {
      acknowledgeRemoteOnlineAction(actionSeq);
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
  } else if (action.type === "continue") deferred = scheduleRemoteAction(continueTurn, guestIndex, actionSeq);
  else if (action.type === "play") {
    if (canPlayCardsFor(guestIndex) && Array.isArray(action.cardIds)) {
      state.selectedIds = action.cardIds.filter((cardId) => state.players[guestIndex].hand.some((card) => card.id === cardId));
      deferred = scheduleRemoteAction(playSelectedCards, guestIndex, actionSeq);
    }
  }
  else if (action.type === "claim") deferred = scheduleRemoteAction(claimPoints, guestIndex, actionSeq);
  else if (action.type === "bura") deferred = scheduleRemoteAction(declareBura, guestIndex, actionSeq);
  else if (action.type === "maliutka") deferred = scheduleRemoteAction(declareMaliutka, guestIndex, actionSeq);
  else if (action.type === "maliutka-continue" && canResolveMaliutkaFor(guestIndex)) deferred = scheduleRemoteAction(resolveMaliutka, guestIndex, actionSeq);
  else if (action.type === "offer" && canOfferIncreaseFor(guestIndex)) deferred = scheduleRemoteAction(offerIncrease, guestIndex, actionSeq);
  else if (action.type === "accept-offer") deferred = scheduleRemoteAction(() => respondToOffer(true), guestIndex, actionSeq);
  else if (action.type === "decline-offer") deferred = scheduleRemoteAction(() => respondToOffer(false), guestIndex, actionSeq);
  if (!deferred) acknowledgeRemoteOnlineAction(actionSeq);
  onlineApplyingRemoteAction = false;
  render();
}

function scheduleRemoteAction(action, actingPlayerIndex, actionSeq = 0) {
  if (state.actionPending || state.phase === "gameOver") return false;
  if (actionSeq) onlinePendingRemoteActionSeq = actionSeq;
  state.actionPending = true;
  render();
  state.actionTimer = window.setTimeout(() => {
    state.actionTimer = null;
    state.actionPending = false;
    const previousLocalIndex = state.localPlayerIndex;
    state.localPlayerIndex = actingPlayerIndex;
    onlineApplyingRemoteAction = true;
    action();
    acknowledgeRemoteOnlineAction(actionSeq);
    state.localPlayerIndex = previousLocalIndex;
    onlineApplyingRemoteAction = false;
    render();
  }, MOVE_DELAY_MS);
  return true;
}

function applyOnlineState(remoteState) {
  const remoteHash = JSON.stringify(remoteState);
  if (onlineAppliedStateHash === remoteHash) return;
  onlineAppliedStateHash = remoteHash;
  const wasInSetup = state.phase === "setup";
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
  playGuestSynchronizedSounds(remoteState);
  if (wasInSetup && state.dealNumber === 1 && !matchStartSoundPlayed) playMatchStartSound();
  elements.setupPanel.hidden = true;
  elements.brandHeading.hidden = true;
  if (state.phase === "gameOver") showResultPanel();
  else if (state.phase === "dealPause") showDealScoreSummary();
  else {
    setDealScoreSummaryVisible(false);
    elements.resultPanel.hidden = true;
  }
  elements.gamePanel.hidden = false;
  render();
}

function getOnlineSoundSnapshot(source) {
  const trick = source.trick || {};
  return {
    leadCards: (trick.leadCards || []).map((card) => card.id).join("|"),
    answerCards: (trick.answerCards || []).map((card) => card.id).join("|"),
    offer: source.offer ? `${source.offer.from}:${source.offer.proposedWeight}` : "",
    completedDeal: source.winner === null || source.winner === undefined
      ? ""
      : `${source.dealNumber}:${source.winner}`,
    gameOver: source.phase === "gameOver"
  };
}

function playGuestSynchronizedSounds(remoteState) {
  if (state.onlineRole !== "guest") return;
  const previous = onlineSoundSnapshot;
  const next = getOnlineSoundSnapshot(remoteState);
  onlineSoundSnapshot = next;
  if (!previous) return;

  if (next.answerCards && next.answerCards !== previous.answerCards) playTurnSound("answer");
  else if (next.leadCards && next.leadCards !== previous.leadCards) playTurnSound("lead");

  if (next.offer && next.offer !== previous.offer) playIncreaseOfferSound();
  if (next.completedDeal && next.completedDeal !== previous.completedDeal) {
    playDealWinSound();
  }
  if (next.gameOver && !previous.gameOver) playResultSound(state.winner === getAudioPlayerIndex() ? "win" : "lose");
}

function publishOnlineState() {
  if (onlineApplyingRemoteAction || onlineRematchStarting || !onlineEnabled() || state.onlineRole !== "host") return;
  const nextState = serializedState();
  const nextHash = JSON.stringify(nextState);
  if (onlineStateHash === nextHash) return;
  onlineStateHash = nextHash;
  const leadActivityKey = getLeadActivityKey(nextState);
  const hasNewLead = Boolean(leadActivityKey && leadActivityKey !== onlineLastLeadActivityKey);
  if (leadActivityKey) onlineLastLeadActivityKey = leadActivityKey;
  const roomUpdate = {
    game_state: nextState,
    status: state.phase === "gameOver" ? "finished" : "playing"
  };
  if (hasNewLead) roomUpdate.expires_at = getNextOnlineExpiry();
  onlineClient.from("bura_rooms").update(roomUpdate).eq("id", onlineRoom.id).then(({ error }) => {
    if (error) setOnlineStatus(uiLabel("preGame", "onlineActionFailed"), "error");
    else clearAcknowledgedOnlineAction(nextState.processedActionSeq);
  });
}

function clearAcknowledgedOnlineAction(actionSeq) {
  if (!actionSeq || actionSeq <= onlineClearedActionSeq || !onlineEnabled() || state.onlineRole !== "host") return;
  const roomId = onlineRoom.id;
  onlineClient.from("bura_rooms")
    .update({ action: null })
    .eq("id", roomId)
    .eq("action_seq", actionSeq)
    .then(({ error }) => {
      if (error) return;
      onlineClearedActionSeq = Math.max(onlineClearedActionSeq, actionSeq);
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
      if (error) setOnlineStatus(uiLabel("preGame", "onlineActionFailed"), "error");
    });
}

function requestRematch() {
  if (!onlineEnabled()) {
    startLocalGame();
    return;
  }

  if (getMatchSummaryRemainingMs() <= 0) return;
  const field = state.onlineRole === "host" ? "host_rematch" : "guest_rematch";
  const deadline = state.rematchDeadline || onlineRoom.rematch_deadline;
  if (!deadline) return;
  elements.playAgainButton.disabled = true;
  setLabelText(elements.playAgainButton, "game", "rematchWaiting");
  onlineRoom = {
    ...onlineRoom,
    [field]: true,
    status: "rematch_waiting",
    rematch_deadline: deadline
  };
  onlineClient.from("bura_rooms").update({ [field]: true, status: "rematch_waiting", rematch_deadline: deadline }).eq("id", onlineRoom.id).then(({ error }) => {
    if (error) setOnlineStatus(uiLabel("preGame", "onlineActionFailed"), "error");
  });
}

async function startOnlineRematch() {
  if (!onlineEnabled() || state.onlineRole !== "host" || onlineRematchStarting) return;
  onlineRematchStarting = true;
  clearMatchSummaryTimers();
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
    onlineAssignment,
    easyPlayByPlayer: state.easyPlayByPlayer,
    processedActionSeq: state.processedActionSeq ?? 0,
    isRematch: true
  });
  const nextState = serializedState();
  const roomUpdate = {
    game_state: nextState,
    status: "playing",
    host_rematch: false,
    guest_rematch: false,
    rematch_deadline: null,
    action: null,
    expires_at: getNextOnlineExpiry()
  };
  onlineStateHash = JSON.stringify(nextState);
  onlineLastLeadActivityKey = getLeadActivityKey(nextState);
  onlineRoom = { ...onlineRoom, ...roomUpdate };
  const { error } = await onlineClient.from("bura_rooms").update(roomUpdate).eq("id", onlineRoom.id);
  onlineRematchStarting = false;
  if (error) {
    onlineStateHash = "";
    setOnlineStatus(uiLabel("preGame", "onlineActionFailed"), "error");
    render();
  }
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
  clearMatchSummaryTimers();
  setDealScoreSummaryVisible(false);
  clearOpeningTurnSignal();
  matchStartSoundPlayed = false;
  if (state.pauseTimer !== null) window.clearTimeout(state.pauseTimer);
  if (state.actionTimer !== null) window.clearTimeout(state.actionTimer);
  if (state.dealTimer !== null) window.clearTimeout(state.dealTimer);
  if (onlineChannel && onlineClient) onlineClient.removeChannel(onlineChannel);
  stopOnlineSync();
  onlineChannel = null;
  onlineRoom = null;
  onlineLastActionSeq = 0;
  onlineProcessedActionSeq = 0;
  onlineLatestRoomUpdate = 0;
  onlineSyncInFlight = false;
  onlinePendingRemoteActionSeq = 0;
  onlineClearedActionSeq = 0;
  onlineStateHash = "";
  onlineAppliedStateHash = "";
  onlineActionQueue = Promise.resolve();
  onlinePendingSelection = null;
  onlinePendingPlay = null;
  onlineSoundSnapshot = null;
  hostedRoomStartInFlight = false;
  elements.createdCode.hidden = true;
  elements.createdCodeValue.textContent = "";
  elements.startButton.disabled = false;
  state = createEmptyState();
  elements.setupPanel.hidden = false;
  elements.brandHeading.hidden = false;
  elements.gamePanel.hidden = true;
  elements.resultPanel.hidden = true;
  render();
  updateOnlineConnectionControls();
  startLobbyUpdates();
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
  return state.phase !== "setup"
    && state.phase !== "gameOver"
    && state.phase !== "dealPause"
    && state.phase !== "offerPending"
    && state.phase !== "buraReveal";
}

function canPlayCardsFor(playerIndex) {
  return canAct()
    && state.activePlayer === playerIndex
    && (state.phase === "lead" || state.phase === "answer");
}

function canOfferIncreaseFor(playerIndex) {
  const reviewingWonTrick = canReviewWonTrickFor(playerIndex);
  const respondingToMaliutka = state.phase === "maliutkaPending"
    && state.maliutkaPending?.defenderIndex === playerIndex;
  return canAct()
    && !state.offer
    && state.activePlayer === playerIndex
    && (state.phase === "lead" || state.phase === "answer" || reviewingWonTrick || respondingToMaliutka)
    && state.dealWeight < 6
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
  const localPlayerIndex = state.localPlayerIndex;
  if (state.actionPending) return;
  if (easyPlayFor(localPlayerIndex) && canReviewWonTrickFor(localPlayerIndex)) {
    if (onlineEnabled() && state.onlineRole === "guest") {
      onlinePendingSelection = null;
      onlinePendingPlay = null;
      sendOnlineAction("continue");
    } else {
      scheduleAction(continueTurn);
    }
    return;
  }
  if (!canPlayCardsFor(state.localPlayerIndex)) return;
  if (onlineEnabled() && state.onlineRole === "guest") {
    const selected = new Set(state.selectedIds);
    if (selected.has(cardId)) selected.delete(cardId);
    else selected.add(cardId);
    state.selectedIds = [...selected];
    onlinePendingSelection = [...state.selectedIds];
    if (easyPlayFor(state.localPlayerIndex) && shouldAutoPlay()) {
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
  if (easyPlayFor(state.localPlayerIndex) && shouldAutoPlay()) scheduleAction(playSelectedCards);
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

function isValidLead(cards) {
  if (!cards.length || cards.length > otherPlayer().hand.length) return false;
  const suit = cards[0].suit;
  return cards.every((card) => card.suit === suit);
}

function isValidAnswer(cards) {
  return cards.length === state.trick.leadCards.length;
}

function playSelectedCards() {
  const actingPlayerIndex = state.dummyOpponent && state.activePlayer === 1
    ? 1
    : state.localPlayerIndex;
  if (!canPlayCardsFor(actingPlayerIndex)) return;
  const cards = selectedCards();

  if (state.phase === "lead") {
    if (!isValidLead(cards)) {
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
    render();
    return;
  }

  if (state.phase === "answer") {
    if (!isValidAnswer(cards)) {
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
  (state.hasTakenTrick ??= [false, false])[winnerIndex] = true;
  state.phase = "trickPause";
  state.selectedIds = [];
  render();
  if (isDealExhausted() || (state.dummyOpponent && winnerIndex === 1)) {
    state.pauseTimer = window.setTimeout(
      () => finishTrickPause(winnerIndex, loserIndex, trickPoints),
      trickCards.length * CLEARANCE_MS_PER_CARD
    );
  }
}

function finishTrickPause(winnerIndex, loserIndex, trickPoints) {
  state.pauseTimer = null;
  refillHands(winnerIndex, loserIndex);
  state.claimAvailableFor = null;
  state.phase = "lead";
  state.selectedIds = [];
  state.trick = createEmptyTrick();
  state.lastTrick = null;
  state.privacyLock = false;

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
    finishDeal(state.activePlayer, "claimedTarget");
    return;
  }

  clearTrickPauseTimer();
  finishDeal(opponentIndex, "falseClaimResult");
}

function clearTrickPauseTimer() {
  if (state.pauseTimer === null) return;
  window.clearTimeout(state.pauseTimer);
  state.pauseTimer = null;
}

function declareBura() {
  if (state.phase === "setup" || state.phase === "gameOver") return;
  if (!hasBura(state.activePlayer)) return;
  const declarerIndex = state.activePlayer;
  const declaredCards = removeCardsFromHand(
    declarerIndex,
    state.players[declarerIndex].hand.map((card) => card.id)
  );
  state.trick = {
    leadPlayer: declarerIndex,
    answerPlayer: null,
    leadCards: declaredCards,
    answerCards: []
  };
  state.lastTrick = null;
  state.selectedIds = [];
  state.privacyLock = false;
  state.phase = "buraReveal";
  playTurnSound("lead");
  render();
  state.pauseTimer = window.setTimeout(() => {
    state.pauseTimer = null;
    finishDeal(declarerIndex, "declaredBuraResult");
  }, BURA_REVEAL_MS);
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
  render();
}

function respondToOffer(accepted, responderIndex = state.localPlayerIndex) {
  if (state.phase !== "offerPending" || !state.offer || state.activePlayer !== state.offer.to || responderIndex !== state.offer.to) return;
  const offer = state.offer;
  state.offer = null;

  if (!accepted) {
    finishDeal(offer.from, "declinedIncreaseResult", {}, state.dealWeight);
    return;
  }

  state.dealWeight = offer.proposedWeight;
  state.nextOfferPlayer = offer.to;
  state.phase = offer.returnPhase;
  state.activePlayer = offer.from;
  state.privacyLock = false;
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
  if (!canAct() || state.phase === "trickPause" || state.phase === "maliutkaPending") return;
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
  state.trick = {
    leadPlayer: claimantIndex,
    answerPlayer: defenderIndex,
    leadCards,
    answerCards: defenderPaneCards
  };
  state.maliutkaPending = {
    claimantIndex,
    defenderIndex,
    defenderNeeds
  };
  state.activePlayer = defenderIndex;
  state.selectedIds = [];
  state.privacyLock = false;
  state.phase = "maliutkaPending";
  playTurnSound("lead");
  render();
}

function canResolveMaliutkaFor(playerIndex) {
  return state.phase === "maliutkaPending"
    && state.activePlayer === playerIndex
    && state.maliutkaPending?.defenderIndex === playerIndex;
}

function resolveMaliutka() {
  if (!canResolveMaliutkaFor(state.activePlayer)) return;
  const { claimantIndex, defenderIndex, defenderNeeds } = state.maliutkaPending;
  const leadCards = state.trick.leadCards;
  const defenderPaneCards = state.trick.answerCards;
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
  state.maliutkaPending = null;
  state.activePlayer = winnerIndex;
  state.leader = winnerIndex;
  state.claimAvailableFor = winnerIndex;
  state.phase = "trickPause";
  state.selectedIds = [];
  state.privacyLock = false;
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
    finishDeal(null, "tieScoreResult", { firstScore: first.score, secondScore: second.score });
  } else {
    const winnerIndex = first.score > second.score ? 0 : 1;
    finishDeal(winnerIndex, "moreCapturedPointsResult");
  }
}

function finishDeal(winnerIndex, reasonKey, reasonVariables = {}, awardWeight = state.dealWeight) {
  const awarded = winnerIndex === null ? 0 : awardWeight;
  const previousMatchPoints = winnerIndex === null ? null : state.players[winnerIndex].matchPoints;
  const animationStartedAt = Date.now();
  const popupStartsAt = winnerIndex === null ? null : animationStartedAt + DEAL_SCORE_TRANSFER_DELAY_MS;
  const weightResetStartsAt = (popupStartsAt ?? animationStartedAt + DEAL_SCORE_TRANSFER_DELAY_MS) + (winnerIndex === null ? 0 : DEAL_SCORE_POPUP_MS);
  if (winnerIndex !== null) state.players[winnerIndex].matchPoints += awarded;

  const matchWon = winnerIndex !== null && state.players[winnerIndex].matchPoints >= state.matchTarget;
  state.winner = winnerIndex;
  state.matchWon = matchWon;
  state.resultReason = { key: reasonKey, variables: reasonVariables, awarded };
  state.privacyLock = false;
  state.offer = null;

  state.phase = "dealPause";
  state.dealWinner = winnerIndex;
  state.dealScoreAnimation = winnerIndex === null ? null : {
    winnerIndex,
    from: previousMatchPoints,
    to: state.players[winnerIndex].matchPoints,
    weightFrom: state.dealWeight,
    popupStartsAt,
    weightResetStartsAt,
    transferStartsAt: weightResetStartsAt + DEAL_SCORE_WEIGHT_RESET_MS,
    pointInterval: DEAL_SCORE_POINT_INTERVAL_MS
  };
  state.selectedIds = [];
  showDealScoreSummary();
  state.dealTimer = window.setTimeout(
    () => matchWon ? startMatchSummary() : startNextDeal(winnerIndex),
    DEAL_SUMMARY_MS
  );
  render();
}

function startMatchSummary() {
  if (state.phase !== "dealPause" || !state.matchWon) return;
  state.dealTimer = null;
  state.phase = "gameOver";
  state.rematchDeadline = new Date(Date.now() + MATCH_SUMMARY_MS).toISOString();
  playResultSound(state.winner === getAudioPlayerIndex() ? "win" : "lose");
  setDealScoreSummaryVisible(false);
  showResultPanel();
  render();
}

function startNextDeal(previousWinner) {
  clearMatchSummaryTimers();
  clearOpeningTurnSignal();
  setDealScoreSummaryVisible(false);
  elements.resultPanel.hidden = true;
  const playerNames = state.players.map((player) => player.name);
  const matchPoints = state.players.map((player) => player.matchPoints);
  const firstLeader = previousWinner === null ? Math.floor(Math.random() * 2) : 1 - previousWinner;
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
    privacyLock: false,
    winner: null,
    matchWon: false,
    resultReason: "",
    dummyOpponent: state.dummyOpponent,
    easyPlay: state.easyPlay,
    easyPlayByPlayer: [...(state.easyPlayByPlayer || [state.easyPlay, state.easyPlay])],
    dummyTimer: null,
    pauseTimer: null,
    actionTimer: null,
    actionPending: false,
    claimAvailableFor: null,
    hasTakenTrick: [false, false],
    matchTarget: state.matchTarget,
    dealWeight: 1,
    nextOfferPlayer: null,
    localPlayerIndex: state.localPlayerIndex,
    offer: null,
    maliutkaPending: null,
    dealWinner: null,
    dealScoreAnimation: null,
    dealTimer: null,
    dealNumber: state.dealNumber + 1,
    online: state.online,
    onlineRole: state.onlineRole,
    onlineRoomId: state.onlineRoomId,
    onlineRoomCode: state.onlineRoomCode,
    onlineAssignment: state.onlineAssignment,
    processedActionSeq: state.processedActionSeq ?? 0,
    rematchDeadline: null,
    openingTurnSignal: false
  };
  render();
}

function clearOpeningTurnSignal() {
  if (openingTurnSignalTimer !== null) window.clearTimeout(openingTurnSignalTimer);
  openingTurnSignalTimer = null;
}

function startOpeningTurnSignal() {
  clearOpeningTurnSignal();
  openingTurnSignalTimer = window.setTimeout(() => {
    openingTurnSignalTimer = null;
    if (!state.openingTurnSignal) return;
    state.openingTurnSignal = false;
    render();
  }, 1000);
}

function playMatchStartSound() {
  if (matchStartSoundPlayed) return;
  matchStartSoundPlayed = true;
  try {
    const audio = new Audio(ENTER_GAME_SOUND_SOURCE);
    audio.preload = "auto";
    audio.volume = 0.52;
    audio.play().catch(() => {});
  } catch (error) {
    // Audio is optional and may be unavailable in a locked-down browser.
  }
}

function playResultSound(result) {
  try {
    const audio = new Audio(result === "win" ? MATCH_WIN_SOUND_SOURCE : MATCH_LOSS_SOUND_SOURCE);
    audio.preload = "auto";
    audio.volume = 0.58;
    audio.play().catch(() => {});
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

function getViewerPlayerIndex() {
  if (state.onlineRole === "host") return state.onlineAssignment?.hostIndex ?? 0;
  return state.localPlayerIndex;
}

function getAudioPlayerIndex() {
  return getViewerPlayerIndex();
}

function getDealResultLabel() {
  if (typeof state.resultReason === "string") return { text: state.resultReason, key: null, variables: {} };
  const result = state.resultReason;
  if (!result?.key) return null;

  const viewerWon = state.winner !== null && state.winner === getViewerPlayerIndex();
  const resultKey = state.winner === null
    ? result.key
    : `${result.key}${viewerWon ? "Winner" : "Loser"}`;
  return { text: uiLabel("game", resultKey, result.variables), key: resultKey, variables: result.variables };
}

function playDealWinSound() {
  if (state.winner !== getAudioPlayerIndex()) return;
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

function unlockAudioPlayback() {
  const context = getAudioContext();
  if (context?.state === "suspended") context.resume().catch(() => {});
}

function clearDealScoreAnimation() {
  if (dealScoreAnimationFrame !== null) window.cancelAnimationFrame(dealScoreAnimationFrame);
  if (dealScorePopupTimer !== null) window.clearTimeout(dealScorePopupTimer);
  if (dealScoreWeightResetTimer !== null) window.clearTimeout(dealScoreWeightResetTimer);
  if (dealScoreTransferTimer !== null) window.clearTimeout(dealScoreTransferTimer);
  dealScoreAnimationFrame = null;
  dealScorePopupTimer = null;
  dealScoreWeightResetTimer = null;
  dealScoreTransferTimer = null;
}

function getDealScorePointInterval(animation) {
  return animation.pointInterval ?? DEAL_SCORE_POINT_INTERVAL_MS;
}

function getDealScorePointsAdded(animation) {
  const total = animation.to - animation.from;
  if (total <= 0) return 0;
  const transferStartsAt = animation.transferStartsAt ?? animation.startsAt;
  if (Date.now() < transferStartsAt) return 0;
  const interval = getDealScorePointInterval(animation);
  return Math.min(total, Math.floor((Date.now() - transferStartsAt) / interval) + 1);
}

function getDisplayedMatchPoints(playerIndex) {
  const animation = state.dealScoreAnimation;
  if (!animation || animation.winnerIndex !== playerIndex) return state.players[playerIndex].matchPoints;

  return animation.from + getDealScorePointsAdded(animation);
}

function isDealScoreTransferActive(playerIndex) {
  const animation = state.dealScoreAnimation;
  if (!animation || animation.winnerIndex !== playerIndex) return false;
  const transferStartsAt = animation.transferStartsAt ?? animation.startsAt;
  const total = animation.to - animation.from;
  const interval = getDealScorePointInterval(animation);
  const now = Date.now();
  return total > 0 && now >= transferStartsAt && now < transferStartsAt + total * interval;
}

function isDealScoreAwardVisible(playerIndex) {
  const animation = state.dealScoreAnimation;
  if (!animation || animation.winnerIndex !== playerIndex) return false;
  const popupStartsAt = animation.popupStartsAt ?? animation.startsAt;
  const weightResetStartsAt = animation.weightResetStartsAt ?? animation.transferStartsAt ?? popupStartsAt;
  const now = Date.now();
  return now >= popupStartsAt && now < weightResetStartsAt;
}

function getDisplayedDealWeight() {
  const animation = state.dealScoreAnimation;
  if (!animation) return state.dealWeight;
  const weightResetStartsAt = animation.weightResetStartsAt ?? animation.transferStartsAt;
  return Date.now() >= weightResetStartsAt ? 1 : animation.weightFrom;
}

function isDealWeightResetActive() {
  const animation = state.dealScoreAnimation;
  if (!animation) return false;
  const weightResetStartsAt = animation.weightResetStartsAt ?? animation.transferStartsAt;
  const transferStartsAt = animation.transferStartsAt ?? weightResetStartsAt;
  const now = Date.now();
  return now >= weightResetStartsAt && now < transferStartsAt;
}

function dealScoreAnimationKey(animation) {
  return `${state.dealNumber}:${animation.winnerIndex}:${animation.popupStartsAt ?? animation.startsAt}:${animation.to}`;
}

function playDealWeightResetSound() {
  try {
    const audio = new Audio(POINTS_DOWN_SOUND_SOURCE);
    audio.preload = "auto";
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch (error) {
    // Sound is optional and may be unavailable in a locked-down browser.
  }
}

function playDealScoreTransferSound() {
  try {
    const audio = new Audio(POINTS_UP_SOUND_SOURCE);
    audio.preload = "auto";
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch (error) {
    // Sound is optional and may be unavailable in a locked-down browser.
  }
}

function playDealScoreAnimationSounds(animation) {
  const key = dealScoreAnimationKey(animation);
  const popupStartsAt = animation.popupStartsAt ?? animation.startsAt;
  const now = Date.now();
  if (now >= popupStartsAt && dealScorePopupSoundKey !== key) {
    dealScorePopupSoundKey = key;
    playDealWinSound();
  }
}

function animateDealScoreTransfer() {
  clearDealScoreAnimation();
  const animation = state.dealScoreAnimation;
  if (state.phase !== "dealPause" || !animation) return;

  const isCurrentAnimation = () => state.phase === "dealPause" && state.dealScoreAnimation === animation;
  const transferStartsAt = animation.transferStartsAt ?? animation.startsAt;
  const weightResetStartsAt = animation.weightResetStartsAt ?? transferStartsAt;
  const startPopup = () => {
    if (!isCurrentAnimation()) return;
    dealScorePopupTimer = null;
    playDealScoreAnimationSounds(animation);
    renderMatchPanel();
  };
  const startWeightReset = () => {
    if (!isCurrentAnimation()) return;
    dealScoreWeightResetTimer = null;
    playDealWeightResetSound();
    renderMatchPanel();
  };
  const startTransfer = () => {
    if (!isCurrentAnimation()) return;
    dealScoreTransferTimer = null;
    let displayedPoints = getDealScorePointsAdded(animation);
    const total = animation.to - animation.from;
    const refresh = () => {
      if (!isCurrentAnimation()) {
        dealScoreAnimationFrame = null;
        return;
      }
      const nextDisplayedPoints = getDealScorePointsAdded(animation);
      if (nextDisplayedPoints !== displayedPoints) {
        displayedPoints = nextDisplayedPoints;
        playDealScoreTransferSound();
        renderMatchPanel();
      }
      const interval = getDealScorePointInterval(animation);
      if (Date.now() < transferStartsAt + total * interval) {
        dealScoreAnimationFrame = window.requestAnimationFrame(refresh);
      } else {
        renderMatchPanel();
        dealScoreAnimationFrame = null;
      }
    };
    if (displayedPoints > 0) {
      playDealScoreTransferSound();
      renderMatchPanel();
    }
    refresh();
  };
  renderMatchPanel();
  if (animation.popupStartsAt !== null) {
    dealScorePopupTimer = window.setTimeout(startPopup, Math.max(0, (animation.popupStartsAt ?? animation.startsAt) - Date.now()));
  }
  dealScoreWeightResetTimer = window.setTimeout(startWeightReset, Math.max(0, weightResetStartsAt - Date.now()));
  dealScoreTransferTimer = window.setTimeout(startTransfer, Math.max(0, transferStartsAt - Date.now()));
}

function setDealScoreSummaryVisible(visible) {
  elements.appShell?.classList.toggle("is-deal-score-summary", visible);
  if (elements.dealScoreDimmer) elements.dealScoreDimmer.hidden = !visible;
  if (visible) animateDealScoreTransfer();
  else clearDealScoreAnimation();
}

function showDealScoreSummary() {
  elements.resultPanel.hidden = true;
  setDealScoreSummaryVisible(true);
}

function showResultPanel() {
  setDealScoreSummaryVisible(false);
  elements.resultPanel.hidden = false;
  const viewerIndex = getViewerPlayerIndex();
  const playerOrder = [otherPlayerIndex(viewerIndex), viewerIndex];

  const resultTitleKey = state.winner === null
    ? "splitDeal"
    : state.winner === viewerIndex ? "youWon" : "youLost";
  setLabelText(elements.resultKicker, "game", "matchSummary");
  setLabelText(elements.resultTitle, "game", resultTitleKey);
  elements.resultDetail.textContent = "";
  elements.resultDetail.hidden = true;
  elements.resultScores.innerHTML = playerOrder.map((playerIndex) => {
    const player = state.players[playerIndex];
    return `
      <div class="result-score ${playerIndex === state.winner ? "winner" : ""}">
        <span>${playerNameMarkup(playerIndex, player.name)}</span>
        <strong>${player.matchPoints}</strong>
      </div>
    `;
  }).join("");
  const rematchField = state.onlineRole === "host" ? "host_rematch" : "guest_rematch";
  const waitingForOpponent = onlineEnabled() && Boolean(onlineRoom?.[rematchField]);
  elements.playAgainButton.hidden = false;
  elements.resultCountdown.hidden = false;
  elements.playAgainButton.disabled = waitingForOpponent;
  if (waitingForOpponent) setLabelText(elements.playAgainButton, "game", "rematchWaiting");
  else if (onlineEnabled()) setLabelText(elements.playAgainButton, "game", "playAgain");
  else setLabelText(elements.playAgainButton, "preGame", "dealAgain");
  scheduleMatchSummaryClose();
}

function clearMatchSummaryTimers() {
  if (matchSummaryTimer !== null) window.clearTimeout(matchSummaryTimer);
  if (matchSummaryCountdownTimer !== null) window.clearInterval(matchSummaryCountdownTimer);
  matchSummaryTimer = null;
  matchSummaryCountdownTimer = null;
}

function getMatchSummaryRemainingMs() {
  const deadline = Date.parse(state.rematchDeadline || "");
  return Number.isFinite(deadline) ? Math.max(0, deadline - Date.now()) : 0;
}

function updateMatchSummaryCountdown() {
  const seconds = Math.ceil(getMatchSummaryRemainingMs() / 1000);
  setLabelText(elements.resultCountdown, "game", "rematchCountdown", { seconds });
}

function closeMatchSummary(forceExit = false) {
  clearMatchSummaryTimers();
  if (state.phase !== "gameOver") return;
  const roomId = onlineRoom?.id;
  const bothAccepted = Boolean(onlineRoom?.host_rematch && onlineRoom?.guest_rematch);
  if (bothAccepted && !forceExit) return;
  if (onlineEnabled() && onlineRoom && (onlineRoom.status === "rematch_waiting" || forceExit)) {
    void onlineClient.from("bura_rooms")
      .update({ host_rematch: false, guest_rematch: false, rematch_deadline: null, status: "finished" })
      .eq("id", onlineRoom.id);
  }
  if (roomId) clearOnlineSession(roomId);
  showSetup();
  if (!forceExit) setOnlineStatus(uiLabel("game", "rematchExpired"), "error");
}

function scheduleMatchSummaryClose() {
  clearMatchSummaryTimers();
  const remainingMs = getMatchSummaryRemainingMs();
  if (remainingMs <= 0) {
    closeMatchSummary();
    return;
  }
  updateMatchSummaryCountdown();
  matchSummaryCountdownTimer = window.setInterval(updateMatchSummaryCountdown, 200);
  matchSummaryTimer = window.setTimeout(closeMatchSummary, remainingMs);
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

function render() {
  if (onlineApplyingRemoteAction) return;
  renderTable();
  renderPlayerLanes();
  renderActions();
  scheduleDummyTurn();
  publishOnlineState();
}

function scheduleDummyTurn() {
  if (!state.dummyOpponent || state.actionPending || state.activePlayer !== 1 || state.phase === "setup" || state.phase === "gameOver" || state.phase === "trickPause" || state.phase === "dealPause" || state.phase === "buraReveal") return;
  if (state.dummyTimer !== null) return;
  state.dummyTimer = window.setTimeout(() => {
    state.dummyTimer = null;
    playDummyTurn();
  }, state.openingTurnSignal && state.phase === "lead" ? 1050 : 420);
}

function playDummyTurn() {
  if (!state.dummyOpponent || state.activePlayer !== 1 || state.phase === "gameOver") return;
  if (state.phase === "offerPending") {
    scheduleAction(() => respondToOffer(true, 1));
    return;
  }
  if (state.phase === "maliutkaPending") {
    scheduleAction(resolveMaliutka);
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
  if (state.stock.length) {
    setLabelText(elements.stockCount, "game", "stockCount", { count: Math.floor(state.stock.length / 2) });
  } else {
    elements.stockCount.textContent = "";
  }
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
    const displayedMatchPoints = getDisplayedMatchPoints(playerIndex);
    const progress = Math.min(100, (displayedMatchPoints / state.matchTarget) * 100);
    const isAwarding = isDealScoreTransferActive(playerIndex);
    const showAward = isDealScoreAwardVisible(playerIndex);
    const awardedPoints = state.dealScoreAnimation?.to - state.dealScoreAnimation?.from;
    return `
      <div class="match-score-player ${state.activePlayer === playerIndex ? "active" : ""} ${isAwarding ? "is-awarding" : ""}">
      <div class="match-score-heading">
          <span class="match-seat">${labelMarkup("game", seat.toLowerCase())}</span>
          <strong>${playerNameMarkup(playerIndex, player.name)}</strong>
        </div>
        ${showAward ? `<div class="match-score-award" aria-live="polite"><span>${labelMarkup("preGame", "matchPoints")}</span><strong>+${awardedPoints}</strong></div>` : ""}
        <div class="match-score-value">${displayedMatchPoints}</div>
        <div class="match-score-track"><span style="width: ${progress}%"></span></div>
      </div>
    `;
  };

  const dealResult = state.phase === "dealPause" ? getDealResultLabel() : null;
  const displayedDealWeight = getDisplayedDealWeight();
  const isWeightResetting = isDealWeightResetActive();
  const opponentIndex = otherPlayerIndex(state.localPlayerIndex);
  const capturedScoreComparison = state.phase === "dealPause"
    ? labelMarkup("game", "capturedScoreComparison", {
      player: state.players[state.localPlayerIndex].score,
      opponent: state.players[opponentIndex].score
    })
    : "";

  elements.matchPanel.innerHTML = `
    <div class="match-score-stack">
      <div class="match-score-north">
        ${renderMatchScore(opponentIndex, "NORTH")}
      </div>
      <div class="match-score-middle ${capturedScoreComparison ? "has-captured-score" : ""}">
        ${capturedScoreComparison ? `<p class="match-captured-score">${capturedScoreComparison}</p>` : ""}
        <div class="match-deal-info">
          <div>
            <span>${labelMarkup("game", "dealWeight")}</span>
            <strong class="${isWeightResetting ? "is-resetting" : ""}">${displayedDealWeight}</strong>
          </div>
          <div>
            <span>${labelMarkup("game", "matchTarget")}</span>
            <strong>${state.matchTarget}</strong>
          </div>
        </div>
      </div>
      <div class="match-score-south">
        ${dealResult ? `<p class="match-deal-result">${dealResult.key
          ? labelMarkup("game", dealResult.key, dealResult.variables)
          : escapeHtml(dealResult.text)}</p>` : ""}
        ${renderMatchScore(state.localPlayerIndex, "SOUTH")}
      </div>
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
  elements.actionButtons = document.querySelector("#current-lane-actions");
}

function renderLane(playerIndex, isCurrentLane) {
  const player = state.players[playerIndex];
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
      ${playerIndex !== state.localPlayerIndex ? `
        <div class="theme-picker" role="group" aria-label="${uiLabel("game", "themePicker")}">
          ${THEME_NAMES.map((theme) => `
            <button class="theme-swatch ${document.documentElement.dataset.theme === theme ? "selected" : ""}" type="button" data-theme-choice="${theme}" aria-label="${uiLabel("game", `${theme}Theme`)}" aria-pressed="${document.documentElement.dataset.theme === theme}"></button>
          `).join("")}
        </div>
      ` : ""}
      <div class="lane-heading-main">
        <h2>${playerNameMarkup(playerIndex, player.name)}</h2>
      </div>
      ${playerIndex === state.localPlayerIndex ? `
        <div class="captured-count" aria-label="${player.captured.length} ${uiLabel("game", "takenCards")}">
          <strong>${player.captured.length}</strong>
          <span>${labelMarkup("game", "takenCards")}</span>
        </div>
      ` : ""}
      <div class="turn-ornaments ${isCurrentLane ? "active" : ""} ${state.openingTurnSignal && state.phase === "lead" && state.leader === playerIndex ? "opening-turn-signal" : ""}" aria-hidden="true">
        <img src="assets/design/ornament1%201.svg" alt="">
        <img src="assets/design/ornament1%201.svg" alt="">
        <img src="assets/design/ornament1%201.svg" alt="">
      </div>
    </div>
    ${playerIndex === state.localPlayerIndex ? `
      <div class="hand-controls-row">
        <div class="hand-row">${cardsMarkup}</div>
        <div class="lane-actions" id="current-lane-actions"></div>
      </div>
    ` : ""}
  `;
}

function renderActions() {
  if (state.phase === "setup") return;

  const localIndex = state.localPlayerIndex;
  const playerOneMaliutka = !hasBura(localIndex) && maliutkaCards(localIndex).length === HAND_SIZE;
  const playerOneMaliutkaButton = playerOneMaliutka
    ? `<button class="secondary-button gold" type="button" data-action="maliutka">${labelMarkup("game", "declareMaliutka")}</button>`
    : "";

  if (state.actionPending) {
    elements.actionButtons.innerHTML = "";
    return;
  }

  if (state.phase === "dealPause") {
    elements.actionButtons.innerHTML = "";
    return;
  }

  if (state.phase === "buraReveal") {
    elements.actionButtons.innerHTML = "";
    return;
  }

  if (state.phase === "gameOver") {
    elements.actionButtons.innerHTML = "";
    return;
  }

  if (state.phase === "trickPause") {
    if (isDealExhausted()) {
      elements.actionButtons.innerHTML = "";
      return;
    }
    const canContinue = canReviewWonTrickFor(state.localPlayerIndex);
    const offerButton = canOfferIncrease()
      ? `<button class="secondary-button" type="button" data-action="offer">${labelMarkup("game", "increase")}</button>`
      : "";
    elements.actionButtons.innerHTML = canContinue
      ? `
        <button class="secondary-button" type="button" data-action="claim">${labelMarkup("game", "claim61")}</button>
        ${offerButton}
        <button class="primary-button" type="button" data-action="continue">${labelMarkup("game", "continue")}</button>
      `
      : "";
    bindActionButtons();
    return;
  }

  if (state.phase === "maliutkaPending") {
    const canResolve = canResolveMaliutkaFor(state.localPlayerIndex);
    const offerButton = canOfferIncrease()
      ? `<button class="secondary-button" type="button" data-action="offer">${labelMarkup("game", "increase")}</button>`
      : "";
    elements.actionButtons.innerHTML = canResolve
      ? `${offerButton}<button class="primary-button" type="button" data-action="maliutka-continue">${labelMarkup("game", "continue")}</button>`
      : "";
    bindActionButtons();
    return;
  }

  if (state.phase === "offerPending" && state.offer) {
    const offer = state.offer;
    if (state.localPlayerIndex !== offer.to || (state.dummyOpponent && state.activePlayer === 1)) {
      elements.actionButtons.innerHTML = "";
    } else {
      elements.actionButtons.innerHTML = `
        <button class="primary-button" type="button" data-action="accept-offer">${labelMarkup("game", "acceptOffer")}</button>
        <button class="secondary-button" type="button" data-action="decline-offer">${labelMarkup("game", "declineOffer")}</button>
      `;
    }
    bindActionButtons();
    return;
  }

  if (state.dummyOpponent && state.activePlayer === 1) {
    elements.actionButtons.innerHTML = playerOneMaliutkaButton;
    bindActionButtons();
    return;
  }

  const isLocalTurn = state.activePlayer === state.localPlayerIndex;
  const cards = isLocalTurn ? selectedCards() : [];
  const hasValidSelection = isLocalTurn
    && (state.phase === "lead" ? isValidLead(cards) : isValidAnswer(cards));
  const playText = state.phase === "lead"
    ? labelMarkup("game", "makingLead", { count: cards.length || "" }).trim()
    : labelMarkup("game", "makingAnswer", { selected: cards.length, needed: state.trick.leadCards.length });

  const buraButton = isLocalTurn && hasBura(state.localPlayerIndex)
    ? `<button class="secondary-button gold" type="button" data-action="bura">${labelMarkup("game", "declareBura")}</button>`
    : "";
  const maliutkaButton = playerOneMaliutkaButton;
  const claimButton = state.claimAvailableFor === state.activePlayer
    && state.activePlayer === state.localPlayerIndex
    && state.lastTrick?.winnerIndex === state.activePlayer
    ? `<button class="secondary-button" type="button" data-action="claim">${labelMarkup("game", "claim61")}</button>`
    : "";
  const canOffer = canOfferIncrease();
  const offerButton = canOffer
    ? `<button class="secondary-button" type="button" data-action="offer">${labelMarkup("game", "increase")}</button>`
    : "";
  elements.actionButtons.innerHTML = `
    <button class="primary-button" type="button" data-action="play" ${!hasValidSelection ? "disabled" : ""}>${playText}</button>
    <button class="secondary-button" type="button" data-action="clear" ${isLocalTurn && cards.length ? "" : "disabled"}>${labelMarkup("game", "clear")}</button>
    ${claimButton}
    ${offerButton}
    ${buraButton}
    ${maliutkaButton}
  `;
  bindActionButtons();
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
          const isValidSelection = state.phase === "lead" ? isValidLead(cards) : isValidAnswer(cards);
          if (!isValidSelection) return;
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
      if (action === "maliutka-continue") scheduleAction(resolveMaliutka);
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
elements.resultExitButton?.addEventListener("click", () => closeMatchSummary(true));
elements.reconnectButton?.addEventListener("click", () => {
  void reconnectSavedRoom();
});
elements.syncButton?.addEventListener("click", () => {
  if (onlineEnabled()) void refreshOnlineRoom();
  else void reconnectSavedRoom();
});
elements.matchTarget.addEventListener("input", () => {
  document.querySelector("#match-target-value").value = elements.matchTarget.value;
  document.querySelector("#match-target-value").textContent = elements.matchTarget.value;
});

elements.onlineMode?.addEventListener("change", () => {
  const enabled = elements.onlineMode.checked;
  elements.onlineFields.hidden = !enabled;
  elements.opponentModeLabel.textContent = uiLabel("preGame", enabled ? "onlineGame" : "dummyOpponent");
  elements.opponentModeDetail.textContent = uiLabel("preGame", enabled ? "onlineGameDetail" : "dummyOpponentDetail");
  elements.createdCode.hidden = true;
  elements.createdCodeValue.textContent = "";
  setOnlineStatus(enabled ? uiLabel("preGame", "onlineModeInstruction") : "");
  updateOnlineConnectionControls();
  if (enabled) startLobbyUpdates();
  else stopLobbyUpdates();
});

elements.roomCode?.addEventListener("input", () => {
  const hasCode = elements.roomCode.value.trim().length > 0;
  setLabelText(elements.startButton, "preGame", hasCode ? "joinWithCode" : "dealCards");
  if (hasCode) {
    elements.createdCode.hidden = true;
    setOnlineStatus("");
  }
});

elements.currentLane.addEventListener("click", (event) => {
  const button = event.target.closest("[data-card-id]");
  if (button) toggleCard(button.dataset.cardId);
});

elements.lobbyRefreshButton?.addEventListener("click", () => {
  void refreshLobby();
});

elements.lobbyOpenButton?.addEventListener("click", () => {
  if (lobbyView === "open") return;
  lobbyView = "open";
  void refreshLobby();
});

elements.lobbyActiveButton?.addEventListener("click", () => {
  if (lobbyView === "active") return;
  lobbyView = "active";
  void refreshLobby();
});

elements.lobbyList?.addEventListener("click", (event) => {
  const copyButton = event.target.closest("[data-lobby-copy-code]");
  if (copyButton) {
    void copyLobbyRoomCode(copyButton.dataset.lobbyCopyCode);
    return;
  }
  const cancelButton = event.target.closest("[data-lobby-cancel-id]");
  if (cancelButton) {
    void cancelLobbyRoom(cancelButton.dataset.lobbyCancelId);
    return;
  }
  const joinButton = event.target.closest("[data-lobby-room-id]");
  if (joinButton) void joinLobbyRoom(joinButton.dataset.lobbyRoomId);
});

elements.opponentLane.addEventListener("click", (event) => {
  const button = event.target.closest("[data-theme-choice]");
  if (button) setTheme(button.dataset.themeChoice);
});

document.addEventListener("pointerdown", unlockAudioPlayback, { passive: true });
document.addEventListener("keydown", unlockAudioPlayback);

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("service-worker.js");
}

showSetup();
if (performance.getEntriesByType("navigation")[0]?.type === "reload") {
  void reconnectSavedRoom();
}
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && onlineEnabled()) void refreshOnlineRoom();
});
