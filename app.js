const TARGET_POINTS = 61;
const HAND_SIZE = 5;
const MOVE_DELAY_MS = 200;
const DUMMY_ACTION_EXTRA_DELAY_MS = 300;
const CLEARANCE_MS_PER_CARD = 500;
const TIE_DEAL_SUMMARY_MS = 5000;
const DEAL_SCORE_TRANSFER_DELAY_MS = 250;
const DEAL_SCORE_POPUP_MS = 1050;
const ACCOUNT_NAME_SAVED_MESSAGE_MS = 5000;
const ACCOUNT_PROGRESS_HISTORY_LIMIT = 100;
const ACCOUNT_COINS_PER_COMPLETED_MATCH = 10;
const ACCOUNT_COINS_PER_MATCH_WIN = 10;
const DEAL_SCORE_WEIGHT_RESET_MS = 520;
const DEAL_SCORE_POINT_INTERVAL_MS = 430;
const DEAL_NEXT_DEAL_DELAY_MS = 1500;
const DUMMY_TRICK_CONTINUE_EXTRA_DELAY_MS = 150;
const MATCH_SUMMARY_MS = 10000;
const BURA_REVEAL_MS = 2000;
const TURN_TIME_MS = 15 * 1000;
const TURN_WARNING_AT_MS = 12 * 1000;
const TURN_RESERVE_MS = 60 * 1000;
const TURN_TIMER_TICK_MS = 100;
const ONLINE_FALLBACK_SYNC_INTERVAL_MS = 2500;
const ONLINE_CONSISTENCY_SYNC_INTERVAL_MS = 1500;
const ONLINE_ACTION_ACK_TIMEOUT_MS = 2500;
const ONLINE_ACTION_MAX_RETRIES = 3;
const ONLINE_CLOCK_SYNC_INTERVAL_MS = 60 * 1000;
const LOBBY_REFRESH_INTERVAL_MS = 15000;
const TRANSIENT_ONLINE_STATUS_MS = 5000;
const ONLINE_SESSION_KEY = "bura-online-session-v2";
const PENDING_INVITE_CODE_STORAGE_KEY = "bura-pending-invite-code-v1";
const AUTHORITY_SESSION_KEY = "bura-authoritative-session-v3";
const AUTHORITY_RECONNECT_DELAY_MS = 1500;
const HOSTED_ROOM_ACCESS_KEY = "bura-hosted-room-access-v2";
const HOST_OWNER_ID_STORAGE_KEY = "bura-host-owner-v1";
const AUTHORITY_BACKEND_ENABLED = false;
const MAX_WAITING_ROOMS_PER_HOST = 3;
const THEME_STORAGE_KEY = "bura-theme-v1";
const THEME_NAMES = ["green", "red", "blue"];
const LANGUAGE_STORAGE_KEY = "bura-language-v1";
const LANGUAGE_NAMES = ["ka", "en"];
const CARD_DECK_STORAGE_KEY = "bura-card-deck-v1";
const CARD_DECK_NAMES = ["classic", "mobile"];
const SYNC_CORE = window.BURA_SYNC_CORE;
const ONLINE_PROTOCOL_VERSION = SYNC_CORE?.PROTOCOL_VERSION || 2;
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
const DUMMY_PLAYER_INDEX = 1;
const DUMMY_RULES = window.BURA_BOT_RULES || {};
const DUMMY_TUNING = DUMMY_RULES.tuning || {};
const DUMMY_HIGH_RANKS = new Set(DUMMY_TUNING.highRanks || ["10", "A"]);

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
  mobileTrumpCard: document.querySelector("#mobile-trump-card"),
  stockCount: document.querySelector("#stock-count"),
  mobileStockCount: document.querySelector("#mobile-stock-count"),
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
  playerOneNameField: document.querySelector("#player-one-name-field"),
  accountMenuButton: document.querySelector("#account-menu-button"),
  accountMenuLabel: document.querySelector("#account-menu-label"),
  accountSidebar: document.querySelector("#account-sidebar"),
  accountSidebarBackdrop: document.querySelector("#account-sidebar-backdrop"),
  accountSidebarCloseButton: document.querySelector("#account-sidebar-close-button"),
  accountControls: document.querySelector("#account-controls"),
  accountTitle: document.querySelector("#account-title"),
  accountNameEditButton: document.querySelector("#account-name-edit-button"),
  accountStatus: document.querySelector("#account-status"),
  accountNote: document.querySelector("#account-note"),
  accountProviderButtons: document.querySelector("#account-provider-buttons"),
  accountGoogleButton: document.querySelector("#account-google-button"),
  accountFacebookButton: document.querySelector("#account-facebook-button"),
  accountProfile: document.querySelector("#account-profile"),
  accountProfileAvatar: document.querySelector("#account-profile-avatar"),
  accountProfileName: document.querySelector("#account-profile-name"),
  accountProfileId: document.querySelector("#account-profile-id"),
  accountProgression: document.querySelector("#account-progression"),
  accountCoinsValue: document.querySelector("#account-coins-value"),
  accountRankValue: document.querySelector("#account-rank-value"),
  accountKarmaValue: document.querySelector("#account-karma-value"),
  accountMatchesValue: document.querySelector("#account-matches-value"),
  accountPlayerName: document.querySelector("#account-player-name"),
  accountNameMessage: document.querySelector("#account-name-message"),
  accountSignOutButton: document.querySelector("#account-sign-out-button"),
  inviteJoinBackdrop: document.querySelector("#invite-join-backdrop"),
  inviteJoinPanel: document.querySelector("#invite-join-panel"),
  inviteGuestButton: document.querySelector("#invite-guest-button"),
  inviteGoogleButton: document.querySelector("#invite-google-button"),
  inviteFacebookButton: document.querySelector("#invite-facebook-button"),
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
  settingsButton: document.querySelector("#settings-button"),
  gameSettingsMenu: document.querySelector("#game-settings-menu"),
  restartButton: document.querySelector("#restart-button"),
  accountSidebarSettingsButton: document.querySelector("#account-sidebar-settings-button"),
  accountPreferences: document.querySelector("#account-preferences"),
  startButton: document.querySelector("#start-button"),
  easyPlay: document.querySelector("#easy-play-toggle")
    || document.querySelector('input[name="play-mode"][value="easy"]'),
  matchTarget: document.querySelector("#match-target")
};

let currentLanguage = getSavedLanguage();
let currentCardDeck = getSavedCardDeck();

function getSavedLanguage() {
  try {
    const language = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return LANGUAGE_NAMES.includes(language) ? language : "ka";
  } catch (error) {
    return "ka";
  }
}

function getSavedCardDeck() {
  try {
    const deck = window.localStorage.getItem(CARD_DECK_STORAGE_KEY);
    return CARD_DECK_NAMES.includes(deck) ? deck : "classic";
  } catch (error) {
    return "classic";
  }
}

function labelDefinition(group, key) {
  const activeLabels = currentLanguage === "en" ? window.BURA_LABELS_EN : window.BURA_LABELS;
  return activeLabels?.[group]?.[key] ?? window.BURA_LABELS?.[group]?.[key];
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
  element.lang = currentLanguage;
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
  return `<span class="${labelFontClass(group, key)}" lang="${currentLanguage}"${styleAttribute}>${escapeHtml(text)}</span>`;
}

function playerNameMarkup(playerIndex, name) {
  const nameKey = playerIndex === 0 ? "playerOne" : "playerTwo";
  return labelMarkup("preGame", nameKey, {}, name);
}

function scoreboardPlayerNameMarkup(playerIndex, name) {
  return playerNameMarkup(playerIndex, Array.from(name || "").slice(0, 10).join(""));
}

function lanePlayerNameMarkup(playerIndex, name) {
  const mobileName = Array.from(name || "").slice(0, 10).join("");
  return `<span class="lane-player-name"><span class="lane-player-name-full">${playerNameMarkup(playerIndex, name)}</span><span class="lane-player-name-mobile">${playerNameMarkup(playerIndex, mobileName)}</span></span>`;
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

document.documentElement.lang = currentLanguage;
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

function updatePreferenceChoices() {
  document.querySelectorAll("[data-language-choice]").forEach((button) => {
    const selected = button.dataset.languageChoice === currentLanguage;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  document.querySelectorAll("[data-card-deck-choice]").forEach((button) => {
    const selected = button.dataset.cardDeckChoice === currentCardDeck;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}

function setLanguage(language) {
  if (!LANGUAGE_NAMES.includes(language)) return;
  currentLanguage = language;
  document.documentElement.lang = language;
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    // The selected language still applies for the current session when storage is unavailable.
  }
  applyStaticLabels();
  updatePreferenceChoices();
  render();
  void refreshAccountControls(currentAccountUser);
}

function setCardDeck(deck) {
  if (!CARD_DECK_NAMES.includes(deck)) return;
  currentCardDeck = deck;
  try {
    window.localStorage.setItem(CARD_DECK_STORAGE_KEY, deck);
  } catch (error) {
    // The selected deck still applies for the current session when storage is unavailable.
  }
  updatePreferenceChoices();
  render();
}

function setGameSettingsOpen(open) {
  if (!elements.gameSettingsMenu || !elements.settingsButton) return;
  elements.gameSettingsMenu.hidden = !open;
  elements.settingsButton.setAttribute("aria-expanded", String(open));
  if (open) updatePreferenceChoices();
}

function setAccountPreferencesOpen(open) {
  if (!elements.accountPreferences || !elements.accountSidebarSettingsButton) return;
  elements.accountPreferences.hidden = !open;
  elements.accountSidebarSettingsButton.setAttribute("aria-expanded", String(open));
  if (open) updatePreferenceChoices();
}

let state = createEmptyState();
let audioContext = null;
const CARD_HIT_SOURCES = Array.from(
  { length: 22 },
  (_, index) => `assets/sound/cardonmat/CM${index + 1}.wav`
);
const INCREASE_OFFER_SOUND_SOURCE = "assets/sound/increaseoffer.wav";
const ENTER_GAME_SOUND_SOURCE = "assets/sound/entergame.mp3";
const MATCH_WIN_SOUND_SOURCE = "assets/sound/matchwon.wav";
const MATCH_LOSS_SOUND_SOURCE = "assets/sound/matchlost.wav";
const DEAL_SCORE_TRANSFER_SOUND_SOURCE = "assets/sound/weightdown.mp3";
const TURN_WARNING_SOUND_SOURCE = "assets/sound/turn-warning-loop.mp3";
let cardHitCursor = 0;
let turnWarningAudio = null;
let turnWarningMode = "";
let turnWarningPlayedKey = "";
let turnTimerInterval = null;
let turnTimerPlayerIndex = null;
let turnTimerPauseSnapshot = null;
let onlineClient = null;
let authorityClient = null;
let authorityConnection = null;
let authorityReconnectTimer = null;
let authorityReconnectAttempts = 0;
let onlineRoom = null;
let onlineChannel = null;
let onlineLastEventId = 0;
let onlineLastEventSequence = 0;
let onlineLastCheckpointEventId = 0;
let onlineLastCheckpointSequence = 0;
let onlineStateHash = "";
let onlineAppliedStateHash = "";
let onlineEventQueue = Promise.resolve();
let onlineRoomWriteQueue = Promise.resolve();
let onlinePendingSelection = null;
let onlinePendingPlay = null;
let onlinePendingAction = null;
let dummyFinalChoice = null;
let matchSummaryTimer = null;
let matchSummaryCountdownTimer = null;
let dealScoreAnimationFrame = null;
let dealScorePopupTimer = null;
let dealScoreWeightResetTimer = null;
let dealScoreTransferTimer = null;
let activeDealScoreAnimationKey = "";
let onlineRematchStarting = false;
let onlineApplyingRemoteAction = false;
let onlineSyncTimer = null;
let onlineConsistencySyncTimer = null;
let onlineRealtimeConnected = false;
let onlineActionsRealtimeConnected = false;
let onlineSyncInFlight = false;
let onlineActionsSyncInFlight = false;
let onlineActionsRefreshQueued = false;
let onlineServerClockOffsetMs = 0;
let onlineClockSyncedAt = 0;
let onlineLatestRoomUpdate = 0;
let onlineLatestRevision = 0;
let onlineLastAppliedCheckpointRevision = 0;
let onlineLastLeadActivityKey = "";
let onlineCheckpointNeeded = false;
let openingTurnSignalTimer = null;
let matchStartSoundPlayed = false;
let lobbyRooms = [];
let lobbyRefreshTimer = null;
let lobbyRefreshing = false;
let lobbyRequestId = 0;
let lobbyView = "open";
let hostOwnerId = null;
let onlineStatusTimer = null;
let accountNameMessageTimer = null;
let currentAccountUser = null;
let accountProgression = null;
let accountProgressionSaveQueue = Promise.resolve();
let activeAccountMatchId = "";
const hostedRoomsChannels = new Map();
let hostedRoomStartInFlight = false;
let onlineGameStartInFlight = false;
let onlineRoomCreationInFlight = false;
let hostedRoomStartingId = null;
let inviteJoinInFlight = false;

function getOnlineClient() {
  if (onlineClient) return onlineClient;
  const config = window.BURA_SUPABASE_CONFIG;
  if (!config || !window.supabase?.createClient) return null;
  onlineClient = window.supabase.createClient(config.url, config.publishableKey);
  return onlineClient;
}

function authorityIsConfigured() {
  return AUTHORITY_BACKEND_ENABLED
    && Boolean(window.BURA_GAME_SERVER_CONFIG?.url && window.BURA_AUTHORITY_CLIENT?.create);
}

function authorityOnlineEnabled() {
  return Boolean(state.authority && authorityClient && onlineRoom);
}

function getAuthorityClient() {
  if (authorityClient) return authorityClient;
  const supabase = getOnlineClient();
  if (!supabase || !authorityIsConfigured()) return null;
  authorityClient = window.BURA_AUTHORITY_CLIENT.create({
    supabase,
    gameServerUrl: window.BURA_GAME_SERVER_CONFIG.url
  });
  return authorityClient;
}

function getAccountClient() {
  return getOnlineClient();
}

function setAccountSidebarOpen(open) {
  if (!elements.accountSidebar || !elements.accountSidebarBackdrop) return;
  elements.accountSidebar.hidden = !open;
  elements.accountSidebarBackdrop.hidden = !open;
  elements.accountMenuButton?.setAttribute("aria-expanded", String(open));
  if (!open) setAccountPreferencesOpen(false);
}

function setAccountLabel(labelKey) {
  [elements.accountStatus, elements.accountMenuLabel].filter(Boolean).forEach((element) => {
    setLabelText(element, "preGame", labelKey);
  });
}

function setAccountMenuPlayerName(name) {
  if (elements.accountMenuLabel) elements.accountMenuLabel.textContent = name;
}

function setAccountTitle(labelKey, variables = {}) {
  if (elements.accountTitle) setLabelText(elements.accountTitle, "preGame", labelKey, variables);
}

function setAccountNameEditing(editing) {
  const isEditing = Boolean(editing && currentAccountUser && !isGuestAccount(currentAccountUser));
  if (elements.accountTitle) elements.accountTitle.hidden = isEditing;
  if (elements.accountPlayerName) {
    elements.accountPlayerName.hidden = !isEditing;
    if (isEditing) {
      elements.accountPlayerName.value = accountPlayerName(currentAccountUser);
      window.requestAnimationFrame(() => {
        elements.accountPlayerName?.focus();
        elements.accountPlayerName?.select();
      });
    }
  }
  if (elements.accountNameEditButton) elements.accountNameEditButton.setAttribute("aria-pressed", String(isEditing));
}

function setAccountNote(labelKey = "") {
  if (!elements.accountNote) return;
  elements.accountNote.hidden = !labelKey;
  if (labelKey) setLabelText(elements.accountNote, "preGame", labelKey);
}

function setAccountNameMessage(labelKey = "", clearAfterMs = 0) {
  if (!elements.accountNameMessage) return;
  if (accountNameMessageTimer !== null) window.clearTimeout(accountNameMessageTimer);
  accountNameMessageTimer = null;
  elements.accountNameMessage.hidden = !labelKey;
  if (labelKey) setLabelText(elements.accountNameMessage, "preGame", labelKey);
  if (labelKey && clearAfterMs > 0) {
    accountNameMessageTimer = window.setTimeout(() => setAccountNameMessage(), clearAfterMs);
  }
}

function accountPlayerName(user) {
  const metadata = user?.user_metadata || {};
  const value = metadata.nickname || metadata.full_name || metadata.name || "";
  return Array.from(String(value).trim()).slice(0, 18).join("");
}

function accountProgressionFromUser(user) {
  const raw = user?.user_metadata?.bura_progression || {};
  const matches = Array.isArray(raw.matches)
    ? raw.matches.filter((match) => typeof match?.id === "string").slice(0, ACCOUNT_PROGRESS_HISTORY_LIMIT)
    : [];
  return {
    coins: Math.max(0, Number(raw.coins) || 0),
    matches
  };
}

function accountCompletedMatches() {
  return (accountProgression?.matches || []).filter((match) => Boolean(match.completedAt));
}

function accountProfileInitials(name) {
  return Array.from(String(name).trim()).slice(0, 2).join("").toUpperCase();
}

function renderAccountIdentity(user, playerName) {
  if (elements.accountProfileAvatar) elements.accountProfileAvatar.textContent = accountProfileInitials(playerName);
  if (elements.accountProfileName) elements.accountProfileName.textContent = playerName;
  if (elements.accountProfileId) {
    const userId = String(user?.id || "").trim();
    elements.accountProfileId.textContent = userId;
    elements.accountProfileId.hidden = !userId;
  }
}

async function copyAccountId() {
  const userId = String(currentAccountUser?.id || "").trim();
  if (!userId) return;
  try {
    await navigator.clipboard.writeText(userId);
    setAccountNameMessage("accountIdCopied", ACCOUNT_NAME_SAVED_MESSAGE_MS);
  } catch (error) {
    console.warn("Unable to copy account ID", error);
    setAccountNameMessage("accountIdCopyFailed");
  }
}

function accountRankLabelKey() {
  const completed = accountCompletedMatches().length;
  if (completed >= 100) return "accountRankMaster";
  if (completed >= 50) return "accountRankGold";
  if (completed >= 25) return "accountRankSilver";
  if (completed >= 5) return "accountRankBronze";
  return "accountRankNewcomer";
}

function accountKarmaPercent() {
  const matches = accountProgression?.matches || [];
  if (!matches.length) return 0;
  return Math.round((accountCompletedMatches().length / matches.length) * 100);
}

function renderAccountProgression() {
  if (!elements.accountProgression || !accountProgression) return;
  elements.accountCoinsValue.textContent = String(accountProgression.coins);
  setLabelText(elements.accountRankValue, "preGame", accountRankLabelKey());
  elements.accountKarmaValue.textContent = `${accountKarmaPercent()}%`;
  elements.accountMatchesValue.textContent = `${accountCompletedMatches().length}/${accountProgression.matches.length}`;
}

function saveAccountProgression() {
  const userId = currentAccountUser?.id;
  if (!userId || !accountProgression) return;
  const progression = JSON.parse(JSON.stringify(accountProgression));
  accountProgressionSaveQueue = accountProgressionSaveQueue.catch(() => {}).then(async () => {
    const client = getAccountClient();
    const { data, error } = await client?.auth?.getUser?.() || {};
    if (error || data?.user?.id !== userId) return;
    const { error: updateError } = await client.auth.updateUser({ data: { bura_progression: progression } });
    if (updateError) console.warn("Unable to save account progression", updateError);
  });
}

function startAccountMatchTracking() {
  if (!currentAccountUser || !accountProgression) return "";
  const id = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
  accountProgression.matches.unshift({ id, startedAt: new Date().toISOString() });
  accountProgression.matches = accountProgression.matches.slice(0, ACCOUNT_PROGRESS_HISTORY_LIMIT);
  renderAccountProgression();
  saveAccountProgression();
  return id;
}

function recordAccountMatchCompletion() {
  if (!activeAccountMatchId || !accountProgression) return;
  const match = accountProgression.matches.find((entry) => entry.id === activeAccountMatchId);
  if (!match || match.completedAt) return;
  const won = state.winner === state.localPlayerIndex;
  match.completedAt = new Date().toISOString();
  match.result = won ? "win" : "loss";
  accountProgression.coins += ACCOUNT_COINS_PER_COMPLETED_MATCH + (won ? ACCOUNT_COINS_PER_MATCH_WIN : 0);
  renderAccountProgression();
  saveAccountProgression();
}

function applyAccountPlayerName(name) {
  if (!name) return;
  if (elements.playerOneName) elements.playerOneName.value = name;
  if (elements.accountPlayerName) elements.accountPlayerName.value = name;
}

function isGuestAccount(user) {
  return user?.is_anonymous === true || user?.app_metadata?.provider === "anonymous";
}

async function refreshAccountControls(sessionUser = null) {
  if (!elements.accountControls) return;
  const client = getAccountClient();

  try {
    const { data } = sessionUser ? { data: { session: { user: sessionUser } } } : client?.auth
      ? await client.auth.getSession()
      : { data: null };
    const user = data?.session?.user || null;
    const isUser = Boolean(user && !isGuestAccount(user));
    if (isUser) {
      currentAccountUser = user;
      accountProgression = accountProgressionFromUser(user);
      const playerName = accountPlayerName(user) || uiLabel("preGame", "playerOne");
      elements.accountStatus.hidden = true;
      setAccountMenuPlayerName(playerName);
      setAccountTitle("accountGreeting", { name: playerName });
      setAccountNameEditing(false);
      elements.accountNameEditButton.hidden = false;
      setAccountNote();
      elements.accountProviderButtons.hidden = true;
      elements.accountProfile.hidden = false;
      elements.accountProgression.hidden = false;
      renderAccountIdentity(user, playerName);
      renderAccountProgression();
      elements.playerOneNameField.hidden = true;
      applyAccountPlayerName(playerName);
      elements.accountSignOutButton.hidden = false;
      return;
    }

    setAccountLabel("accountGuest");
    currentAccountUser = null;
    accountProgression = null;
    activeAccountMatchId = "";
    elements.accountStatus.hidden = false;
    setAccountTitle("accountTitle");
    setAccountNameEditing(false);
    elements.accountNameEditButton.hidden = true;
    setAccountNote("accountGuestNote");
    elements.accountProviderButtons.hidden = !client?.auth;
    elements.accountProfile.hidden = true;
    elements.accountProgression.hidden = true;
    elements.playerOneNameField.hidden = false;
    setAccountNameMessage();
    elements.accountSignOutButton.hidden = true;
  } catch (error) {
    console.warn("Unable to read account state", error);
    setAccountLabel("accountGuest");
    currentAccountUser = null;
    accountProgression = null;
    activeAccountMatchId = "";
    elements.accountStatus.hidden = false;
    setAccountTitle("accountTitle");
    setAccountNameEditing(false);
    elements.accountNameEditButton.hidden = true;
    setAccountNote("accountGuestNote");
    elements.accountProviderButtons.hidden = false;
    elements.accountProfile.hidden = true;
    elements.accountProgression.hidden = true;
    elements.playerOneNameField.hidden = false;
    setAccountNameMessage();
    elements.accountSignOutButton.hidden = true;
  }
}

async function saveAccountPlayerName() {
  const client = getAccountClient();
  const name = Array.from(elements.accountPlayerName?.value.trim() || "").slice(0, 18).join("");
  if (!name) {
    setAccountNameMessage("accountNameRequired");
    elements.accountPlayerName?.focus();
    return;
  }

  if (!client?.auth) return;
  elements.accountPlayerName.disabled = true;
  elements.accountNameEditButton.disabled = true;
  try {
    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError || !userData?.user || userData.user.is_anonymous) throw userError || new Error("guest_account");
    const { data: updatedData, error } = await client.auth.updateUser({ data: { nickname: name } });
    if (error) throw error;
    currentAccountUser = updatedData?.user || userData.user;
    applyAccountPlayerName(name);
    setAccountMenuPlayerName(name);
    setAccountTitle("accountGreeting", { name });
    renderAccountIdentity(currentAccountUser, name);
    setAccountNameEditing(false);
    setAccountNameMessage("accountNameSaved", ACCOUNT_NAME_SAVED_MESSAGE_MS);
  } catch (error) {
    console.error("Unable to save account player name", error);
    setAccountNameMessage("accountNameSaveFailed");
  } finally {
    elements.accountPlayerName.disabled = false;
    elements.accountNameEditButton.disabled = false;
  }
}

async function signInWithAccountProvider(provider) {
  const client = getAccountClient();
  if (!client?.auth) {
    setOnlineStatus(uiLabel("preGame", "onlineUnavailable"), "error");
    return;
  }
  const buttons = [
    elements.accountGoogleButton,
    elements.accountFacebookButton,
    ...(isInviteJoinGateOpen() ? [elements.inviteGoogleButton, elements.inviteFacebookButton] : [])
  ].filter(Boolean);
  buttons.forEach((button) => { button.disabled = true; });
  try {
    const inviteCode = isInviteJoinGateOpen() ? pendingInviteRoomCode() : "";
    if (inviteCode) rememberPendingInviteCode(inviteCode);
    const redirectTo = inviteCode
      ? inviteAuthRedirectUrl(inviteCode)
      : window.BURA_SUPABASE_CONFIG?.authRedirectUrl || window.location.href.split("#")[0];
    const authOptions = { redirectTo };
    const authResult = await client.auth.signInWithOAuth({ provider, options: authOptions });
    if (authResult.error) throw authResult.error;
  } catch (error) {
    console.error(`Unable to sign in with ${provider}`, error);
    setOnlineStatus(uiLabel("preGame", "onlineUnavailable"), "error");
    buttons.forEach((button) => { button.disabled = false; });
  }
}

async function signOutAccount() {
  const client = getAccountClient();
  if (!client?.auth) return;
  elements.accountSignOutButton.disabled = true;
  try {
    const { error } = await client.auth.signOut();
    if (error) throw error;
    await refreshAccountControls();
  } catch (error) {
    console.error("Unable to sign out", error);
  } finally {
    elements.accountSignOutButton.disabled = false;
  }
}

async function refreshAuthorityAccountControls() {
  if (!elements.accountControls) return;
  const client = getAuthorityClient();
  if (!client) {
    await refreshAccountControls();
    return;
  }

  try {
    const session = await client.getSession();
    if (!session) {
      setAccountLabel("accountGuest");
      setAccountNote("accountGuestNote");
      elements.accountProviderButtons.hidden = false;
      elements.accountSignOutButton.hidden = true;
      return;
    }

    const user = await client.getCurrentUser();
    const isGuest = Boolean(user?.is_anonymous);
    setAccountLabel(isGuest ? "accountGuest" : "accountUser");
    setAccountNote(isGuest ? "accountGuestNote" : "accountUserNote");
    elements.accountProviderButtons.hidden = !isGuest;
    elements.accountSignOutButton.hidden = isGuest;
  } catch (error) {
    console.warn("Unable to read account state", error);
    setAccountLabel("accountGuest");
    setAccountNote("accountGuestNote");
    elements.accountProviderButtons.hidden = false;
    elements.accountSignOutButton.hidden = true;
  }
}

async function upgradeAuthorityAccount(provider) {
  const client = getAuthorityClient();
  if (!client) return;
  const buttons = [elements.accountGoogleButton, elements.accountFacebookButton].filter(Boolean);
  buttons.forEach((button) => { button.disabled = true; });
  try {
    await client.upgradeGuestWith(provider);
  } catch (error) {
    console.error(`Unable to upgrade guest with ${provider}`, error);
    setOnlineStatus(uiLabel("preGame", "onlineUnavailable"), "error");
    buttons.forEach((button) => { button.disabled = false; });
  }
}

async function signOutAuthorityAccount() {
  const client = getAuthorityClient();
  if (!client) return;
  elements.accountSignOutButton.disabled = true;
  try {
    await client.signOut();
    await refreshAuthorityAccountControls();
  } catch (error) {
    console.error("Unable to sign out", error);
  } finally {
    elements.accountSignOutButton.disabled = false;
  }
}

function readAuthoritySession() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(AUTHORITY_SESSION_KEY));
    return saved?.matchId && saved?.roomCode && saved?.playerName ? saved : null;
  } catch (error) {
    return null;
  }
}

function saveAuthoritySession(room, playerName) {
  if (!room?.id || !room?.code) return;
  try {
    window.localStorage.setItem(AUTHORITY_SESSION_KEY, JSON.stringify({
      matchId: room.id,
      roomCode: room.code,
      playerName,
      protocolVersion: 3
    }));
  } catch (error) {
    // The current connection still works when storage is unavailable.
  }
}

function clearAuthoritySession(matchId = null) {
  try {
    const saved = readAuthoritySession();
    if (!matchId || saved?.matchId === matchId) window.localStorage.removeItem(AUTHORITY_SESSION_KEY);
  } catch (error) {
    // Storage cleanup is best effort.
  }
}

function authorityLobbyRoom(room) {
  return {
    id: room.matchId,
    code: room.roomCode,
    status: room.status || "waiting",
    host_name: room.hostName,
    guest_name: room.guestName || null,
    created_at: room.createdAt,
    stake: normalizeTableStake(room.stake),
    settings: { matchTarget: Number(room.matchTarget) || 3 },
    owned: Boolean(room.isOwner),
    participant: Boolean(room.isParticipant),
    authority: true
  };
}

function normalizeTableStake(value, fallback = 0) {
  const stake = Number(value);
  return stake === 0 ? 0 : fallback;
}

function selectedTableStake() {
  return 0;
}

function tableStakeLabel(stake) {
  return labelMarkup("preGame", "lobbyFreeGame");
}

function authorityCard(card) {
  return restoreCard(card);
}

function authorityCards(cards) {
  return (cards || []).map(authorityCard).filter(Boolean);
}

function authorityTrick(trick) {
  return {
    leadPlayer: trick?.leadPlayer ?? null,
    answerPlayer: trick?.answerPlayer ?? null,
    leadCards: authorityCards(trick?.leadCards),
    answerCards: authorityCards(trick?.answerCards)
  };
}

function applyAuthoritySnapshot(snapshot) {
  if (!snapshot?.protocolVersion || snapshot.protocolVersion !== 3) return;
  const localIndex = Number(snapshot.viewerIndex);
  if (![0, 1].includes(localIndex)) return;
  const previousRevision = Number(state.authorityRevision) || -1;
  if (Number(snapshot.revision) < previousRevision) return;
  const turnDeadline = Number(snapshot.turnDeadlineAt) || null;
  const phaseDeadline = Number(snapshot.phaseDeadlineAt) || null;
  const result = snapshot.result || null;
  const players = snapshot.players.map((player) => ({
    name: player.name,
    hand: authorityCards(player.hand),
    captured: Array.from({ length: Number(player.capturedCount) || 0 }, () => ({})),
    score: Number(player.score) || 0,
    matchPoints: Number(player.matchPoints) || 0
  }));
  const matchWon = snapshot.phase === "gameOver" || (snapshot.phase === "dealPause" && result?.winnerIndex !== null
    && Number(players[result.winnerIndex]?.matchPoints) >= Number(snapshot.matchTarget));

  state = {
    ...createEmptyState(),
    players,
    stock: Array.from({ length: Number(snapshot.stockCount) || 0 }, () => null),
    stockDefinition: [],
    stockCursor: 0,
    dealSeed: null,
    trumpCard: authorityCard(snapshot.trumpCard),
    trumpSuit: authorityCard(snapshot.trumpCard)?.suit || null,
    activePlayer: Number(snapshot.activePlayer),
    leader: Number(snapshot.leader),
    phase: snapshot.phase,
    turnStartedAt: turnDeadline ? turnDeadline - TURN_TIME_MS - TURN_RESERVE_MS : null,
    turnElapsedMs: 0,
    turnReserveMs: [TURN_RESERVE_MS, TURN_RESERVE_MS],
    selectedIds: [],
    trick: authorityTrick(snapshot.trick),
    lastTrick: snapshot.lastTrick ? { ...authorityTrick(snapshot.lastTrick), winnerIndex: snapshot.lastTrick.winnerIndex, points: snapshot.lastTrick.points } : null,
    privacyLock: false,
    winner: snapshot.winner,
    matchWon,
    matchEndedByTimeout: result?.reason === "timeout",
    resultReason: result ? { key: result.reason, variables: {}, awarded: result.dealWeight } : "",
    dummyOpponent: false,
    easyPlay: Boolean(elements.easyPlay?.checked),
    easyPlayByPlayer: [Boolean(elements.easyPlay?.checked), Boolean(elements.easyPlay?.checked)],
    dummyTimer: null,
    pauseTimer: null,
    pauseDeadline: phaseDeadline,
    actionTimer: state.actionTimer,
    actionPending: state.actionPending,
    claimAvailableFor: snapshot.claimAvailableFor,
    hasTakenTrick: [false, false],
    matchTarget: Number(snapshot.matchTarget) || 3,
    dealWeight: Number(snapshot.dealWeight) || 1,
    nextOfferPlayer: null,
    localPlayerIndex: localIndex,
    offer: snapshot.offer,
    maliutkaPending: snapshot.maliutkaPending,
    dealWinner: snapshot.winner,
    dealScoreAnimation: null,
    dealTimer: null,
    dealDeadline: phaseDeadline,
    dealNumber: Number(snapshot.dealNumber) || 1,
    online: true,
    authority: true,
    authorityRevision: Number(snapshot.revision),
    onlineRole: "authoritative",
    onlineRoomId: snapshot.matchId,
    onlineRoomCode: onlineRoom?.code || "",
    onlineAssignment: null,
    eventCursor: Number(snapshot.revision) || 0,
    eventSequence: Number(snapshot.revision) || 0,
    rematchDeadline: null,
    openingTurnSignal: previousRevision < 0
  };
  if (onlinePendingAction?.authority && Number(snapshot.revision) > onlinePendingAction.expectedRevision) {
    clearPendingOnlineAction();
    onlinePendingSelection = null;
    onlinePendingPlay = null;
    state.actionPending = false;
  }
  elements.setupPanel.hidden = true;
  elements.brandHeading.hidden = false;
  elements.brandHeading.classList.add("in-game");
  elements.appShell.classList.add("game-view");
  elements.accountMenuButton.hidden = true;
  setAccountSidebarOpen(false);
  elements.settingsButton.hidden = false;
  elements.restartButton.hidden = false;
  elements.gamePanel.hidden = false;
  if (state.phase === "gameOver") showResultPanel();
  else if (state.phase === "dealPause") showDealScoreSummary();
  else {
    setDealScoreSummaryVisible(false);
    elements.resultPanel.hidden = true;
  }
  startTurnTimer();
  render();
}

async function connectAuthorityMatch(room) {
  const client = getAuthorityClient();
  if (!client || !room?.id) throw new Error("authoritative_server_unavailable");
  authorityConnection?.close();
  let connection;
  connection = await client.connect(room.id, {
    onOpen: () => {
      authorityReconnectAttempts = 0;
      setOnlineStatus("");
    },
    onState: (snapshot) => applyAuthoritySnapshot(snapshot),
    onError: (code) => {
      if (onlinePendingAction?.authority) {
        clearPendingOnlineAction();
        onlinePendingPlay = null;
        state.actionPending = false;
        render();
      }
      setOnlineStatus(uiLabel("preGame", "onlineActionFailed"), "error");
      console.warn("Authoritative Bura command rejected", code);
    },
    onClose: () => {
      if (authorityConnection === connection) scheduleAuthorityReconnect(room);
    }
  });
  authorityConnection = connection;
}

function scheduleAuthorityReconnect(room) {
  if (!authorityOnlineEnabled() || authorityReconnectTimer !== null || state.phase === "gameOver") return;
  authorityReconnectAttempts += 1;
  setOnlineStatus(uiLabel("preGame", "liveSyncReconnecting"), "error");
  authorityReconnectTimer = window.setTimeout(async () => {
    authorityReconnectTimer = null;
    try {
      await connectAuthorityMatch(room);
    } catch (error) {
      scheduleAuthorityReconnect(room);
    }
  }, Math.min(10_000, AUTHORITY_RECONNECT_DELAY_MS * authorityReconnectAttempts));
}

async function startAuthorityRoom(match, playerName) {
  const room = {
    id: match.matchId,
    code: match.roomCode || match.code || onlineRoom?.code,
    status: match.status,
    stake: normalizeTableStake(match.stake, selectedTableStake()),
    matchTarget: Number(match.matchTarget) || Number(elements.matchTarget?.value) || 3,
    authority: true
  };
  onlineRoom = room;
  saveAuthoritySession(room, playerName);
  if (room.status !== "playing") {
    setOnlineStatus(uiLabel("preGame", "onlineWaiting"), "success");
    elements.createdCodeValue.textContent = "";
    elements.createdCode.hidden = true;
    startLobbyUpdates();
    return;
  }
  stopLobbyUpdates();
  elements.createdCode.hidden = true;
  setOnlineStatus(uiLabel("preGame", "onlineRestoring"), "success");
  await connectAuthorityMatch(room);
}

function submitAuthorityAction(type, payload = {}) {
  if (!authorityOnlineEnabled() || !authorityConnection) return;
  const clientActionId = SYNC_CORE.createActionId(window.crypto?.randomUUID?.bind(window.crypto));
  const expectedRevision = Number(state.authorityRevision);
  clearPendingOnlineAction();
  onlinePendingAction = { authority: true, clientActionId, expectedRevision, timer: null };
  state.actionPending = true;
  render();
  state.actionTimer = window.setTimeout(() => {
    state.actionTimer = null;
    try {
      authorityConnection.send({ type, ...payload, clientActionId, expectedRevision });
    } catch (error) {
      clearPendingOnlineAction();
      onlinePendingPlay = null;
      state.actionPending = false;
      setOnlineStatus(uiLabel("preGame", "liveSyncReconnecting"), "error");
      scheduleAuthorityReconnect(onlineRoom);
      render();
    }
  }, MOVE_DELAY_MS);
}

function setOnlineStatus(message, tone = "", clearAfterMs = 0) {
  if (!elements.onlineStatus) return;
  if (onlineStatusTimer !== null) window.clearTimeout(onlineStatusTimer);
  onlineStatusTimer = null;
  elements.onlineStatus.textContent = message;
  elements.onlineStatus.dataset.tone = tone;
  if (!message || clearAfterMs <= 0) return;
  onlineStatusTimer = window.setTimeout(() => {
    onlineStatusTimer = null;
    if (elements.onlineStatus?.textContent === message) setOnlineStatus("");
  }, clearAfterMs);
}

function makeAccessToken() {
  return window.crypto?.randomUUID?.()
    || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

function readHostedRoomAccess() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(HOSTED_ROOM_ACCESS_KEY));
    return saved && typeof saved === "object" ? saved : {};
  } catch (error) {
    return {};
  }
}

function saveHostedRoomAccess(room, token) {
  if (!room?.id || !token) return;
  try {
    const access = readHostedRoomAccess();
    access[room.id] = { code: room.code, token, channelSecret: room.channel_secret };
    window.localStorage.setItem(HOSTED_ROOM_ACCESS_KEY, JSON.stringify(access));
  } catch (error) {
    // The current page can still host the room when storage is unavailable.
  }
}

function hostedRoomAccess(roomId) {
  return readHostedRoomAccess()[roomId] || null;
}

function clearHostedRoomAccess(roomId) {
  if (!roomId) return;
  try {
    const access = readHostedRoomAccess();
    delete access[roomId];
    window.localStorage.setItem(HOSTED_ROOM_ACCESS_KEY, JSON.stringify(access));
  } catch (error) {
    // Cleanup is best effort.
  }
  const channel = hostedRoomsChannels.get(roomId);
  hostedRoomsChannels.delete(roomId);
  if (channel && onlineClient) void onlineClient.removeChannel(channel);
}

function currentPlayerToken() {
  return readOnlineSession()?.playerToken || null;
}

async function callOnlineRpc(client, name, parameters, options = {}) {
  const { data, error } = await client.rpc(name, parameters);
  if (error && !options.silentErrors?.includes(error.message)) {
    console.error(`Supabase RPC ${name} failed`, JSON.stringify({
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint
    }));
  }
  return { data, error };
}

function gameNow() {
  return Date.now() + (onlineEnabled() ? onlineServerClockOffsetMs : 0);
}

async function syncOnlineClock(force = false) {
  if (!onlineClient || (!force && Date.now() - onlineClockSyncedAt < ONLINE_CLOCK_SYNC_INTERVAL_MS)) return;
  const requestStartedAt = Date.now();
  const { data, error } = await callOnlineRpc(onlineClient, "bura_server_time", {});
  const requestFinishedAt = Date.now();
  const serverTime = Date.parse(data || "");
  if (error || !Number.isFinite(serverTime)) return;
  onlineServerClockOffsetMs = serverTime - ((requestStartedAt + requestFinishedAt) / 2);
  onlineClockSyncedAt = requestFinishedAt;
}

function readOnlineSession() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(ONLINE_SESSION_KEY));
    if (!saved?.roomId || !saved?.code || !saved?.role || !saved?.playerName || !saved?.playerToken) return null;
    return saved;
  } catch (error) {
    return null;
  }
}

function saveOnlineSession(room, role, playerName, playerToken = currentPlayerToken()) {
  if (!playerToken) return;
  try {
    window.localStorage.setItem(ONLINE_SESSION_KEY, JSON.stringify({
      roomId: room.id,
      code: room.code,
      role,
      playerName,
      playerToken,
      protocolVersion: ONLINE_PROTOCOL_VERSION
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
  clearAuthoritySession(roomId);
  updateOnlineConnectionControls();
}

function isRoomExpired(room) {
  return room?.status === "expired";
}

function leaveExpiredOnlineRoom(room) {
  if (!isRoomExpired(room)) return false;
  clearOnlineSession(room.id);
  showSetup();
  setOnlineStatus(uiLabel("preGame", "roomExpired"), "error");
  return true;
}

function updateOnlineConnectionControls() {
  // The lobby's reconnect control is the single re-entry path for online games.
}

function useSavedSessionDetails(session) {
  if (!session) return;
  elements.onlineMode.checked = true;
  elements.onlineFields.hidden = false;
  elements.opponentModeLabel.textContent = uiLabel("preGame", "onlineGame");
  elements.opponentModeDetail.textContent = uiLabel("preGame", "onlineGameDetail");
  elements.playerOneName.value = session.playerName;
  elements.roomCode.value = session.code;
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
  if (room?.authority) return Boolean(room.owned || readAuthoritySession()?.matchId === room.id);
  return Boolean(room?.owned || hostedRoomAccess(room?.id))
    || (room?.id === onlineRoom?.id && state.onlineRole === "host");
}

function hostedRoomCanStart(room) {
  if (room?.status !== "waiting" || !room.guest_name) return false;
  const access = hostedRoomAccess(room.id);
  return Boolean(access?.token && access?.channelSecret);
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

function playerNamesFromRoom(room, assignment) {
  if (!assignment) return [];
  const names = [];
  names[assignment.hostIndex] = room?.host_name || uiLabel("preGame", "playerOne");
  names[assignment.guestIndex] = room?.guest_name || uiLabel("preGame", "playerTwo");
  return names;
}

async function getOwnedWaitingRooms(client) {
  const { data, error } = await callOnlineRpc(client, "bura_list_rooms", {
    owner_token: getHostOwnerId(),
    player_token: currentPlayerToken() || ""
  });
  if (error) return null;
  return (data || []).filter((room) => room.status === "waiting" && room.owned);
}

async function closeOtherHostedWaitingRooms(client, joinedRoom) {
  const accessEntries = Object.entries(readHostedRoomAccess());
  await Promise.all(accessEntries
    .filter(([roomId]) => roomId !== joinedRoom?.id)
    .map(async ([roomId, access]) => {
      await callOnlineRpc(client, "bura_cancel_room", { room_id: roomId, player_token: access.token });
      clearHostedRoomAccess(roomId);
    }));
}

function onlineEnabled() {
  return Boolean(state.online && onlineRoom && onlineClient);
}

function renderLobby() {
  if (!elements.lobbyPanel || !elements.lobbyList) return;
  const hostingWaitingRoom = onlineRoom?.status === "waiting" && state.onlineRole === "host";
  const savedRoomId = (authorityIsConfigured() ? readAuthoritySession()?.matchId : null)
    || readOnlineSession()?.roomId;
  const currentRoomId = onlineRoom?.id || savedRoomId;
  const visible = Boolean(elements.onlineMode?.checked) && (!onlineRoom || hostingWaitingRoom || Boolean(currentRoomId));
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

  const preferredStatus = lobbyView === "open" ? "waiting" : "playing";
  const sortedRooms = [...lobbyRooms].sort((first, second) => {
    const firstIsCurrent = first.id === currentRoomId ? 0 : 1;
    const secondIsCurrent = second.id === currentRoomId ? 0 : 1;
    if (firstIsCurrent !== secondIsCurrent) return firstIsCurrent - secondIsCurrent;
    const firstPriority = first.status === preferredStatus ? 0 : 1;
    const secondPriority = second.status === preferredStatus ? 0 : 1;
    if (firstPriority !== secondPriority) return firstPriority - secondPriority;
    return Date.parse(second.created_at) - Date.parse(first.created_at);
  });

  elements.lobbyList.innerHTML = sortedRooms.map((room) => {
    const matchTarget = Number(room.settings?.matchTarget) || 3;
    const isActiveRoom = room.status === "playing";
    const isOwnWaitingRoom = isOwnedWaitingRoom(room);
    const isCurrentRoom = room.id === currentRoomId;
    const playerNames = isActiveRoom
      ? `<div class="lobby-room-players"><strong>${escapeHtml(room.host_name)}</strong><span aria-hidden="true">/</span><strong>${escapeHtml(room.guest_name)}</strong></div>`
      : `<strong>${escapeHtml(room.host_name)}</strong>`;
    return `
      <article class="lobby-room ${isCurrentRoom ? "is-current-game" : ""}">
        <div class="lobby-room-info">
          ${playerNames}
          <span>${isActiveRoom ? `${labelMarkup("preGame", "lobbyPlaying")} / ` : ""}${labelMarkup("preGame", "lobbyMatch", { points: matchTarget })}</span>
        </div>
        ${isCurrentRoom
          ? `<div class="lobby-room-actions">
              <span class="lobby-room-status">${labelMarkup("preGame", "lobbyCurrent")}</span>
              <button class="secondary-button lobby-current-button" type="button" data-lobby-rejoin-id="${room.id}">${labelMarkup("preGame", "lobbyJoin")}</button>
            </div>`
          : isActiveRoom
            ? ""
          : isOwnWaitingRoom
            ? `<div class="lobby-room-actions">
                <button class="secondary-button lobby-copy-link-button" type="button" data-lobby-copy-link="${room.code}">${labelMarkup("preGame", "copyGameLink")}</button>
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
  if (authorityIsConfigured()) {
    const client = getAuthorityClient();
    if (!client) {
      lobbyRooms = [];
      renderLobby();
      return;
    }
    const requestId = ++lobbyRequestId;
    lobbyRefreshing = true;
    renderLobby();
    try {
      lobbyRooms = (await client.listLobby()).map(authorityLobbyRoom);
    } catch (error) {
      console.error("Unable to refresh the authoritative lobby", error);
      setOnlineStatus(uiLabel("preGame", "onlineActionFailed"), "error");
    }
    if (requestId !== lobbyRequestId) return;
    lobbyRefreshing = false;
    renderLobby();
    const saved = readAuthoritySession();
    if (saved && (!onlineRoom || onlineRoom.id === saved.matchId)) void reconnectAuthoritySession(saved);
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
  const roomsResult = await callOnlineRpc(client, "bura_list_rooms", {
    owner_token: getHostOwnerId(),
    player_token: currentPlayerToken() || ""
  });
  if (requestId !== lobbyRequestId) return;
  lobbyRefreshing = false;
  if (roomsResult.error) {
    lobbyRooms = [];
    renderLobby();
    return;
  }
  lobbyRooms = (roomsResult.data || [])
    .sort((first, second) => Date.parse(second.created_at) - Date.parse(first.created_at));
  renderLobby();
  const joinedOwnedRoom = lobbyRooms.find(hostedRoomCanStart);
  if (joinedOwnedRoom) void startHostedWaitingRoom(joinedOwnedRoom);
  else void pollJoinedHostedRooms();
}

function startLobbyUpdates() {
  if (!elements.onlineMode?.checked) return;
  if (authorityIsConfigured()) {
    if (lobbyRefreshTimer !== null) return;
    void refreshLobby();
    lobbyRefreshTimer = window.setInterval(() => void refreshLobby(), LOBBY_REFRESH_INTERVAL_MS);
    return;
  }
  subscribeHostedWaitingRooms();
  if (lobbyRefreshTimer !== null) return;
  void refreshLobby();
  void pollJoinedHostedRooms();
  lobbyRefreshTimer = window.setInterval(() => void refreshLobby(), LOBBY_REFRESH_INTERVAL_MS);
}

function pauseLobbyRefresh() {
  if (lobbyRefreshTimer !== null) window.clearInterval(lobbyRefreshTimer);
  lobbyRefreshTimer = null;
}

function stopLobbyUpdates() {
  pauseLobbyRefresh();
  lobbyRefreshing = false;
  lobbyRooms = [];
  stopHostedWaitingRooms();
  renderLobby();
}

function subscribeHostedWaitingRooms() {
  const client = getOnlineClient();
  if (!client || state.phase !== "setup" || !elements.onlineMode?.checked) return;
  Object.entries(readHostedRoomAccess()).forEach(([roomId, access]) => {
    if (!access.channelSecret || hostedRoomsChannels.has(roomId)) return;
    const channel = client.channel(`bura:${access.channelSecret}`)
      .on("broadcast", { event: "room" }, ({ payload }) => {
        const nextRoom = payload;
        if (nextRoom?.id === roomId) void startHostedWaitingRoom(nextRoom);
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") void refreshLobby();
      });
    hostedRoomsChannels.set(roomId, channel);
  });
}

function stopHostedWaitingRooms() {
  hostedRoomsChannels.forEach((channel) => {
    if (onlineClient) void onlineClient.removeChannel(channel);
  });
  hostedRoomsChannels.clear();
}

async function startHostedWaitingRoom(room) {
  if (state.phase !== "setup"
    || !elements.onlineMode?.checked
    || !hostedRoomCanStart(room)
    || hostedRoomStartingId === room.id) return;

  const client = getOnlineClient();
  const access = hostedRoomAccess(room.id);
  if (!client || !access?.token) return;
  hostedRoomStartInFlight = true;
  hostedRoomStartingId = room.id;
  stopHostedWaitingRooms();
  try {
    await connectToOnlineRoom(client, room, "host", room.host_name, access.token);
  } finally {
    hostedRoomStartInFlight = false;
    hostedRoomStartingId = null;
  }
}

async function pollJoinedHostedRooms() {
  if (hostedRoomStartInFlight || state.phase !== "setup" || !elements.onlineMode?.checked) return;
  const client = getOnlineClient();
  if (!client) return;
  for (const [roomId, access] of Object.entries(readHostedRoomAccess())) {
    if (!access?.token || roomId === hostedRoomStartingId) continue;
    const { data, error } = await callOnlineRpc(client, "bura_get_room", {
      room_id: roomId,
      player_token: access.token
    }, { silentErrors: ["room_forbidden"] });
    if (!error && hostedRoomCanStart(data)) {
      await startHostedWaitingRoom(data);
      return;
    }
    if (error || ["finished", "expired"].includes(data?.status)) clearHostedRoomAccess(roomId);
  }
}

async function joinLobbyRoom(roomId) {
  const room = lobbyRooms.find((candidate) => candidate.id === roomId);
  if (!room || room.id === onlineRoom?.id) return;
  if (room.authority) {
    await joinAuthorityMatch(room);
    return;
  }
  elements.roomCode.value = room.code;
  setOnlineStatus("");
  await joinOnlineRoom();
}

function makeGameInviteLink(code) {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set("join", code);
  return url.toString();
}

function inviteRoomCodeFromUrl() {
  const code = new URLSearchParams(window.location.search).get("join")?.trim().toUpperCase() || "";
  return /^[A-Z0-9]{6}$/.test(code) ? code : "";
}

function readPendingInviteCode() {
  try {
    const code = window.sessionStorage.getItem(PENDING_INVITE_CODE_STORAGE_KEY)?.trim().toUpperCase() || "";
    return /^[A-Z0-9]{6}$/.test(code) ? code : "";
  } catch (error) {
    return "";
  }
}

function pendingInviteRoomCode() {
  return inviteRoomCodeFromUrl() || readPendingInviteCode();
}

function rememberPendingInviteCode(code) {
  if (!/^[A-Z0-9]{6}$/.test(code)) return;
  try {
    window.sessionStorage.setItem(PENDING_INVITE_CODE_STORAGE_KEY, code);
  } catch (error) {
    // The invite URL remains available when session storage is unavailable.
  }
}

function clearPendingInviteCode() {
  try {
    window.sessionStorage.removeItem(PENDING_INVITE_CODE_STORAGE_KEY);
  } catch (error) {
    // Cleanup is best effort.
  }
}

function isInviteJoinGateOpen() {
  return Boolean(elements.inviteJoinPanel && !elements.inviteJoinPanel.hidden);
}

function setInviteJoinGateVisible(visible) {
  if (elements.inviteJoinPanel) elements.inviteJoinPanel.hidden = !visible;
  if (elements.inviteJoinBackdrop) elements.inviteJoinBackdrop.hidden = !visible;
}

function inviteAuthRedirectUrl(code) {
  const redirectUrl = new URL(window.BURA_SUPABASE_CONFIG?.authRedirectUrl || window.location.href.split("#")[0]);
  redirectUrl.searchParams.set("join", code);
  return redirectUrl.toString();
}

async function signedInInviteUser() {
  const client = getAccountClient();
  if (!client?.auth) return null;
  const { data, error } = await client.auth.getSession();
  if (error) return null;
  const user = data?.session?.user || null;
  return user && !isGuestAccount(user) ? user : null;
}

function useInviteLink() {
  const code = pendingInviteRoomCode();
  if (!code || !elements.roomCode) return false;
  rememberPendingInviteCode(code);
  elements.onlineMode.checked = true;
  elements.roomCode.value = code;
  elements.onlineFields.hidden = false;
  setLabelText(elements.startButton, "preGame", "lobbyJoin");
  setOnlineStatus("");
  return true;
}

function clearInviteLink() {
  if (inviteRoomCodeFromUrl()) window.history.replaceState({}, "", window.location.pathname);
  clearPendingInviteCode();
  setInviteJoinGateVisible(false);
}

async function joinInviteLink() {
  if (!useInviteLink()) return;
  if (authorityIsConfigured()) {
    await joinAuthorityMatchByCode(pendingInviteRoomCode());
    return;
  }
  await joinOnlineRoom({ fromInvite: true });
}

async function joinInviteAsSignedInUser(user) {
  if (inviteJoinInFlight || !user || !useInviteLink()) return;
  inviteJoinInFlight = true;
  const playerName = accountPlayerName(user) || uiLabel("preGame", "playerOne");
  applyAccountPlayerName(playerName);
  setInviteJoinGateVisible(false);
  try {
    await joinInviteLink();
  } finally {
    inviteJoinInFlight = false;
  }
}

async function joinInviteAsGuest() {
  if (inviteJoinInFlight || !useInviteLink()) return;
  inviteJoinInFlight = true;
  elements.inviteGuestButton.disabled = true;
  try {
    await joinInviteLink();
  } finally {
    inviteJoinInFlight = false;
    if (elements.inviteGuestButton) elements.inviteGuestButton.disabled = false;
  }
}

async function openInviteJoinGate() {
  if (!useInviteLink()) return;
  const user = await signedInInviteUser();
  if (user) {
    await joinInviteAsSignedInUser(user);
    return;
  }
  setInviteJoinGateVisible(true);
}

async function rejoinLobbyRoom(roomId) {
  const authoritySession = readAuthoritySession();
  if (authorityIsConfigured() && authoritySession?.matchId === roomId) {
    await reconnectAuthoritySession(authoritySession);
    return;
  }
  const client = getOnlineClient();
  const session = readOnlineSession();
  const access = session?.roomId === roomId
    ? { role: session.role, playerName: session.playerName, token: session.playerToken }
    : hostedRoomAccess(roomId)
      ? { role: "host", playerName: "", token: hostedRoomAccess(roomId).token }
      : null;
  if (!client || !access?.token) {
    setOnlineStatus(uiLabel("preGame", "savedGameUnavailable"), "error");
    return;
  }
  const { data, error } = await callOnlineRpc(client, "bura_get_room", {
    room_id: roomId,
    player_token: access.token
  });
  if (error || !data || leaveExpiredOnlineRoom(data)) {
    setOnlineStatus(uiLabel("preGame", "savedGameUnavailable"), "error");
    return;
  }
  const playerName = access.playerName || (access.role === "host" ? data.host_name : data.guest_name);
  await connectToOnlineRoom(client, data, access.role, playerName, access.token);
}

async function cancelLobbyRoom(roomId) {
  const room = lobbyRooms.find((candidate) => candidate.id === roomId);
  if (room?.authority) {
    const client = getAuthorityClient();
    if (!client || !isOwnedWaitingRoom(room)) return;
    try {
      await client.cancelMatch(room.id);
      clearAuthoritySession(room.id);
      if (onlineRoom?.id === room.id) showSetup();
      else await refreshLobby();
    } catch (error) {
      setOnlineStatus(uiLabel("preGame", "onlineActionFailed"), "error");
    }
    return;
  }
  const client = getOnlineClient();
  if (!room || !client || !isOwnedWaitingRoom(room)) return;

  const access = hostedRoomAccess(room.id);
  const { error } = access
    ? await callOnlineRpc(client, "bura_cancel_room", { room_id: room.id, player_token: access.token })
    : { error: new Error("Missing room access") };
  if (error) {
    setOnlineStatus(uiLabel("preGame", "onlineActionFailed"), "error");
    return;
  }
  clearHostedRoomAccess(room.id);

  lobbyRooms = lobbyRooms.filter((candidate) => candidate.id !== room.id);
  if (room.id === onlineRoom?.id) {
    clearOnlineSession(room.id);
    showSetup();
    return;
  }
  renderLobby();
}

async function copyLobbyRoomLink(code, button) {
  const link = makeGameInviteLink(code);
  const copyFallback = () => {
    const input = document.createElement("textarea");
    input.value = link;
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
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(link);
    else if (!copyFallback()) throw new Error("Copy was unavailable");
    if (button) {
      setLabelText(button, "preGame", "gameLinkCopied");
      window.setTimeout(() => {
        if (button.isConnected) setLabelText(button, "preGame", "copyGameLink");
      }, 2000);
    }
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
    stockDefinition: [],
    stockCursor: 0,
    trumpCard: null,
    trumpSuit: null,
    activePlayer: 0,
    leader: 0,
    phase: "setup",
    turnStartedAt: null,
    turnElapsedMs: 0,
    turnReserveMs: [TURN_RESERVE_MS, TURN_RESERVE_MS],
    selectedIds: [],
    trick: createEmptyTrick(),
    lastTrick: null,
    privacyLock: false,
    winner: null,
    matchWon: false,
    matchEndedByTimeout: false,
    resultReason: "",
    dummyOpponent: false,
    easyPlay: false,
    easyPlayByPlayer: [false, false],
    dummyTimer: null,
    pauseTimer: null,
    pauseDeadline: null,
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
    dealDeadline: null,
    dealNumber: 0,
    online: false,
    onlineRole: null,
    onlineRoomId: null,
    onlineRoomCode: null,
    onlineAssignment: null,
    eventCursor: 0,
    eventSequence: 0,
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

const CARD_BY_ID = new Map(buildDeck().map((card) => [card.id, card]));
const CARD_SHORT_SUIT = { clubs: "c", spades: "s", diamonds: "d", hearts: "h" };
const CARD_SHORT_RANK = { "6": "6", "7": "7", "8": "8", "9": "9", "10": "1", J: "j", Q: "q", K: "k", A: "a" };
const CARD_TRANSPORT_ID_BY_ID = new Map(
  buildDeck().map((card) => [card.id, `${CARD_SHORT_SUIT[card.suit]}${CARD_SHORT_RANK[card.rank]}`])
);
const CARD_ID_BY_TRANSPORT_ID = new Map(
  [...CARD_TRANSPORT_ID_BY_ID].map(([fullId, shortId]) => [shortId, fullId])
);

function cardId(card) {
  const id = typeof card === "string" ? card : card?.id || null;
  return CARD_ID_BY_TRANSPORT_ID.get(id) || id;
}

function transportCardId(card) {
  const id = cardId(card);
  return CARD_TRANSPORT_ID_BY_ID.get(id) || id;
}

function compactCards(cards) {
  return Array.isArray(cards) ? cards.map(transportCardId).filter(Boolean) : [];
}

function restoreCard(card) {
  const id = cardId(card);
  return CARD_BY_ID.get(id) || card || null;
}

function restoreCards(cards) {
  return Array.isArray(cards) ? cards.map(restoreCard).filter(Boolean) : [];
}

function compactTrickCards(trick) {
  if (!trick) return trick;
  return {
    ...trick,
    leadCards: compactCards(trick.leadCards),
    answerCards: compactCards(trick.answerCards)
  };
}

function restoreTrickCards(trick) {
  if (!trick) return trick;
  return {
    ...trick,
    leadCards: restoreCards(trick.leadCards),
    answerCards: restoreCards(trick.answerCards)
  };
}

function compactOnlineCardState(source, options = {}) {
  const compactState = {
    ...source,
    players: (source.players || []).map((player) => ({
      hand: compactCards(player.hand),
      score: Number(player.score) || 0,
      matchPoints: Number(player.matchPoints) || 0,
      capturedCount: Array.isArray(player.captured) ? player.captured.length : Number(player.capturedCount) || 0
    })),
    stockCursor: Number(source.stockCursor) || 0,
    trick: compactTrickCards(source.trick),
    lastTrick: compactTrickCards(source.lastTrick)
  };
  if (options.legacyStockDefinition) {
    compactState.stockDefinition = compactCards(options.legacyStockDefinition);
    compactState.trumpCard = transportCardId(options.legacyTrumpCard);
  }
  return compactState;
}

function restoreOnlineCardState(source, room = onlineRoom) {
  const dealSeed = source.dealSeed || room?.settings?.dealSeed;
  const seededDeal = dealSeed ? buildDealFromSeed(dealSeed) : null;
  const stockDefinition = seededDeal?.stock || restoreCards(source.stockDefinition || source.stock);
  const stockCursor = Math.max(0, Number(source.stockCursor) || 0);
  const assignment = room?.settings?.assignment || source.onlineAssignment || null;
  const playerNames = playerNamesFromRoom(room, assignment);
  const matchTarget = Number(room?.settings?.matchTarget) || Number(source.matchTarget) || 3;
  const easyPlayByPlayer = assignment
    ? roomEasyPlayByPlayer(room, assignment)
    : source.easyPlayByPlayer || [Boolean(source.easyPlay), Boolean(source.easyPlay)];
  return {
    ...source,
    players: (source.players || []).map((player, playerIndex) => ({
      ...createPlayer(playerNames[playerIndex] || player.name || ""),
      hand: restoreCards(player.hand),
      captured: Array(Math.max(0, Number(player.capturedCount) || restoreCards(player.captured).length)).fill(null),
      score: Number(player.score) || 0,
      matchPoints: Number(player.matchPoints) || 0
    })),
    stock: stockDefinition.slice(stockCursor),
    stockDefinition,
    stockCursor,
    dealSeed,
    trumpCard: seededDeal?.trumpCard || restoreCard(source.trumpCard),
    trumpSuit: seededDeal?.trumpCard?.suit || source.trumpSuit,
    dummyOpponent: false,
    easyPlay: Boolean(easyPlayByPlayer[0] || easyPlayByPlayer[1]),
    easyPlayByPlayer,
    matchTarget,
    onlineAssignment: assignment,
    trick: restoreTrickCards(source.trick),
    lastTrick: restoreTrickCards(source.lastTrick)
  };
}

function shuffle(cards) {
  const shuffled = [...cards];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function makeDealSeed() {
  const maximumSeed = 36 ** 6;
  const randomValue = window.crypto?.getRandomValues
    ? window.crypto.getRandomValues(new Uint32Array(1))[0]
    : Math.floor(Math.random() * 0x100000000);
  return (randomValue % maximumSeed).toString(36).padStart(6, "0");
}

function seededRandom(seed) {
  let value = Number.parseInt(String(seed), 36) >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithSeed(cards, seed) {
  const shuffled = [...cards];
  const random = seededRandom(seed);
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function buildDealFromSeed(seed) {
  const deck = shuffleWithSeed(buildDeck(), seed);
  const trumpCard = deck[HAND_SIZE * 2];
  return {
    playerOneHand: deck.slice(0, HAND_SIZE),
    playerTwoHand: deck.slice(HAND_SIZE, HAND_SIZE * 2),
    trumpCard,
    stock: deck.slice(HAND_SIZE * 2 + 1).concat(trumpCard)
  };
}

function startLocalGame(onlineOptions = {}) {
  stopLobbyUpdates();
  setDealScoreSummaryVisible(false);
  onlineLastLeadActivityKey = "";
  clearOpeningTurnSignal();
  clearDummyFinalChoice();
  if (!onlineOptions.isRematch) matchStartSoundPlayed = false;
  clearMatchSummaryTimers();
  if (state.pauseTimer !== null) window.clearTimeout(state.pauseTimer);
  if (state.actionTimer !== null) window.clearTimeout(state.actionTimer);
  if (state.dealTimer !== null) window.clearTimeout(state.dealTimer);
  activeAccountMatchId = startAccountMatchTracking();
  const dealSeed = onlineOptions.dealSeed || makeDealSeed();
  const { playerOneHand, playerTwoHand, trumpCard, stock } = buildDealFromSeed(dealSeed);
  const hostName = onlineOptions.hostName || elements.playerOneName.value.trim() || uiLabel("preGame", "playerOne");
  const guestName = onlineOptions.guestName || uiLabel("preGame", "playerTwo");
  const hostPlayerIndex = onlineOptions.hostPlayerIndex ?? 0;
  const guestPlayerIndex = 1 - hostPlayerIndex;
  const playerNames = [];
  playerNames[hostPlayerIndex] = hostName;
  playerNames[guestPlayerIndex] = guestName;
  const firstLeader = onlineOptions.firstLeader ?? Math.floor(Math.random() * 2);
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
    stockDefinition: [...stock],
    stockCursor: 0,
    dealSeed,
    trumpCard,
    trumpSuit: trumpCard.suit,
    activePlayer: firstLeader,
    leader: firstLeader,
    phase: "lead",
    turnStartedAt: gameNow(),
    turnElapsedMs: 0,
    turnReserveMs: [TURN_RESERVE_MS, TURN_RESERVE_MS],
    selectedIds: [],
    trick: createEmptyTrick(),
    lastTrick: null,
    privacyLock: false,
    winner: null,
    matchWon: false,
    matchEndedByTimeout: false,
    resultReason: "",
    dummyOpponent: onlineOptions.dummyOpponent ?? !elements.onlineMode.checked,
    easyPlay: elements.easyPlay.checked,
    easyPlayByPlayer,
    dummyTimer: null,
    pauseTimer: null,
    pauseDeadline: null,
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
    dealDeadline: null,
    dealNumber: 1,
    online: Boolean(onlineOptions.online),
    onlineRole: onlineOptions.onlineRole || null,
    onlineRoomId: onlineOptions.onlineRoomId || null,
    onlineRoomCode: onlineOptions.onlineRoomCode || null,
    onlineAssignment: onlineOptions.onlineAssignment || null,
    eventCursor: onlineOptions.eventCursor ?? 0,
    eventSequence: onlineOptions.eventSequence ?? 0,
    rematchDeadline: null,
    openingTurnSignal: true
  };

  if (state.online && state.onlineRole === "host" && onlineOptions.persistedSettings) {
    onlineRoom = { ...onlineRoom, settings: onlineOptions.persistedSettings };
  }

  if (state.online && state.onlineRole === "host") onlineCheckpointNeeded = true;

  elements.setupPanel.hidden = true;
  elements.resultPanel.hidden = true;
  elements.brandHeading.hidden = false;
  elements.brandHeading.classList.add("in-game");
  elements.appShell.classList.add("game-view");
  elements.accountMenuButton.hidden = true;
  setAccountSidebarOpen(false);
  elements.settingsButton.hidden = false;
  elements.restartButton.hidden = false;
  elements.gamePanel.hidden = false;
  render();
  startTurnTimer();
  startOpeningTurnSignal();
  if (!onlineOptions.isRematch) playMatchStartSound();
}

async function startGame() {
  if (!elements.onlineMode?.checked) {
    startLocalGame();
    return;
  }
  if (pendingInviteRoomCode()) await joinOnlineRoom({ fromInvite: true });
  else await createOnlineRoom();
}

function onlineSettings() {
  return {
    hostEasyPlay: Boolean(elements.easyPlay.checked),
    matchTarget: Number(elements.matchTarget.value),
    protocolVersion: ONLINE_PROTOCOL_VERSION
  };
}

function getLeadActivityKey(source) {
  const trick = source?.trick;
  if (source?.phase !== "answer" || !trick?.leadCards?.length || trick.leadPlayer === null || trick.leadPlayer === undefined) {
    return "";
  }
  return `${source.dealNumber}:${trick.leadPlayer}:${compactCards(trick.leadCards).join("|")}`;
}

function serializedState() {
  const {
    localPlayerIndex,
    online,
    onlineRole,
    onlineRoomId,
    onlineRoomCode,
    onlineAssignment,
    stock,
    stockDefinition,
    dealSeed,
    trumpCard,
    trumpSuit,
    dummyOpponent,
    easyPlay,
    easyPlayByPlayer,
    matchTarget,
    openingTurnSignal,
    selectedIds,
    dummyTimer,
    pauseTimer,
    actionTimer,
    dealTimer,
    actionPending,
    ...sharedState
  } = state;
  return JSON.parse(JSON.stringify(compactOnlineCardState(sharedState, {
    legacyStockDefinition: state.dealSeed ? null : state.stockDefinition,
    legacyTrumpCard: state.dealSeed ? null : state.trumpCard
  })));
}

async function createOnlineRoom() {
  if (authorityIsConfigured()) {
    await createAuthorityRoom();
    return;
  }
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
      setOnlineStatus(uiLabel("preGame", "hostRoomLimit"), "error", TRANSIENT_ONLINE_STATUS_MS);
      return;
    }
    const hostName = elements.playerOneName.value.trim() || uiLabel("preGame", "playerOne");
    const code = makeRoomCode();
    const playerToken = makeAccessToken();
    const { data, error } = await callOnlineRpc(client, "bura_create_room", {
      room_code: code,
      player_name: hostName,
      room_settings: onlineSettings(),
      player_token: playerToken,
      owner_token: getHostOwnerId()
    });
    if (error || !data) {
      setOnlineStatus(uiLabel("preGame", "onlineCreateFailed"), "error");
      return;
    }
    saveHostedRoomAccess(data, playerToken);
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
  return null;
}

async function connectToOnlineRoom(client, room, role, playerName, playerToken = currentPlayerToken()) {
  if (leaveExpiredOnlineRoom(room)) return;
  if (!SYNC_CORE?.protocolMatches(room.settings || { protocolVersion: room.protocol_version })) {
    setOnlineStatus(uiLabel("preGame", "savedGameUnavailable"), "error");
    return;
  }
  onlineClient = client;
  await syncOnlineClock(true);
  onlineRoom = room;
  onlineLastEventId = Number(room.game_state?.eventCursor) || 0;
  onlineLastEventSequence = Number(room.game_state?.eventSequence) || 0;
  onlineLastCheckpointEventId = onlineLastEventId;
  onlineLastCheckpointSequence = onlineLastEventSequence;
  onlineLatestRoomUpdate = Date.parse(room.updated_at || "") || 0;
  onlineLatestRevision = Number(room.revision) || 0;
  onlineLastAppliedCheckpointRevision = 0;
  onlineCheckpointNeeded = false;
  onlineEventQueue = Promise.resolve();
  onlineLastLeadActivityKey = getLeadActivityKey(room.game_state);
  stopLobbyUpdates();
  state.online = true;
  state.onlineRole = role;
  state.onlineRoomId = room.id;
  state.onlineRoomCode = room.code;
  state.eventCursor = onlineLastEventId;
  saveOnlineSession(room, role, playerName, playerToken);
  elements.startButton.disabled = true;

  if (room.game_state) {
    applyOnlineState(room.game_state);
  } else if (role === "host") {
    elements.createdCodeValue.textContent = "";
    elements.createdCode.hidden = true;
    setOnlineStatus(room.guest_name ? uiLabel("preGame", "onlineRestoring") : uiLabel("preGame", "onlineWaiting"), "success");
    if (room.guest_name) void startHostedRoomGame(room);
  } else {
    setOnlineStatus(uiLabel("preGame", "onlineJoined", { code: room.code }), "success");
  }

  await subscribeOnlineRoom();
  await subscribeOnlineActions();
}

async function joinOnlineRoom(options = {}) {
  const client = getOnlineClient();
  const code = elements.roomCode.value.trim().toUpperCase();
  const guestName = elements.playerOneName.value.trim() || uiLabel("preGame", "playerTwo");
  const fromInvite = Boolean(options.fromInvite && pendingInviteRoomCode());
  if (!client) {
    setOnlineStatus(uiLabel("preGame", "onlineUnavailable"), "error");
    return;
  }
  if (!/^[A-Z0-9]{6}$/.test(code)) {
    setOnlineStatus(uiLabel("preGame", "invalidGameCode"), "error");
    return;
  }
  const saved = readOnlineSession();
  if (saved?.code === code) {
    await reconnectSavedRoom();
    if (fromInvite) clearInviteLink();
    return;
  }
  const playerToken = makeAccessToken();
  const { data: joined, error: joinError } = await callOnlineRpc(client, "bura_join_room", {
    room_code: code,
    player_name: guestName,
    easy_play: Boolean(elements.easyPlay.checked),
    player_token: playerToken
  });
  if (joinError || !joined) {
    if (fromInvite) {
      clearInviteLink();
      showSetup();
      setOnlineStatus(uiLabel("preGame", "gameNotFound"), "error");
      return;
    }
    setOnlineStatus(uiLabel("preGame", "gameJustJoined"), "error");
    return;
  }
  await closeOtherHostedWaitingRooms(client, joined);
  await connectToOnlineRoom(client, joined, "guest", guestName, playerToken);
  if (fromInvite) clearInviteLink();
}

async function reconnectSavedRoom() {
  const authoritySession = readAuthoritySession();
  if (authoritySession && authorityIsConfigured()) {
    useSavedSessionDetails({ ...authoritySession, code: authoritySession.roomCode });
    setOnlineStatus(uiLabel("preGame", "reconnecting"), "success");
    await reconnectAuthoritySession(authoritySession);
    return;
  }
  const session = readOnlineSession();
  const client = getOnlineClient();
  if (!session || !client) {
    setOnlineStatus(uiLabel("preGame", "reconnectNeedsCode"), "error");
    return;
  }

  useSavedSessionDetails(session);
  setOnlineStatus(uiLabel("preGame", "reconnecting"), "success");
  const { data, error } = await callOnlineRpc(client, "bura_get_room", {
    room_id: session.roomId,
    player_token: session.playerToken
  });
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
  await connectToOnlineRoom(client, data, session.role, session.playerName, session.playerToken);
}

async function subscribeOnlineRoom() {
  if (!onlineRoom || !onlineClient) return;
  if (onlineChannel) await onlineClient.removeChannel(onlineChannel);
  onlineRealtimeConnected = false;
  startOnlineSync();
  startOnlineConsistencySync();
  onlineChannel = onlineClient.channel(`bura:${onlineRoom.channel_secret}`)
    .on("broadcast", { event: "room" }, ({ payload }) => handleOnlineRoomUpdate(payload))
    .on("broadcast", { event: "action" }, ({ payload }) => queueOnlineActionEvent(payload, { live: true }))
    .subscribe((status, error) => {
      if (status === "SUBSCRIBED") {
        onlineRealtimeConnected = true;
        onlineActionsRealtimeConnected = true;
        updateOnlineSync();
        void refreshOnlineRoom();
        return;
      }
      if (["CHANNEL_ERROR", "TIMED_OUT", "CLOSED"].includes(status)) {
        onlineRealtimeConnected = false;
        onlineActionsRealtimeConnected = false;
        updateOnlineSync();
        if (error) setOnlineStatus(uiLabel("preGame", "liveSyncReconnecting"), "error");
      }
    });
  await refreshOnlineRoom();
}

async function refreshOnlineRoom() {
  if (!onlineRoom || !onlineClient || onlineSyncInFlight) return;
  onlineSyncInFlight = true;
  const roomId = onlineRoom.id;
  try {
    const { data, error } = await callOnlineRpc(onlineClient, "bura_get_room", {
      room_id: roomId,
      player_token: currentPlayerToken()
    });
    if (error) {
      setOnlineStatus(uiLabel("preGame", "onlineActionFailed"), "error");
      return;
    }
    if (!data || onlineRoom?.id !== roomId) return;
    handleOnlineRoomUpdate(data);
    await refreshOnlineActions();
  } finally {
    onlineSyncInFlight = false;
  }
}

function startOnlineSync() {
  const waitingForInitialDeal = state.phase === "setup" && Boolean(onlineRoom?.guest_name);
  if ((onlineRealtimeConnected && onlineActionsRealtimeConnected && !waitingForInitialDeal) || onlineSyncTimer !== null) return;
  onlineSyncTimer = window.setInterval(refreshOnlineRoom, ONLINE_FALLBACK_SYNC_INTERVAL_MS);
}

function stopOnlineSync() {
  if (onlineSyncTimer === null) return;
  window.clearInterval(onlineSyncTimer);
  onlineSyncTimer = null;
}

function updateOnlineSync() {
  const waitingForInitialDeal = state.phase === "setup" && Boolean(onlineRoom?.guest_name);
  if (onlineRealtimeConnected && onlineActionsRealtimeConnected && !waitingForInitialDeal) stopOnlineSync();
  else startOnlineSync();
}

function startOnlineConsistencySync() {
  if (onlineConsistencySyncTimer !== null) return;
  onlineConsistencySyncTimer = window.setInterval(() => {
    // The compact action stream is the normal safety net. A full checkpoint
    // is fetched only for a gap, failed replay, or a Realtime room update.
    void refreshOnlineActions();
    const phaseDeadlinePassed = (Number.isFinite(state.pauseDeadline) && state.pauseDeadline <= gameNow())
      || (Number.isFinite(state.dealDeadline) && state.dealDeadline <= gameNow());
    if (state.onlineRole === "guest" && phaseDeadlinePassed) void refreshOnlineRoom();
  }, ONLINE_CONSISTENCY_SYNC_INTERVAL_MS);
}

function stopOnlineConsistencySync() {
  if (onlineConsistencySyncTimer === null) return;
  window.clearInterval(onlineConsistencySyncTimer);
  onlineConsistencySyncTimer = null;
}

async function startHostedRoomGame(room) {
  if (onlineGameStartInFlight || state.phase !== "setup") return;
  onlineGameStartInFlight = true;
  try {
  let currentRoom = room;
  const savedAssignment = currentRoom.settings?.assignment;
  const hasSavedAssignment = [0, 1].includes(savedAssignment?.hostIndex)
    && [0, 1].includes(savedAssignment?.guestIndex)
    && savedAssignment.hostIndex !== savedAssignment.guestIndex;
  const sameNames = samePlayerName(currentRoom.host_name, currentRoom.guest_name);
  const hostPlayerIndex = hasSavedAssignment
    ? savedAssignment.hostIndex
    : sameNames && Math.random() >= 0.5 ? 1 : 0;
  const onlineAssignment = hasSavedAssignment
    ? savedAssignment
    : { hostIndex: hostPlayerIndex, guestIndex: 1 - hostPlayerIndex };

  if (Number.isFinite(currentRoom.settings?.matchTarget)) {
    elements.matchTarget.value = currentRoom.settings.matchTarget;
    document.querySelector("#match-target-value").value = currentRoom.settings.matchTarget;
    document.querySelector("#match-target-value").textContent = currentRoom.settings.matchTarget;
  }
  const persistedSettings = { ...(currentRoom.settings || {}) };
  if (!hasSavedAssignment) persistedSettings.assignment = onlineAssignment;
  if (!persistedSettings.dealSeed) persistedSettings.dealSeed = makeDealSeed();
  if (!hasSavedAssignment || persistedSettings.dealSeed !== currentRoom.settings?.dealSeed) {
    const { data, error } = await callOnlineRpc(onlineClient, "bura_update_room", {
      room_id: currentRoom.id,
      player_token: currentPlayerToken(),
      room_patch: { settings: persistedSettings },
      expected_revision: onlineLatestRevision
    });
    if (error?.message === "revision_conflict") {
      const { data: refreshedRoom } = await callOnlineRpc(onlineClient, "bura_get_room", {
        room_id: currentRoom.id,
        player_token: currentPlayerToken()
      });
      if (refreshedRoom?.guest_name) {
        window.setTimeout(() => void startHostedRoomGame(refreshedRoom), 0);
        return;
      }
    }
    if (error || !data) {
      setOnlineStatus(uiLabel("preGame", "onlineActionFailed"), "error");
      return;
    }
    currentRoom = data;
    onlineRoom = { ...onlineRoom, ...data };
    onlineLatestRevision = Number(data.revision) || onlineLatestRevision;
  }

  startLocalGame({
    online: true,
    onlineRole: "host",
    onlineRoomId: currentRoom.id,
    onlineRoomCode: currentRoom.code,
    hostName: currentRoom.host_name,
    guestName: currentRoom.guest_name,
    hostPlayerIndex: onlineAssignment.hostIndex,
    localPlayerIndex: onlineAssignment.hostIndex,
    onlineAssignment,
    easyPlayByPlayer: roomEasyPlayByPlayer(currentRoom, onlineAssignment),
    dealSeed: persistedSettings.dealSeed,
    persistedSettings,
    firstLeader: Number.isInteger(persistedSettings.firstLeader) ? persistedSettings.firstLeader : Math.floor(Math.random() * 2),
    eventCursor: onlineLastEventId,
    eventSequence: onlineLastEventSequence
  });
  } finally {
    onlineGameStartInFlight = false;
  }
}

function handleOnlineRoomUpdate(nextRoom) {
  if (leaveExpiredOnlineRoom(nextRoom)) return;
  const nextRevision = Number(nextRoom.revision) || 0;
  if (nextRevision && nextRevision < onlineLatestRevision) return;
  if (nextRevision) onlineLatestRevision = nextRevision;
  const nextUpdatedAt = Date.parse(nextRoom.updated_at || "") || 0;
  if (nextUpdatedAt && nextUpdatedAt < onlineLatestRoomUpdate) return;
  if (nextUpdatedAt) onlineLatestRoomUpdate = nextUpdatedAt;
  onlineRoom = nextRoom;
  if (nextRoom.status === "finished" && state.phase === "setup" && !nextRoom.guest_name) {
    clearOnlineSession(nextRoom.id);
    showSetup();
    return;
  }
  if (state.onlineRole === "host" && nextRoom.guest_name && state.phase === "setup") {
    void closeOtherHostedWaitingRooms(onlineClient, nextRoom);
    void startHostedRoomGame(nextRoom);
    return;
  }
  const checkpointIsStale = nextRoom.game_state && SYNC_CORE.isCheckpointStale(
    nextRoom.game_state,
    onlineLastEventSequence,
    onlineLastEventId
  );
  const checkpointIsAhead = nextRoom.game_state && SYNC_CORE.isCheckpointAhead(
    nextRoom.game_state,
    onlineLastEventSequence,
    onlineLastEventId
  );
  const checkpointHasNewerRoomRevision = nextRoom.game_state && SYNC_CORE.isCheckpointRevisionNewer(
    nextRevision,
    onlineLastAppliedCheckpointRevision
  );
  const isInitialGameCheckpoint = state.phase === "setup" && nextRoom.status === "playing";
  if (state.onlineRole !== "host" && nextRoom.game_state
    && !checkpointIsStale
    && (checkpointIsAhead || checkpointHasNewerRoomRevision || isInitialGameCheckpoint)) {
    applyOnlineState(nextRoom.game_state, nextRevision);
  }
  if (nextRoom.game_state && (checkpointIsStale || state.onlineRole === "host")) {
    void refreshOnlineActions();
  }
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

async function subscribeOnlineActions() {
  if (!onlineRoom || !onlineClient) return;
  onlineActionsRealtimeConnected = onlineRealtimeConnected;
  updateOnlineSync();
  await refreshOnlineActions();
}

async function refreshOnlineActions(options = {}) {
  if (!onlineRoom || !onlineClient) return;
  if (onlineActionsSyncInFlight) {
    if (options.force) onlineActionsRefreshQueued = true;
    return;
  }
  onlineActionsSyncInFlight = true;
  const roomId = onlineRoom.id;
  try {
    do {
      onlineActionsRefreshQueued = false;
      const { data, error } = await callOnlineRpc(onlineClient, "bura_fetch_actions", {
        room_id: roomId,
        player_token: currentPlayerToken(),
        after_id: onlineLastEventId
      });
      if (error || onlineRoom?.id !== roomId) return;
      (data || []).forEach((event) => queueOnlineActionEvent(event, { replay: true }));
      await onlineEventQueue;
    } while (onlineActionsRefreshQueued && onlineRoom?.id === roomId);
  } finally {
    onlineActionsSyncInFlight = false;
  }
}

function queueOnlineActionEvent(actionEvent, options = {}) {
  const eventId = Number(actionEvent?.id) || 0;
  const eventSequence = Number(actionEvent?.sequence) || 0;
  if (!eventId || eventId <= onlineLastEventId) return;
  onlineEventQueue = onlineEventQueue
    .catch(() => {})
    .then(async () => {
      if (eventId <= onlineLastEventId) return;
      // A checkpoint can already include this action's resulting state.
      if (eventSequence && eventSequence <= state.eventSequence) {
        onlineLastEventId = eventId;
        onlineLastEventSequence = Math.max(onlineLastEventSequence, eventSequence);
        state.eventCursor = Math.max(Number(state.eventCursor) || 0, eventId);
        state.eventSequence = Math.max(Number(state.eventSequence) || 0, eventSequence);
        return;
      }
      if (SYNC_CORE.hasSequenceGap(eventSequence, onlineLastEventSequence)) {
        await recoverOnlineState({ forceCheckpoint: true, deferActionReplay: true });
        return;
      }
      let consumed = true;
      if (actionEvent.kind === "resolved") {
        if (onlinePendingAction?.clientActionId
          && actionEvent.action?.clientActionId === onlinePendingAction.clientActionId) {
          clearPendingOnlineAction();
          onlinePendingSelection = null;
          onlinePendingPlay = null;
          state.actionPending = false;
          render();
        } else {
          consumed = applyResolvedOnlineAction(actionEvent);
        }
      }
      if (consumed === false) {
        if (state.onlineRole === "host") {
          onlineLastEventId = eventId;
          if (eventSequence) onlineLastEventSequence = Math.max(onlineLastEventSequence, eventSequence);
          state.eventCursor = eventId;
          state.eventSequence = onlineLastEventSequence;
          requestOnlineCheckpoint();
        } else {
          await recoverOnlineState({ forceCheckpoint: true, deferActionReplay: true });
        }
        return;
      }
      onlineLastEventId = eventId;
      if (eventSequence) onlineLastEventSequence = Math.max(onlineLastEventSequence, eventSequence);
      state.eventCursor = Math.max(Number(state.eventCursor) || 0, eventId);
      state.eventSequence = Math.max(Number(state.eventSequence) || 0, eventSequence);
      if (actionEvent.kind === "resolved"
        && state.onlineRole === "host"
        && SYNC_CORE.shouldCheckpoint(onlineLastEventSequence, onlineLastCheckpointSequence, state)) {
        requestOnlineCheckpoint();
      }
    });
}

async function recoverOnlineState({ forceCheckpoint = false, deferActionReplay = false } = {}) {
  const roomId = onlineRoom?.id;
  if (!roomId) return;
  const { data, error } = await callOnlineRpc(onlineClient, "bura_get_room", {
    room_id: roomId,
    player_token: currentPlayerToken()
  });
  if (error || !data || onlineRoom?.id !== roomId) return;
  onlineRoom = data;
  onlineLatestRevision = Math.max(onlineLatestRevision, Number(data.revision) || 0);
  const checkpointIsStale = SYNC_CORE.isCheckpointStale(
    data.game_state,
    onlineLastEventSequence,
    onlineLastEventId
  );
  const checkpointHasNewerRoomRevision = SYNC_CORE.isCheckpointRevisionNewer(
    Number(data.revision) || 0,
    onlineLastAppliedCheckpointRevision
  );
  if (data.game_state && (forceCheckpoint || !checkpointIsStale || checkpointHasNewerRoomRevision)) {
    if (forceCheckpoint) onlineAppliedStateHash = "";
    applyOnlineState(data.game_state, Number(data.revision) || 0, { resetActionCursor: forceCheckpoint });
  }
  if (deferActionReplay) {
    window.setTimeout(() => void refreshOnlineActions({ force: true }), 0);
    return;
  }
  await refreshOnlineActions({ force: true });
}

function executeOnlineAction(action) {
  const playerIndex = Number(action?.playerIndex);
  if (![0, 1].includes(playerIndex)) return false;
  const previousLocalIndex = state.localPlayerIndex;
  state.localPlayerIndex = playerIndex;
  onlineApplyingRemoteAction = true;
  let applied = false;
  try {
    if (action.type === "play") {
      const cardIds = compactCards(action.cardIds).map(cardId);
      const handIds = new Set(state.players[playerIndex].hand.map((card) => card.id));
      if (!canPlayCardsFor(playerIndex)
        || !cardIds.length
        || new Set(cardIds).size !== cardIds.length
        || cardIds.some((id) => !handIds.has(id))) return false;
      applied = playCardsByIds(playerIndex, cardIds);
    } else if (action.type === "continue" && canReviewWonTrickFor(playerIndex)) {
      continueTurn();
      applied = true;
    } else if (action.type === "claim" && canReviewWonTrickFor(playerIndex)) {
      claimPoints();
      applied = true;
    } else if (action.type === "bura" && state.activePlayer === playerIndex && hasBura(playerIndex)) {
      declareBura();
      applied = true;
    } else if (action.type === "maliutka" && maliutkaCards(playerIndex).length === HAND_SIZE) {
      declareMaliutka();
      applied = true;
    } else if (action.type === "maliutka-continue" && canResolveMaliutkaFor(playerIndex)) {
      resolveMaliutka();
      applied = true;
    } else if (action.type === "offer" && canOfferIncreaseFor(playerIndex)) {
      offerIncrease();
      applied = true;
    } else if (action.type === "accept-offer" && state.offer?.to === playerIndex) {
      respondToOffer(true, playerIndex);
      applied = true;
    } else if (action.type === "decline-offer" && state.offer?.to === playerIndex) {
      respondToOffer(false, playerIndex);
      applied = true;
    } else if (action.type === "timeout" && state.activePlayer === playerIndex && isTimedTurnPhase()) {
      state.turnReserveMs = [...(state.turnReserveMs || [TURN_RESERVE_MS, TURN_RESERVE_MS])];
      state.turnReserveMs[playerIndex] = 0;
      finishMatchByTimeout(playerIndex, action.matchDeadline);
      applied = true;
    }
  } finally {
    onlineApplyingRemoteAction = false;
    state.localPlayerIndex = previousLocalIndex;
  }
  if (applied && action.turnClock) applyTurnClock(action.turnClock);
  return applied;
}

function applyResolvedOnlineAction(actionEvent) {
  const action = actionEvent.action;
  if (!action) return;
  if (action.playerIndex === state.localPlayerIndex) {
    if (onlinePendingAction?.clientActionId
      && action.clientActionId
      && onlinePendingAction.clientActionId !== action.clientActionId) return false;
    onlinePendingSelection = null;
    onlinePendingPlay = null;
    clearPendingOnlineAction();
    state.actionPending = false;
  }
  const applied = executeOnlineAction(action);
  if (applied) {
    state.eventCursor = Math.max(Number(state.eventCursor) || 0, Number(actionEvent.id) || 0);
    state.eventSequence = Math.max(Number(state.eventSequence) || 0, Number(actionEvent.sequence) || 0);
    render();
  }
  return applied;
}

function applyOnlineState(remoteState, roomRevision = onlineLatestRevision, options = {}) {
  const normalizedRemoteState = SYNC_CORE.normalizeCheckpoint(remoteState);
  const remoteHash = JSON.stringify(normalizedRemoteState);
  if (onlineAppliedStateHash === remoteHash && !options.resetActionCursor) {
    onlineLastAppliedCheckpointRevision = Math.max(onlineLastAppliedCheckpointRevision, Number(roomRevision) || 0);
    return;
  }
  const restoredState = restoreOnlineCardState(normalizedRemoteState, onlineRoom);
  const checkpointEventId = Math.max(0, Number(restoredState.eventCursor) || 0);
  const checkpointEventSequence = Math.max(0, Number(restoredState.eventSequence) || 0);
  if (options.resetActionCursor) {
    onlineLastEventId = checkpointEventId;
    onlineLastEventSequence = checkpointEventSequence;
    onlineLastCheckpointEventId = checkpointEventId;
    onlineLastCheckpointSequence = checkpointEventSequence;
  } else {
    onlineLastEventId = Math.max(onlineLastEventId, checkpointEventId);
    onlineLastEventSequence = Math.max(onlineLastEventSequence, checkpointEventSequence);
    onlineLastCheckpointEventId = Math.max(onlineLastCheckpointEventId, checkpointEventId);
    onlineLastCheckpointSequence = Math.max(onlineLastCheckpointSequence, checkpointEventSequence);
  }
  onlineLastAppliedCheckpointRevision = Math.max(onlineLastAppliedCheckpointRevision, Number(roomRevision) || 0);
  const wasInSetup = state.phase === "setup";
  const onlineAssignment = onlineRoom?.settings?.assignment || restoredState.onlineAssignment || null;
  const localIndex = state.onlineRole === "guest"
    ? onlineAssignment?.guestIndex ?? 1
    : onlineAssignment?.hostIndex ?? 0;
  state = {
    ...restoredState,
    localPlayerIndex: localIndex,
    online: true,
    onlineRole: state.onlineRole || "guest",
    onlineRoomId: onlineRoom?.id || normalizedRemoteState.onlineRoomId,
    onlineRoomCode: onlineRoom?.code || normalizedRemoteState.onlineRoomCode,
    onlineAssignment,
    eventCursor: options.resetActionCursor
      ? checkpointEventId
      : Math.max(Number(restoredState.eventCursor) || 0, onlineLastEventId),
    eventSequence: options.resetActionCursor
      ? checkpointEventSequence
      : Math.max(Number(restoredState.eventSequence) || 0, onlineLastEventSequence),
    dummyTimer: null,
    pauseTimer: null,
    actionTimer: null,
    dealTimer: null,
    actionPending: false,
    selectedIds: Array.isArray(restoredState.selectedIds) ? restoredState.selectedIds : []
  };
  if (state.activePlayer === localIndex && onlinePendingSelection) {
    const remoteSelection = JSON.stringify(normalizedRemoteState.selectedIds || []);
    const pendingSelection = JSON.stringify(onlinePendingSelection);
    if (remoteSelection === pendingSelection) onlinePendingSelection = null;
    else state.selectedIds = [...onlinePendingSelection];
  } else {
    onlinePendingSelection = null;
  }
  if (onlinePendingPlay) {
    const playedCards = onlinePendingPlay.phase === "lead"
      ? (normalizedRemoteState.trick?.leadPlayer === onlinePendingPlay.playerIndex && normalizedRemoteState.trick?.leadCards)
        || (normalizedRemoteState.lastTrick?.leadPlayer === onlinePendingPlay.playerIndex && normalizedRemoteState.lastTrick?.leadCards)
      : (normalizedRemoteState.trick?.answerPlayer === onlinePendingPlay.playerIndex && normalizedRemoteState.trick?.answerCards)
        || (normalizedRemoteState.lastTrick?.answerPlayer === onlinePendingPlay.playerIndex && normalizedRemoteState.lastTrick?.answerCards);
    const confirmedIds = compactCards(playedCards);
    const pendingIds = onlinePendingPlay.cardIds;
    if (pendingIds.length === confirmedIds.length && pendingIds.every((id) => confirmedIds.includes(id))) {
      onlinePendingPlay = null;
    } else if (state.activePlayer === localIndex && state.phase !== "gameOver") {
      state.actionPending = true;
    } else {
      onlinePendingPlay = null;
    }
  }
  if (wasInSetup && state.dealNumber === 1 && !matchStartSoundPlayed) playMatchStartSound();
  elements.setupPanel.hidden = true;
  elements.brandHeading.hidden = false;
  elements.brandHeading.classList.add("in-game");
  elements.appShell.classList.add("game-view");
  elements.accountMenuButton.hidden = true;
  setAccountSidebarOpen(false);
  elements.settingsButton.hidden = false;
  elements.restartButton.hidden = false;
  if (state.phase === "gameOver") showResultPanel();
  else if (state.phase === "dealPause") showDealScoreSummary();
  else {
    setDealScoreSummaryVisible(false);
    elements.resultPanel.hidden = true;
  }
  elements.gamePanel.hidden = false;
  restoreOnlinePhaseDeadline();
  startTurnTimer();
  render();
  onlineAppliedStateHash = remoteHash;
}

function restoreOnlinePhaseDeadline() {
  if (!onlineEnabled() || authorityOnlineEnabled()) return;
  if (state.pauseTimer !== null) window.clearTimeout(state.pauseTimer);
  if (state.dealTimer !== null) window.clearTimeout(state.dealTimer);
  state.pauseTimer = null;
  state.dealTimer = null;

  if (Number.isFinite(state.pauseDeadline)) {
    const finishPause = () => {
      if (state.onlineRole === "guest") return;
      if (state.phase === "buraReveal") {
        const declarerIndex = state.trick?.leadPlayer;
        if ([0, 1].includes(declarerIndex)) finishDeal(declarerIndex, "declaredBuraResult");
        return;
      }
      if (state.phase === "trickPause" && state.lastTrick) {
        const winnerIndex = state.lastTrick.winnerIndex;
        finishOnlineAutomaticTrickPause(winnerIndex);
      }
    };
    const remaining = Math.max(0, state.pauseDeadline - gameNow());
    state.pauseTimer = window.setTimeout(finishPause, remaining);
  }

  if (state.phase === "dealPause" && Number.isFinite(state.dealDeadline)) {
    const finishDealPause = () => {
      if (state.onlineRole === "guest") return;
      if (state.matchWon) startMatchSummary();
      else startNextDeal(state.dealWinner);
    };
    state.dealTimer = window.setTimeout(finishDealPause, Math.max(0, state.dealDeadline - gameNow()));
  }
}

function publishOnlineState() {
  if (authorityOnlineEnabled()) return;
  if (onlineApplyingRemoteAction
    || onlineRematchStarting
    || !onlineCheckpointNeeded
    || !onlineEnabled()
    || state.onlineRole !== "host") return;
  const nextState = serializedState();
  onlineStateHash = JSON.stringify(nextState);
  onlineCheckpointNeeded = false;
  onlineRoomWriteQueue = onlineRoomWriteQueue.catch(() => {}).then(async () => {
    const { data, error } = await callOnlineRpc(onlineClient, "bura_update_room", {
      room_id: onlineRoom.id,
      player_token: currentPlayerToken(),
      room_patch: {
        game_state: nextState,
        status: state.phase === "gameOver" ? "finished" : "playing"
      },
      expected_revision: onlineLatestRevision
    }, { silentErrors: ["revision_conflict"] });
    if (error || !data) {
      onlineCheckpointNeeded = true;
      if (error?.message === "revision_conflict") {
        const { data: currentRoom } = await callOnlineRpc(onlineClient, "bura_get_room", {
          room_id: onlineRoom.id,
          player_token: currentPlayerToken()
        });
        if (currentRoom) {
          onlineRoom = currentRoom;
          onlineLatestRevision = Number(currentRoom.revision) || onlineLatestRevision;
          window.setTimeout(requestOnlineCheckpoint, 0);
        }
        return;
      }
      setOnlineStatus(uiLabel("preGame", "onlineActionFailed"), "error");
      return;
    }
    onlineRoom = { ...onlineRoom, ...data };
    onlineLatestRevision = Number(data.revision) || onlineLatestRevision;
    onlineLastCheckpointEventId = Number(nextState.eventCursor) || onlineLastCheckpointEventId;
    onlineLastCheckpointSequence = Number(nextState.eventSequence) || onlineLastCheckpointSequence;
  });
}

function requestOnlineCheckpoint() {
  if (!onlineEnabled() || state.onlineRole !== "host") return;
  onlineCheckpointNeeded = true;
  publishOnlineState();
}

async function emitOnlineAction(kind, action, options = {}) {
  if (!onlineEnabled()) return null;
  const clientActionId = options.clientActionId || action.clientActionId || SYNC_CORE.createActionId(window.crypto?.randomUUID?.bind(window.crypto));
  const actionPayload = { ...action, clientActionId };
  const checkpoint = options.checkpoint
    ? { ...serializedState(), eventSequence: onlineLastEventSequence + 1 }
    : null;
  const { data, error } = await callOnlineRpc(onlineClient, "bura_submit_action", {
    room_id: onlineRoom.id,
    player_token: currentPlayerToken(),
    action_kind: kind,
    action_payload: actionPayload,
    action_client_id: clientActionId,
    checkpoint,
    extend_lead: Boolean(options.extendLead)
  });
  if (error || !data) {
    setOnlineStatus(uiLabel("preGame", "onlineActionFailed"), "error");
    return null;
  }
  return data;
}

async function emitResolvedOnlineAction(action) {
  const shouldCheckpoint = state.onlineRole === "host" && SYNC_CORE.shouldCheckpoint(
    onlineLastEventSequence + 1,
    onlineLastCheckpointSequence,
    state,
    action
  );
  const extendLead = getLeadActivityKey(state) !== onlineLastLeadActivityKey;
  const event = await emitOnlineAction("resolved", action, { checkpoint: shouldCheckpoint, extendLead });
  if (!event) return false;
  onlineLastEventId = Math.max(onlineLastEventId, Number(event.id) || 0);
  onlineLastEventSequence = Math.max(onlineLastEventSequence, Number(event.sequence) || 0);
  onlineLatestRevision = Math.max(onlineLatestRevision, Number(event.revision) || 0);
  state.eventCursor = onlineLastEventId;
  state.eventSequence = onlineLastEventSequence;
  if (shouldCheckpoint) {
    onlineLastCheckpointEventId = onlineLastEventId;
    onlineLastCheckpointSequence = onlineLastEventSequence;
  }
  if (extendLead) onlineLastLeadActivityKey = getLeadActivityKey(state);
  return true;
}

function clearPendingOnlineAction() {
  if (onlinePendingAction?.timer !== null && onlinePendingAction?.timer !== undefined) {
    window.clearTimeout(onlinePendingAction.timer);
  }
  onlinePendingAction = null;
}

function startPendingOnlineAction(action, attempt = 1) {
  clearPendingOnlineAction();
  const pending = { action, attempt, clientActionId: action.clientActionId, timer: null };
  pending.timer = window.setTimeout(async () => {
    if (onlinePendingAction?.clientActionId !== pending.clientActionId) return;
    await refreshOnlineRoom();
    if (onlinePendingAction?.clientActionId !== pending.clientActionId) return;
    if (attempt < ONLINE_ACTION_MAX_RETRIES) {
      startPendingOnlineAction(action, attempt + 1);
      const retried = await emitOnlineAction("resolved", action, {
        clientActionId: pending.clientActionId,
        extendLead: Boolean(action.extendLead) || getLeadActivityKey(state) !== onlineLastLeadActivityKey
      });
      if (retried) {
        const retriedLeadKey = getLeadActivityKey(state);
        onlineLastEventId = Math.max(onlineLastEventId, Number(retried.id) || 0);
        onlineLastEventSequence = Math.max(onlineLastEventSequence, Number(retried.sequence) || 0);
        state.eventCursor = onlineLastEventId;
        state.eventSequence = onlineLastEventSequence;
        if (retriedLeadKey !== onlineLastLeadActivityKey) onlineLastLeadActivityKey = retriedLeadKey;
        clearPendingOnlineAction();
      }
      return;
    }
    clearPendingOnlineAction();
    onlinePendingPlay = null;
    state.actionPending = false;
    restorePausedTurnTimer();
    setOnlineStatus(uiLabel("preGame", "liveSyncReconnecting"), "error");
    render();
  }, ONLINE_ACTION_ACK_TIMEOUT_MS + SYNC_CORE.nextRetryDelay(attempt));
  onlinePendingAction = pending;
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
  void callOnlineRpc(onlineClient, "bura_request_rematch", {
    room_id: onlineRoom.id,
    player_token: currentPlayerToken(),
    deadline
  }).then(({ data, error }) => {
    if (error || !data) setOnlineStatus(uiLabel("preGame", "onlineActionFailed"), "error");
    else onlineRoom = { ...onlineRoom, ...data };
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
    eventCursor: onlineLastEventId,
    // Room action sequences are monotonic across rematches. The fresh match
    // begins from this cursor so both clients accept its first lead.
    eventSequence: onlineLastEventSequence,
    isRematch: true
  });
  const nextState = serializedState();
  const nextSettings = { ...(onlineRoom.settings || {}), dealSeed: state.dealSeed };
  const roomUpdate = {
    game_state: nextState,
    settings: nextSettings,
    status: "playing",
    host_rematch: false,
    guest_rematch: false,
    rematch_deadline: null,
    extend_lead: true
  };
  onlineStateHash = JSON.stringify(nextState);
  onlineCheckpointNeeded = false;
  onlineLastLeadActivityKey = getLeadActivityKey(nextState);
  onlineRoom = { ...onlineRoom, ...roomUpdate };
  const { data, error } = await callOnlineRpc(onlineClient, "bura_update_room", {
    room_id: onlineRoom.id,
    player_token: currentPlayerToken(),
    room_patch: roomUpdate,
    expected_revision: onlineLatestRevision
  });
  onlineRematchStarting = false;
  if (error) {
    onlineStateHash = "";
    onlineCheckpointNeeded = true;
    setOnlineStatus(uiLabel("preGame", "onlineActionFailed"), "error");
    requestOnlineCheckpoint();
    render();
  } else if (data) {
    onlineRoom = { ...onlineRoom, ...data };
    onlineLatestRevision = Number(data.revision) || onlineLatestRevision;
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
  setInviteJoinGateVisible(false);
  clearOpeningTurnSignal();
  clearDummyFinalChoice();
  clearTurnTimer();
  turnTimerPauseSnapshot = null;
  matchStartSoundPlayed = false;
  if (state.pauseTimer !== null) window.clearTimeout(state.pauseTimer);
  if (state.actionTimer !== null) window.clearTimeout(state.actionTimer);
  if (state.dealTimer !== null) window.clearTimeout(state.dealTimer);
  if (onlineChannel && onlineClient) onlineClient.removeChannel(onlineChannel);
  authorityConnection?.close();
  authorityConnection = null;
  if (authorityReconnectTimer !== null) window.clearTimeout(authorityReconnectTimer);
  authorityReconnectTimer = null;
  authorityReconnectAttempts = 0;
  stopOnlineSync();
  stopOnlineConsistencySync();
  onlineRealtimeConnected = false;
  onlineActionsRealtimeConnected = false;
  onlineChannel = null;
  onlineRoom = null;
  onlineLastEventId = 0;
  onlineLastEventSequence = 0;
  onlineLastCheckpointEventId = 0;
  onlineLastCheckpointSequence = 0;
  onlineLatestRoomUpdate = 0;
  onlineLatestRevision = 0;
  onlineLastAppliedCheckpointRevision = 0;
  onlineSyncInFlight = false;
  onlineActionsSyncInFlight = false;
  onlineActionsRefreshQueued = false;
  onlineStateHash = "";
  onlineAppliedStateHash = "";
  onlineEventQueue = Promise.resolve();
  onlineRoomWriteQueue = Promise.resolve();
  onlinePendingSelection = null;
  onlinePendingPlay = null;
  clearPendingOnlineAction();
  onlineCheckpointNeeded = false;
  hostedRoomStartInFlight = false;
  onlineGameStartInFlight = false;
  elements.createdCode.hidden = true;
  elements.createdCodeValue.textContent = "";
  elements.startButton.disabled = false;
  setLabelText(elements.startButton, "preGame", "dealCards");
  state = createEmptyState();
  elements.setupPanel.hidden = false;
  elements.brandHeading.hidden = false;
  elements.brandHeading.classList.remove("in-game");
  elements.appShell.classList.remove("game-view");
  elements.accountMenuButton.hidden = false;
  elements.settingsButton.hidden = true;
  elements.restartButton.hidden = true;
  elements.gamePanel.hidden = true;
  elements.resultPanel.hidden = true;
  setOnlineStatus(elements.onlineMode?.checked ? uiLabel("preGame", "onlineModeInstruction") : "");
  render();
  updateOnlineConnectionControls();
  void refreshAuthorityAccountControls();
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

function isTimedTurnPhase(phase = state.phase) {
  if (!["lead", "answer", "trickPause", "offerPending", "maliutkaPending"].includes(phase)) return false;
  if (phase === "trickPause" && isDealExhausted()) return false;
  return !(state.dummyOpponent && state.activePlayer === 1);
}

function activeTurnReserveMs() {
  return Math.max(0, Number(state.turnReserveMs?.[state.activePlayer]) || 0);
}

function getTurnTiming(now = gameNow()) {
  if (!isTimedTurnPhase() || !Number.isFinite(state.turnStartedAt)) {
    const elapsedMs = Math.max(0, Number(state.turnElapsedMs) || 0);
    return {
      elapsedMs,
      turnRemainingMs: Math.max(0, TURN_TIME_MS - elapsedMs),
      reserveRemainingMs: activeTurnReserveMs(),
      usingReserve: elapsedMs >= TURN_TIME_MS,
      expired: elapsedMs >= TURN_TIME_MS + activeTurnReserveMs()
    };
  }
  const elapsedMs = Math.max(0, (Number(state.turnElapsedMs) || 0) + now - state.turnStartedAt);
  const turnRemainingMs = Math.max(0, TURN_TIME_MS - elapsedMs);
  const reserveRemainingMs = Math.max(0, activeTurnReserveMs() - Math.max(0, elapsedMs - TURN_TIME_MS));
  return {
    elapsedMs,
    turnRemainingMs,
    reserveRemainingMs,
    usingReserve: elapsedMs >= TURN_TIME_MS,
    expired: elapsedMs >= TURN_TIME_MS + activeTurnReserveMs()
  };
}

function getTurnWarningState(now = gameNow()) {
  const timing = getTurnTiming(now);
  if (timing.expired) return "expired";
  if (timing.usingReserve && timing.reserveRemainingMs < 10 * 1000) return "critical";
  if (timing.elapsedMs >= TURN_WARNING_AT_MS) return "warning";
  return "normal";
}

function stopTurnWarningSound() {
  if (!turnWarningAudio) return;
  turnWarningAudio.pause();
  turnWarningAudio.currentTime = 0;
  turnWarningAudio = null;
  turnWarningMode = "";
}

function updateTurnWarningSound() {
  const warningState = getTurnWarningState();
  const soundMode = warningState === "critical" ? "loop" : warningState === "warning" ? "once" : "";
  if (!soundMode) {
    stopTurnWarningSound();
    return;
  }
  const warningKey = `${state.activePlayer}:${state.turnStartedAt}`;
  if (soundMode === "once" && turnWarningPlayedKey === warningKey) return;
  if (soundMode === turnWarningMode && turnWarningAudio && !turnWarningAudio.paused) return;
  stopTurnWarningSound();
  try {
    const audio = new Audio(TURN_WARNING_SOUND_SOURCE);
    audio.preload = "auto";
    audio.loop = soundMode === "loop";
    audio.volume = 0.42;
    turnWarningAudio = audio;
    turnWarningMode = soundMode;
    if (soundMode === "once") turnWarningPlayedKey = warningKey;
    audio.play().catch(() => {});
  } catch (error) {
    // Audio is optional and may be unavailable in a locked-down browser.
  }
}

function clearTurnTimer() {
  if (turnTimerInterval !== null) window.clearInterval(turnTimerInterval);
  turnTimerInterval = null;
  turnTimerPlayerIndex = null;
  stopTurnWarningSound();
}

function startTurnTimer() {
  clearTurnTimer();
  if (!isTimedTurnPhase() || !Number.isFinite(state.turnStartedAt)) return;
  const timing = getTurnTiming();
  if (timing.expired) {
    handleTurnTimeout();
    return;
  }
  turnTimerPlayerIndex = state.activePlayer;
  updateTurnWarningSound();
  renderTurnTimer();
  turnTimerInterval = window.setInterval(updateTurnTimer, TURN_TIMER_TICK_MS);
}

function pauseTurnTimer() {
  if (!Number.isFinite(state.turnStartedAt) || !isTimedTurnPhase()) return;
  const timing = getTurnTiming();
  turnTimerPauseSnapshot = {
    activePlayer: state.activePlayer,
    elapsedMs: timing.elapsedMs,
    reserveMs: [...(state.turnReserveMs || [TURN_RESERVE_MS, TURN_RESERVE_MS])]
  };
  const nextReserve = [...(state.turnReserveMs || [TURN_RESERVE_MS, TURN_RESERVE_MS])];
  nextReserve[state.activePlayer] = timing.reserveRemainingMs;
  state.turnReserveMs = nextReserve;
  state.turnElapsedMs = 0;
  state.turnStartedAt = null;
  clearTurnTimer();
}

function restorePausedTurnTimer() {
  if (!turnTimerPauseSnapshot || turnTimerPauseSnapshot.activePlayer !== state.activePlayer) {
    startTurnTimer();
    return;
  }
  state.turnReserveMs = [...turnTimerPauseSnapshot.reserveMs];
  state.turnElapsedMs = turnTimerPauseSnapshot.elapsedMs;
  state.turnStartedAt = gameNow();
  turnTimerPauseSnapshot = null;
  startTurnTimer();
}

function resumeTurnFor(playerIndex = state.activePlayer) {
  state.activePlayer = playerIndex;
  state.turnReserveMs = Array.isArray(state.turnReserveMs)
    ? state.turnReserveMs.map((value) => Math.max(0, Number(value) || 0))
    : [TURN_RESERVE_MS, TURN_RESERVE_MS];
  state.turnStartedAt = gameNow();
  state.turnElapsedMs = 0;
  turnTimerPauseSnapshot = null;
  turnWarningPlayedKey = "";
  startTurnTimer();
}

function getTurnClockPayload() {
  return {
    startedAt: Number.isFinite(state.turnStartedAt) ? state.turnStartedAt : null,
    elapsedMs: Math.max(0, Number(state.turnElapsedMs) || 0),
    reserveMs: [...(state.turnReserveMs || [TURN_RESERVE_MS, TURN_RESERVE_MS])]
  };
}

function applyTurnClock(clock) {
  if (!clock || !Array.isArray(clock.reserveMs)) return;
  clearTurnTimer();
  state.turnReserveMs = clock.reserveMs.map((value) => Math.max(0, Number(value) || 0));
  state.turnStartedAt = Number.isFinite(clock.startedAt) ? clock.startedAt : null;
  state.turnElapsedMs = Math.max(0, Number(clock.elapsedMs) || 0);
  startTurnTimer();
}

function updateTurnTimer() {
  if (turnTimerPlayerIndex !== state.activePlayer || !isTimedTurnPhase()) {
    clearTurnTimer();
    return;
  }
  if (getTurnTiming().expired) {
    clearTurnTimer();
    handleTurnTimeout();
    return;
  }
  updateTurnWarningSound();
  renderTurnTimer();
}

function handleTurnTimeout() {
  if (!isTimedTurnPhase() || state.phase === "gameOver" || state.phase === "dealPause") return;
  if (authorityOnlineEnabled()) {
    clearTurnTimer();
    setOnlineStatus(uiLabel("preGame", "liveSyncReconnecting"), "error");
    return;
  }
  const timedOutPlayer = state.activePlayer;
  const timedTurnStartedAt = Number(state.turnStartedAt) || 0;
  state.turnReserveMs = [...(state.turnReserveMs || [TURN_RESERVE_MS, TURN_RESERVE_MS])];
  state.turnReserveMs[timedOutPlayer] = 0;
  state.turnStartedAt = null;
  state.turnElapsedMs = 0;
  turnTimerPauseSnapshot = null;
  clearTurnTimer();
  const matchDeadline = new Date(gameNow() + MATCH_SUMMARY_MS).toISOString();
  finishMatchByTimeout(timedOutPlayer, matchDeadline);
  if (onlineEnabled()) {
    void emitResolvedOnlineAction({
      type: "timeout",
      playerIndex: timedOutPlayer,
      matchDeadline,
      turnClock: getTurnClockPayload(),
      clientActionId: `timeout-${state.dealNumber}-${timedOutPlayer}-${timedTurnStartedAt}`
    });
  }
}

function renderTurnTimer() {
  document.querySelectorAll("[data-turn-timer]").forEach((element) => {
    const playerIndex = Number(element.dataset.turnTimer);
    if (playerIndex !== state.activePlayer || !isTimedTurnPhase()) {
      element.textContent = "";
      element.hidden = true;
      return;
    }
    const timing = getTurnTiming();
    if (!timing.usingReserve) {
      element.textContent = "";
      element.hidden = true;
      return;
    }
    const seconds = Math.ceil((timing.usingReserve ? timing.reserveRemainingMs : timing.turnRemainingMs) / 1000);
    element.textContent = String(seconds);
    element.hidden = false;
    element.classList.toggle("is-reserve", timing.usingReserve);
    element.classList.toggle("is-critical", getTurnWarningState() === "critical");
  });
  document.querySelectorAll("[data-turn-ornaments]").forEach((element) => {
    const playerIndex = Number(element.dataset.turnOrnaments);
    const isActive = playerIndex === state.activePlayer && isTimedTurnPhase();
    const timing = isActive ? getTurnTiming() : null;
    element.classList.toggle("reserve-entry", Boolean(timing?.usingReserve && timing.elapsedMs < TURN_TIME_MS + 1250));
    element.classList.toggle("turn-critical", isActive && getTurnWarningState() === "critical");
  });
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
    if (onlineEnabled()) {
      onlinePendingSelection = null;
      onlinePendingPlay = null;
      scheduleOnlineAction("continue");
    } else {
      scheduleAction(continueTurn);
    }
    return;
  }
  if (!canPlayCardsFor(state.localPlayerIndex)) return;
  const selected = new Set(state.selectedIds);
  if (selected.has(cardId)) selected.delete(cardId);
  else selected.add(cardId);
  state.selectedIds = [...selected];
  render();
  if (easyPlayFor(state.localPlayerIndex) && shouldAutoPlay()) {
    if (onlineEnabled()) {
      scheduleOnlinePlay(selectedCards());
    } else {
      scheduleAction(playSelectedCards);
    }
  }
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

function scheduleOnlinePlay(cards = selectedCards()) {
  if (!cards.length) return;
  onlinePendingSelection = null;
  onlinePendingPlay = {
    playerIndex: state.localPlayerIndex,
    // Checkpoints use compact transport IDs, so retain that same form while waiting
    // for the host's authoritative confirmation.
    cardIds: compactCards(cards),
    cards: [...cards],
    phase: state.phase
  };
  pauseTurnTimer();
  state.actionPending = true;
  render();
  if (authorityOnlineEnabled()) {
    submitAuthorityAction("play", { cardIds: compactCards(onlinePendingPlay.cardIds) });
    return;
  }
  scheduleOnlineAction("play", { cardIds: compactCards(onlinePendingPlay.cardIds) });
}

function scheduleOnlineAction(type, payload = {}) {
  if (authorityOnlineEnabled()) {
    submitAuthorityAction(type, payload);
    return;
  }
  const clientActionId = SYNC_CORE.createActionId(window.crypto?.randomUUID?.bind(window.crypto));
  const action = { type, playerIndex: state.localPlayerIndex, ...payload, clientActionId };
  pauseTurnTimer();
  state.actionPending = true;
  startPendingOnlineAction(action);
  render();
  state.actionTimer = window.setTimeout(async () => {
    state.actionTimer = null;
    state.actionPending = false;
    const applied = executeOnlineAction(action);
    render();
    if (applied === false) {
      clearPendingOnlineAction();
      restorePausedTurnTimer();
      return;
    }
    const event = await emitResolvedOnlineAction({ ...action, turnClock: getTurnClockPayload() });
    if (event === false) {
      setOnlineStatus(uiLabel("preGame", "liveSyncReconnecting"), "error");
      return;
    }
    clearPendingOnlineAction();
    onlinePendingSelection = null;
    onlinePendingPlay = null;
    state.actionPending = false;
    render();
  }, MOVE_DELAY_MS);
}

function selectedCards(playerIndex = state.activePlayer) {
  const selected = new Set(state.selectedIds);
  return (state.players[playerIndex]?.hand || []).filter((card) => selected.has(card.id));
}

function isSameSuitGroup(cards) {
  if (!cards.length) return false;
  const suit = cards[0].suit;
  return cards.every((card) => card.suit === suit);
}

function isValidLead(cards) {
  if (!cards.length || cards.length > otherPlayer().hand.length) return false;
  return isSameSuitGroup(cards);
}

function isValidAnswer(cards) {
  return cards.length === state.trick.leadCards.length;
}

function cardsFromHandByIds(playerIndex, cardIds) {
  const cardsById = new Map((state.players[playerIndex]?.hand || []).map((card) => [card.id, card]));
  return cardIds.map((id) => cardsById.get(id)).filter(Boolean);
}

function playCardsByIds(playerIndex, cardIds) {
  const ids = [...cardIds];
  if (!canPlayCardsFor(playerIndex) || !ids.length || new Set(ids).size !== ids.length) return false;
  const cards = cardsFromHandByIds(playerIndex, ids);
  if (cards.length !== ids.length) return false;

  if (state.phase === "lead") {
    if (!isValidLead(cards)) {
      render();
      return false;
    }
    playTurnSound("lead");
    state.trick = {
      leadPlayer: playerIndex,
      answerPlayer: otherPlayerIndex(playerIndex),
      leadCards: removeCardsFromHand(playerIndex, ids),
      answerCards: []
    };
    state.phase = "answer";
    state.activePlayer = state.trick.answerPlayer;
    state.selectedIds = [];
    state.claimAvailableFor = null;
    state.privacyLock = false;
    resumeTurnFor(state.activePlayer);
    render();
    return true;
  }

  if (state.phase === "answer") {
    if (!isValidAnswer(cards)) {
      render();
      return false;
    }

    playTurnSound("answer");
    state.trick.answerCards = removeCardsFromHand(playerIndex, ids);
    resolveTrick();
    return true;
  }

  return false;
}

function playSelectedCards(playerIndex = null) {
  const actingPlayerIndex = playerIndex ?? (state.dummyOpponent && state.activePlayer === 1
    ? 1
    : state.localPlayerIndex);
  return playCardsByIds(actingPlayerIndex, state.selectedIds || []);
}

function removeCardsFromHand(playerIndex, cardIds) {
  const selected = new Set(cardIds);
  const player = state.players[playerIndex];
  const cardsById = new Map(player.hand.map((card) => [card.id, card]));
  const removed = cardIds.map((id) => cardsById.get(id)).filter(Boolean);
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
  const trickPoints = cardPointTotal(trickCards);
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
  resumeTurnFor(winnerIndex);
  render();
  // An exhausted deal has no player action available, so it needs this timer.
  // A dummy winner advances through its single scheduled turn instead.
  if (isDealExhausted()) {
    state.pauseDeadline = gameNow() + trickCards.length * CLEARANCE_MS_PER_CARD;
    if (!onlineEnabled() || state.onlineRole === "host") {
      state.pauseTimer = window.setTimeout(
        () => onlineEnabled()
          ? finishOnlineAutomaticTrickPause(winnerIndex)
          : finishTrickPause(winnerIndex, loserIndex, trickPoints),
        trickCards.length * CLEARANCE_MS_PER_CARD
      );
    }
  }
}

function finishTrickPause(winnerIndex, loserIndex, trickPoints) {
  state.pauseTimer = null;
  state.pauseDeadline = null;
  const dealExhausted = isDealExhausted();
  clearResolvedTrickPresentation();
  refillHands(winnerIndex, loserIndex);
  state.claimAvailableFor = null;
  state.phase = "lead";
  state.selectedIds = [];
  state.trick = createEmptyTrick();
  state.lastTrick = null;
  state.privacyLock = false;
  resumeTurnFor(winnerIndex);

  if (dealExhausted) {
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
      state.stockCursor += 1;
      drawn += 1;
    }
    if (count < loserNeeds && state.stock.length) {
      loser.hand.push(state.stock.shift());
      state.stockCursor += 1;
      drawn += 1;
    }
  }

  winner.hand = sortHand(winner.hand);
  loser.hand = sortHand(loser.hand);
  if (!drawn) return "";
  return ` Drew ${drawn} from the stock.`;
}

function claimPoints(playerIndex = state.localPlayerIndex) {
  if (!canReviewWonTrickFor(playerIndex)) return false;
  const player = state.players[playerIndex];
  const opponentIndex = otherPlayerIndex(playerIndex);

  if (player.score >= TARGET_POINTS) {
    clearTrickPauseTimer();
    finishDeal(playerIndex, "claimedTarget");
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
  state.pauseDeadline = gameNow() + BURA_REVEAL_MS;
  if (!onlineEnabled() || state.onlineRole === "host") {
    state.pauseTimer = window.setTimeout(() => {
      state.pauseTimer = null;
      state.pauseDeadline = null;
      finishDeal(declarerIndex, "declaredBuraResult");
    }, BURA_REVEAL_MS);
  }
}

function offerIncrease(playerIndex = state.localPlayerIndex) {
  if (!canOfferIncreaseFor(playerIndex)) return false;
  if (state.phase === "trickPause") clearTrickPauseTimer();
  const from = playerIndex;
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
  resumeTurnFor(to);
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
  resumeTurnFor(offer.from);
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

function declareMaliutka(playerIndex = state.localPlayerIndex) {
  if (!canAct() || state.phase === "trickPause" || state.phase === "maliutkaPending") return;
  const claimantIndex = playerIndex;
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
  resumeTurnFor(defenderIndex);
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
  const trickPoints = cardPointTotal(trickCards);

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
  (state.hasTakenTrick ??= [false, false])[winnerIndex] = true;
  state.phase = "trickPause";
  state.selectedIds = [];
  state.privacyLock = false;
  resumeTurnFor(winnerIndex);
  playTurnSound("answer");
  render();
  // Maliutka follows the ordinary captured-trick flow. Its winner decides
  // whether to continue, claim, or offer an increase before cards are drawn.
  if (isDealExhausted()) {
    state.pauseDeadline = gameNow() + trickCards.length * CLEARANCE_MS_PER_CARD;
    if (!onlineEnabled() || state.onlineRole === "host") {
      state.pauseTimer = window.setTimeout(
        () => onlineEnabled()
          ? finishOnlineAutomaticTrickPause(winnerIndex)
          : finishTrickPause(winnerIndex, loserIndex, trickPoints),
        trickCards.length * CLEARANCE_MS_PER_CARD
      );
    }
  }
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
  clearTurnTimer();
  state.turnStartedAt = null;
  state.turnElapsedMs = 0;
  turnTimerPauseSnapshot = null;
  const awarded = winnerIndex === null ? 0 : awardWeight;
  const previousMatchPoints = winnerIndex === null ? null : state.players[winnerIndex].matchPoints;
  const animationStartedAt = gameNow();
  const popupStartsAt = winnerIndex === null ? null : animationStartedAt + DEAL_SCORE_TRANSFER_DELAY_MS;
  const transferStartsAt = (popupStartsAt ?? animationStartedAt + DEAL_SCORE_TRANSFER_DELAY_MS) + (winnerIndex === null ? 0 : DEAL_SCORE_POPUP_MS);
  const weightResetStartsAt = transferStartsAt + awarded * DEAL_SCORE_POINT_INTERVAL_MS;
  const weightResetDuration = state.dealWeight > 1 ? DEAL_SCORE_WEIGHT_RESET_MS : 0;
  if (winnerIndex !== null) state.players[winnerIndex].matchPoints += awarded;

  const matchWon = winnerIndex !== null && state.players[winnerIndex].matchPoints >= state.matchTarget;
  state.winner = winnerIndex;
  state.matchWon = matchWon;
  state.matchEndedByTimeout = false;
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
    transferStartsAt,
    pointInterval: DEAL_SCORE_POINT_INTERVAL_MS
  };
  state.selectedIds = [];
  showDealScoreSummary();
  state.dealDeadline = winnerIndex === null
    ? animationStartedAt + TIE_DEAL_SUMMARY_MS
    : weightResetStartsAt + weightResetDuration + DEAL_NEXT_DEAL_DELAY_MS;
  state.dealTimer = window.setTimeout(() => {
    state.dealTimer = null;
    state.dealDeadline = null;
    if (onlineEnabled() && state.onlineRole === "guest") return;
    if (matchWon) startMatchSummary();
    else startNextDeal(winnerIndex);
  }, Math.max(0, state.dealDeadline - gameNow()));
  requestOnlineCheckpoint();
  render();
}

function clearResolvedTrickPresentation() {
  onlinePendingPlay = null;
  [elements.playerOneRow, elements.playerTwoRow].forEach((element) => {
    if (!element) return;
    element.dataset.cardsKey = "";
    element.className = "played-row";
    element.replaceChildren();
  });
}

function finishOnlineAutomaticTrickPause(winnerIndex) {
  if (!onlineEnabled()
    || state.onlineRole !== "host"
    || state.phase !== "trickPause"
    || state.activePlayer !== winnerIndex
    || !state.lastTrick) return;
  const action = {
    type: "continue",
    playerIndex: winnerIndex,
    clientActionId: SYNC_CORE.createActionId(window.crypto?.randomUUID?.bind(window.crypto))
  };
  const applied = executeOnlineAction(action);
  if (!applied) return;
  render();
  void emitResolvedOnlineAction({ ...action, turnClock: getTurnClockPayload() });
}

function finishMatchByTimeout(timedOutPlayer, deadline = new Date(gameNow() + MATCH_SUMMARY_MS).toISOString()) {
  const winnerIndex = otherPlayerIndex(timedOutPlayer);
  clearTurnTimer();
  clearTrickPauseTimer();
  if (state.dealTimer !== null) window.clearTimeout(state.dealTimer);
  state.dealTimer = null;
  state.turnStartedAt = null;
  state.turnElapsedMs = 0;
  state.turnReserveMs = [...(state.turnReserveMs || [TURN_RESERVE_MS, TURN_RESERVE_MS])];
  state.turnReserveMs[timedOutPlayer] = 0;
  turnTimerPauseSnapshot = null;
  state.winner = winnerIndex;
  state.matchWon = true;
  state.matchEndedByTimeout = true;
  state.resultReason = "";
  state.privacyLock = false;
  state.offer = null;
  state.selectedIds = [];
  state.phase = "gameOver";
  recordAccountMatchCompletion();
  state.rematchDeadline = deadline;
  setDealScoreSummaryVisible(false);
  playResultSound(winnerIndex === getAudioPlayerIndex() ? "win" : "lose");
  showResultPanel();
  requestOnlineCheckpoint();
  render();
}

function startMatchSummary() {
  if (state.phase !== "dealPause" || !state.matchWon) return;
  state.dealTimer = null;
  state.phase = "gameOver";
  recordAccountMatchCompletion();
  state.rematchDeadline = new Date(gameNow() + MATCH_SUMMARY_MS).toISOString();
  playResultSound(state.winner === getAudioPlayerIndex() ? "win" : "lose");
  setDealScoreSummaryVisible(false);
  showResultPanel();
  requestOnlineCheckpoint();
  render();
}

function startNextDeal(previousWinner) {
  clearMatchSummaryTimers();
  clearOpeningTurnSignal();
  clearDummyFinalChoice();
  clearResolvedTrickPresentation();
  setDealScoreSummaryVisible(false);
  elements.resultPanel.hidden = true;
  const playerNames = state.players.map((player) => player.name);
  const matchPoints = state.players.map((player) => player.matchPoints);
  const turnReserveMs = Array.isArray(state.turnReserveMs)
    ? state.turnReserveMs.map((value) => Math.max(0, Number(value) || 0))
    : [TURN_RESERVE_MS, TURN_RESERVE_MS];
  const firstLeader = previousWinner === null ? Math.floor(Math.random() * 2) : 1 - previousWinner;
  const dealSeed = makeDealSeed();
  const { playerOneHand, playerTwoHand, trumpCard, stock } = buildDealFromSeed(dealSeed);

  state = {
    players: [
      { ...createPlayer(playerNames[0]), hand: sortHand(playerOneHand, trumpCard.suit), matchPoints: matchPoints[0] },
      { ...createPlayer(playerNames[1]), hand: sortHand(playerTwoHand, trumpCard.suit), matchPoints: matchPoints[1] }
    ],
    stock,
    stockDefinition: [...stock],
    stockCursor: 0,
    dealSeed,
    trumpCard,
    trumpSuit: trumpCard.suit,
    activePlayer: firstLeader,
    leader: firstLeader,
    phase: "lead",
    turnStartedAt: gameNow(),
    turnElapsedMs: 0,
    turnReserveMs,
    selectedIds: [],
    trick: createEmptyTrick(),
    lastTrick: null,
    privacyLock: false,
    winner: null,
    matchWon: false,
    matchEndedByTimeout: false,
    resultReason: "",
    dummyOpponent: state.dummyOpponent,
    easyPlay: state.easyPlay,
    easyPlayByPlayer: [...(state.easyPlayByPlayer || [state.easyPlay, state.easyPlay])],
    dummyTimer: null,
    pauseTimer: null,
    pauseDeadline: null,
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
    dealDeadline: null,
    dealNumber: state.dealNumber + 1,
    online: state.online,
    onlineRole: state.onlineRole,
    onlineRoomId: state.onlineRoomId,
    onlineRoomCode: state.onlineRoomCode,
    onlineAssignment: state.onlineAssignment,
    eventCursor: state.eventCursor ?? 0,
    eventSequence: state.eventSequence ?? 0,
    rematchDeadline: null,
    openingTurnSignal: false
  };
  if (state.online && state.onlineRole === "host") {
    onlineCheckpointNeeded = false;
    const settings = { ...(onlineRoom?.settings || {}), dealSeed };
    const nextState = serializedState();
    const roomUpdate = {
      settings,
      game_state: nextState,
      status: "playing",
      extend_lead: true
    };
    onlineStateHash = JSON.stringify(nextState);
    onlineRoom = { ...onlineRoom, ...roomUpdate };
    void callOnlineRpc(onlineClient, "bura_update_room", {
      room_id: onlineRoom.id,
      player_token: currentPlayerToken(),
      room_patch: roomUpdate,
      expected_revision: onlineLatestRevision
    }).then(({ data, error }) => {
      if (error || !data) {
        setOnlineStatus(uiLabel("preGame", "onlineActionFailed"), "error");
        return;
      }
      onlineRoom = { ...onlineRoom, ...data };
      onlineLatestRevision = Number(data.revision) || onlineLatestRevision;
    });
  }
  render();
  startTurnTimer();
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
  if (gameNow() < transferStartsAt) return 0;
  const interval = getDealScorePointInterval(animation);
  return Math.min(total, Math.floor((gameNow() - transferStartsAt) / interval) + 1);
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
  const now = gameNow();
  return total > 0 && now >= transferStartsAt && now < transferStartsAt + total * interval;
}

function isDealScoreAwardVisible(playerIndex) {
  const animation = state.dealScoreAnimation;
  if (!animation || animation.winnerIndex !== playerIndex) return false;
  const popupStartsAt = animation.popupStartsAt ?? animation.startsAt;
  const transferStartsAt = animation.transferStartsAt ?? popupStartsAt;
  const now = gameNow();
  return now >= popupStartsAt && now < transferStartsAt;
}

function getDisplayedDealWeight() {
  const animation = state.dealScoreAnimation;
  if (!animation) return state.dealWeight;
  const weightResetStartsAt = animation.weightResetStartsAt ?? animation.transferStartsAt;
  return gameNow() >= weightResetStartsAt ? 1 : animation.weightFrom;
}

function isDealWeightResetActive() {
  const animation = state.dealScoreAnimation;
  if (!animation || animation.weightFrom <= 1) return false;
  const weightResetStartsAt = animation.weightResetStartsAt ?? animation.transferStartsAt;
  const now = gameNow();
  return now >= weightResetStartsAt && now < weightResetStartsAt + DEAL_SCORE_WEIGHT_RESET_MS;
}

function increaseOfferLabelKey() {
  return {
    1: "increaseToTwo",
    2: "increaseToThree",
    3: "increaseToFour",
    4: "increaseToFive",
    5: "increaseToSix"
  }[state.dealWeight] || "increase";
}

function increaseOfferButtonMarkup() {
  return `<button class="secondary-button action-secondary-left" type="button" data-action="offer">${labelMarkup("game", increaseOfferLabelKey())}</button>`;
}

function dealScoreAnimationKey(animation) {
  return `${state.dealNumber}:${animation.winnerIndex}:${animation.from}:${animation.to}`;
}

function getDealScoreAwardAnimationDelay(animation) {
  if (!animation) return 0;
  const popupStartsAt = animation.popupStartsAt ?? animation.startsAt;
  return Math.min(DEAL_SCORE_POPUP_MS - 1, Math.max(0, gameNow() - popupStartsAt));
}

async function setAuthorityNickname(client, playerName) {
  const name = playerName.trim() || uiLabel("preGame", "playerOne");
  await client.ensureSession();
  await client.setNickname(name);
  return name;
}

async function createAuthorityRoom() {
  if (onlineRoomCreationInFlight) return;
  const client = getAuthorityClient();
  if (!client) {
    setOnlineStatus(uiLabel("preGame", "onlineUnavailable"), "error");
    return;
  }
  onlineRoomCreationInFlight = true;
  elements.startButton.disabled = true;
  try {
    const playerName = await setAuthorityNickname(client, elements.playerOneName.value);
    const created = await client.createMatch({
      stake: 0,
      private: false,
      matchTarget: Number(elements.matchTarget.value) || 3
    });
    const createdRoom = authorityLobbyRoom({
      ...created,
      hostName: playerName,
      createdAt: new Date().toISOString(),
      isOwner: true,
      isParticipant: true
    });
    lobbyRooms = [createdRoom, ...lobbyRooms.filter((room) => room.id !== createdRoom.id)];
    await startAuthorityRoom({ ...created, stake: 0 }, playerName);
    renderLobby();
    await refreshLobby();
  } catch (error) {
    console.error("Unable to create authoritative Bura room", error);
    setOnlineStatus(authorityCreationFailureLabel(error), "error");
  } finally {
    onlineRoomCreationInFlight = false;
    if (state.phase === "setup" && elements.onlineMode?.checked) elements.startButton.disabled = false;
  }
}

async function joinAuthorityMatch(room) {
  const client = getAuthorityClient();
  if (!client || !room?.id) return;
  elements.startButton.disabled = true;
  try {
    const playerName = await setAuthorityNickname(client, elements.playerOneName.value);
    const joined = await client.joinMatch(room.id);
    await startAuthorityRoom({ ...joined, roomCode: room.code, stake: room.stake }, playerName);
  } catch (error) {
    console.error("Unable to join authoritative Bura room", error);
    setOnlineStatus(uiLabel("preGame", "gameJustJoined"), "error");
  } finally {
    if (state.phase === "setup") elements.startButton.disabled = false;
  }
}

async function joinAuthorityMatchByCode(roomCode) {
  const client = getAuthorityClient();
  if (!client || !roomCode) return;
  try {
    const playerName = await setAuthorityNickname(client, elements.playerOneName.value);
    const joined = await client.joinMatchByCode(roomCode);
    await startAuthorityRoom(joined, playerName);
    clearInviteLink();
  } catch (error) {
    console.error("Unable to join authoritative Bura invitation", error);
    clearInviteLink();
    showSetup();
    setOnlineStatus(uiLabel("preGame", "gameNotFound"), "error");
  }
}

async function reconnectAuthoritySession(session = readAuthoritySession()) {
  if (!session || onlineRoom?.id === session.matchId && authorityConnection) return;
  const client = getAuthorityClient();
  if (!client) return;
  try {
    const match = await client.getMatch(session.matchId);
    await startAuthorityRoom({ ...match, roomCode: session.roomCode }, session.playerName);
  } catch (error) {
    clearAuthoritySession(session.matchId);
    if (onlineRoom?.id === session.matchId) {
      onlineRoom = null;
      elements.createdCode.hidden = true;
      setOnlineStatus(uiLabel("preGame", "roomExpired"), "error");
      startLobbyUpdates();
      renderLobby();
    }
  }
}

function authorityCreationFailureLabel(error) {
  return uiLabel("preGame", "onlineCreateFailed");
}

function playDealScoreTransferSound() {
  try {
    const audio = new Audio(DEAL_SCORE_TRANSFER_SOUND_SOURCE);
    audio.preload = "auto";
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch (error) {
    // Sound is optional and may be unavailable in a locked-down browser.
  }
}

function animateDealScoreTransfer() {
  clearDealScoreAnimation();
  const animation = state.dealScoreAnimation;
  if (state.phase !== "dealPause" || !animation) return;

  const animationKey = dealScoreAnimationKey(animation);
  const isCurrentAnimation = () => state.phase === "dealPause"
    && state.dealScoreAnimation
    && dealScoreAnimationKey(state.dealScoreAnimation) === animationKey;
  const transferStartsAt = animation.transferStartsAt ?? animation.startsAt;
  const weightResetStartsAt = animation.weightResetStartsAt ?? transferStartsAt;
  const startPopup = () => {
    if (!isCurrentAnimation()) return;
    dealScorePopupTimer = null;
    renderMatchPanel();
  };
  const startWeightReset = () => {
    if (!isCurrentAnimation()) return;
    dealScoreWeightResetTimer = null;
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
      if (gameNow() < transferStartsAt + total * interval) {
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
    dealScorePopupTimer = window.setTimeout(startPopup, Math.max(0, (animation.popupStartsAt ?? animation.startsAt) - gameNow()));
  }
  if (animation.weightFrom > 1) {
    dealScoreWeightResetTimer = window.setTimeout(startWeightReset, Math.max(0, weightResetStartsAt - gameNow()));
  }
  dealScoreTransferTimer = window.setTimeout(startTransfer, Math.max(0, transferStartsAt - gameNow()));
}

function setDealScoreSummaryVisible(visible) {
  elements.appShell?.classList.toggle("is-deal-score-summary", visible);
  if (elements.dealScoreDimmer) elements.dealScoreDimmer.hidden = !visible;
  if (visible) {
    const animation = state.dealScoreAnimation;
    const animationKey = animation ? dealScoreAnimationKey(animation) : "";
    if (animationKey && activeDealScoreAnimationKey === animationKey) return;
    activeDealScoreAnimationKey = animationKey;
    animateDealScoreTransfer();
  } else {
    activeDealScoreAnimationKey = "";
    clearDealScoreAnimation();
  }
}

function showDealScoreSummary() {
  elements.resultPanel.hidden = true;
  setDealScoreSummaryVisible(true);
}

function showResultPanel() {
  setDealScoreSummaryVisible(false);
  elements.resultPanel.hidden = false;
  const viewerIndex = getViewerPlayerIndex();
  const playerOrder = [viewerIndex, otherPlayerIndex(viewerIndex)];

  const resultTitleKey = state.winner === null
    ? "splitDeal"
    : state.winner === viewerIndex ? "youWon" : "youLost";
  setLabelText(elements.resultKicker, "game", "matchSummary");
  setLabelText(elements.resultTitle, "game", resultTitleKey);
  const timedOutMatch = Boolean(state.matchEndedByTimeout);
  const timeoutWinner = timedOutMatch && state.winner === viewerIndex;
  elements.resultDetail.classList.toggle("match-timeout-detail", timeoutWinner);
  if (timeoutWinner) {
    setLabelText(elements.resultDetail, "game", "matchTimeoutWinner");
    elements.resultDetail.hidden = false;
  } else {
    elements.resultDetail.textContent = "";
    elements.resultDetail.hidden = true;
  }
  elements.resultScores.innerHTML = playerOrder.map((playerIndex) => {
    const player = state.players[playerIndex];
    return `
      <div class="result-score ${playerIndex === state.winner ? "winner" : ""}">
        <span>${scoreboardPlayerNameMarkup(playerIndex, player.name)}</span>
        <strong>${player.matchPoints}</strong>
      </div>
    `;
  }).join("");
  if (authorityOnlineEnabled()) {
    elements.playAgainButton.hidden = true;
    elements.resultCountdown.hidden = true;
    return;
  }
  const rematchField = state.onlineRole === "host" ? "host_rematch" : "guest_rematch";
  const waitingForOpponent = onlineEnabled() && Boolean(onlineRoom?.[rematchField]);
  elements.playAgainButton.hidden = timedOutMatch;
  elements.resultCountdown.hidden = timedOutMatch;
  if (timedOutMatch) {
    elements.playAgainButton.disabled = true;
    elements.resultCountdown.textContent = "";
    scheduleMatchSummaryClose();
    return;
  }
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
  return Number.isFinite(deadline) ? Math.max(0, deadline - gameNow()) : 0;
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
  const endedByTimeout = Boolean(state.matchEndedByTimeout);
  if (bothAccepted && !forceExit) return;
  if (onlineEnabled() && onlineRoom && (onlineRoom.status === "rematch_waiting" || forceExit)) {
    if (state.onlineRole === "host") {
      void callOnlineRpc(onlineClient, "bura_update_room", {
        room_id: onlineRoom.id,
        player_token: currentPlayerToken(),
        room_patch: { host_rematch: false, guest_rematch: false, rematch_deadline: null, status: "finished" },
        expected_revision: onlineLatestRevision
      });
    }
  }
  if (roomId) clearOnlineSession(roomId);
  showSetup();
  if (!forceExit && !endedByTimeout) {
    setOnlineStatus(uiLabel("game", "rematchExpired"), "error", TRANSIENT_ONLINE_STATUS_MS);
  }
}

function scheduleMatchSummaryClose() {
  clearMatchSummaryTimers();
  const remainingMs = getMatchSummaryRemainingMs();
  if (remainingMs <= 0) {
    closeMatchSummary();
    return;
  }
  if (!state.matchEndedByTimeout) {
    updateMatchSummaryCountdown();
    matchSummaryCountdownTimer = window.setInterval(updateMatchSummaryCountdown, 200);
  }
  matchSummaryTimer = window.setTimeout(closeMatchSummary, remainingMs);
}

function isDealExhausted() {
  return state.stock.length === 0 && state.players.every((player) => player.hand.length === 0);
}

function continueTurn(playerIndex = state.localPlayerIndex) {
  if (!canReviewWonTrickFor(playerIndex)) return false;
  const winnerIndex = state.lastTrick.winnerIndex;
  finishTrickPause(winnerIndex, otherPlayerIndex(winnerIndex), state.lastTrick.points);
}

function scheduleAction(action, onlineAction = null, delayMs = MOVE_DELAY_MS) {
  if (state.actionPending || state.phase === "gameOver") return;
  pauseTurnTimer();
  state.actionPending = true;
  render();
  state.actionTimer = window.setTimeout(() => {
    state.actionTimer = null;
    state.actionPending = false;
    const applied = action();
    if (onlineAction && applied !== false) {
      void emitResolvedOnlineAction({ ...onlineAction, turnClock: getTurnClockPayload() });
    }
    if (applied === false) restorePausedTurnTimer();
    render();
  }, delayMs);
}

function render() {
  if (onlineApplyingRemoteAction) return;
  renderTable();
  renderPlayerLanes();
  renderActions();
  scheduleDummyTurn();
  publishOnlineState();
}

function knownPlayedCardIds() {
  const playedIds = new Set();
  const addCards = (cards) => {
    (cards || []).forEach((card) => {
      if (card?.id) playedIds.add(card.id);
    });
  };
  state.players.forEach((player) => addCards(player.captured));
  addCards(state.trick?.leadCards);
  addCards(state.trick?.answerCards);
  addCards(state.lastTrick?.leadCards);
  addCards(state.lastTrick?.answerCards);
  return playedIds;
}

function cardPointTotal(cards) {
  return (cards || []).reduce((total, card) => total + (card?.points || 0), 0);
}

function cardCombinations(cards, size) {
  if (size <= 0) return [[]];
  if (!cards.length || size > cards.length) return [];
  const results = [];
  const walk = (startIndex, picked) => {
    if (picked.length === size) {
      results.push([...picked]);
      return;
    }
    const remainingNeeded = size - picked.length;
    for (let index = startIndex; index <= cards.length - remainingNeeded; index += 1) {
      picked.push(cards[index]);
      walk(index + 1, picked);
      picked.pop();
    }
  };
  walk(0, []);
  return results;
}

function makeDummyCardMemory(playerIndex = DUMMY_PLAYER_INDEX) {
  const opponentIndex = otherPlayerIndex(playerIndex);
  const opponent = state.players[opponentIndex] || { hand: [], captured: [], score: 0 };
  const playedIds = knownPlayedCardIds();
  const handIds = new Set((state.players[playerIndex]?.hand || []).map((card) => card.id));
  const remainingCards = [...CARD_BY_ID.values()].filter((card) => !playedIds.has(card.id));
  const unseenCards = remainingCards.filter((card) => !handIds.has(card.id));
  const unseenTrumps = unseenCards.filter((card) => card.suit === state.trumpSuit);
  const remainingTrumps = remainingCards.filter((card) => card.suit === state.trumpSuit);
  const unseenHighCards = unseenCards.filter((card) => DUMMY_HIGH_RANKS.has(card.rank));

  return {
    playedIds,
    handIds,
    remainingCards,
    unseenCards,
    unseenTrumps,
    remainingTrumps,
    unseenHighCards,
    stockRemaining: state.stock.length,
    stockExhausted: state.stock.length === 0,
    opponentHand: [...opponent.hand],
    opponentCaptured: [...opponent.captured],
    opponentCapturedPoints: opponent.score,
    opponentHandPoints: cardPointTotal(opponent.hand),
    trumpSuit: state.trumpSuit
  };
}

function legalDummyLeadOptions(playerIndex) {
  const hand = state.players[playerIndex]?.hand || [];
  const opponentCards = state.players[otherPlayerIndex(playerIndex)]?.hand.length || 0;
  const maximumLead = Math.min(hand.length, opponentCards);
  const options = [];
  SUITS.forEach((suit) => {
    const suitedCards = hand.filter((card) => card.suit === suit.id);
    for (let size = 1; size <= Math.min(maximumLead, suitedCards.length); size += 1) {
      options.push(...cardCombinations(suitedCards, size));
    }
  });
  return options;
}

function legalDummyAnswerOptions(playerIndex) {
  return cardCombinations(state.players[playerIndex]?.hand || [], state.trick.leadCards.length);
}

function dummyCardKeepValue(card, memory) {
  let value = card.strength * 0.8 + card.points * 1.8;
  if (DUMMY_HIGH_RANKS.has(card.rank)) value += 5;
  if (card.suit === state.trumpSuit) value += 16 + card.strength;
  const unseenHigherSameSuit = memory.unseenCards.filter((candidate) =>
    candidate.suit === card.suit && candidate.strength > card.strength
  ).length;
  return value - Math.min(4, unseenHigherSameSuit * 0.5);
}

function estimateDummyLeadRisk(cards, memory) {
  if (!cards.length || !memory.unseenCards.length) return 0;
  if (memory.stockExhausted && cards.length <= memory.opponentHand.length) {
    const canCut = cardCombinations(memory.opponentHand, cards.length)
      .some((answerCards) => canBeatCards(cards, answerCards));
    return canCut ? 0.95 : 0.02;
  }
  const averageBeaterRatio = cards.reduce((total, card) => {
    const beaters = memory.unseenCards.filter((candidate) => cardBeats(candidate, card)).length;
    return total + beaters / memory.unseenCards.length;
  }, 0) / cards.length;
  const multiCardAdjustment = cards.length > 1 ? (cards.length - 1) * 0.05 : 0;
  const trumpControlAdjustment = cards.every((card) => card.suit === state.trumpSuit)
    ? -0.08
    : Math.min(0.16, memory.unseenTrumps.length * 0.015);
  return Math.max(0, Math.min(0.95, averageBeaterRatio + multiCardAdjustment + trumpControlAdjustment));
}

function scoreDummyLeadOption(cards, playerIndex, memory) {
  const player = state.players[playerIndex];
  const opponent = state.players[otherPlayerIndex(playerIndex)];
  const points = cardPointTotal(cards);
  const risk = estimateDummyLeadRisk(cards, memory);
  const keepCost = cards.reduce((total, card) => total + dummyCardKeepValue(card, memory), 0);
  const lateDeal = state.stock.length <= HAND_SIZE;
  let score = (1 - risk) * 18 - risk * 18 + points * (lateDeal ? 1.4 : 0.7) - keepCost * 0.35;

  if (player.score + points >= TARGET_POINTS) score += (1 - risk) * 70;
  if (cards.length > 1) score += cards.length * 2 - risk * 6;
  if (!cards.some((card) => card.suit === state.trumpSuit) && points === 0 && state.stock.length) score += 6;
  if (cards.some((card) => card.suit === state.trumpSuit) && state.stock.length > HAND_SIZE && points < 10) score -= 8;
  if (player.score > opponent.score && points === 0) score += 2;
  if (memory.remainingTrumps.length <= cards.filter((card) => card.suit === state.trumpSuit).length + 1) score += 4;
  if (memory.stockExhausted && cards.length <= memory.opponentHand.length) {
    const endgame = DUMMY_TUNING.endgame || {};
    const opponentCanCut = cardCombinations(memory.opponentHand, cards.length)
      .some((answerCards) => canBeatCards(cards, answerCards));
    if (opponentCanCut) {
      score -= (endgame.cuttableLeadPenalty ?? 60)
        + memory.opponentHandPoints * (endgame.opponentHandPointPenalty ?? 0.5)
        + memory.opponentCapturedPoints * (endgame.opponentCapturedPointPressure ?? 0.2);
    } else {
      score += (endgame.safeLeadBonus ?? 54) + cards.length * 3
        + memory.opponentCapturedPoints * (endgame.opponentCapturedPointPressure ?? 0.2);
    }
  }
  return score;
}

function isSafeDummyPairLead(cards, memory) {
  const safePair = DUMMY_TUNING.safePair || {};
  return cards.length === 2
    && cards.every((card) => card.suit !== state.trumpSuit)
    && cardPointTotal(cards) <= (safePair.maxTotalPoints ?? 4)
    && memory.stockRemaining >= (safePair.minimumStockRemaining ?? HAND_SIZE)
    && estimateDummyLeadRisk(cards, memory) <= (safePair.maxLeadRisk ?? 0.42);
}

function isPreferredDummyMultiLead(cards, memory) {
  const multiLead = DUMMY_TUNING.multiLead || {};
  return (cards.length === 2 || cards.length === 3)
    && cards.every((card) => card.suit !== state.trumpSuit && !DUMMY_HIGH_RANKS.has(card.rank))
    && estimateDummyLeadRisk(cards, memory) <= (multiLead.maxLeadRisk ?? 0.58);
}

function isStrongDummyFourCardLead(cards, memory) {
  const fourCardLead = DUMMY_TUNING.fourCardLead || {};
  if (cards.length !== 4 || estimateDummyLeadRisk(cards, memory) > (fourCardLead.maxLeadRisk ?? 0.76)) return false;
  const containsHighCard = cards.some((card) => DUMMY_HIGH_RANKS.has(card.rank));
  const mostTrumpsGone = memory.remainingTrumps.length <= (fourCardLead.remainingTrumpsForPressure ?? 4);
  return containsHighCard || mostTrumpsGone;
}

function dummyMultiLeadBonus(cards, memory) {
  const multiLead = DUMMY_TUNING.multiLead || {};
  const fourCardLead = DUMMY_TUNING.fourCardLead || {};
  if (isStrongDummyFourCardLead(cards, memory)) {
    return cards.some((card) => DUMMY_HIGH_RANKS.has(card.rank))
      ? (fourCardLead.highCardBonus ?? 72)
      : (fourCardLead.trumpExhaustedBonus ?? 64);
  }
  if (!isPreferredDummyMultiLead(cards, memory)) return 0;
  const sizeBonus = cards.length === 3
    ? (multiLead.threeCardBonus ?? 28)
    : (multiLead.twoCardBonus ?? 16);
  return (multiLead.lowCardBonus ?? 30) + sizeBonus;
}

function shouldAvoidSingleTrumpLead(cards, playerIndex, memory, hasNonTrumpLead) {
  const trumpLead = DUMMY_TUNING.trumpLead || {};
  if (cards.length !== 1 || cards[0].suit !== state.trumpSuit) return false;
  if (!hasNonTrumpLead) return false;
  if (state.players[playerIndex].score + cardPointTotal(cards) >= TARGET_POINTS) return false;
  return memory.stockRemaining >= (trumpLead.minimumStockForSinglePenalty ?? 1);
}

function dummyTrumpLeadAdjustment(cards, playerIndex, memory, hasNonTrumpLead) {
  const trumpLead = DUMMY_TUNING.trumpLead || {};
  if (shouldAvoidSingleTrumpLead(cards, playerIndex, memory, hasNonTrumpLead)) {
    return -(trumpLead.singleLeadPenalty ?? 80);
  }
  if (cards.length > 1 && cards.every((card) => card.suit === state.trumpSuit)) {
    const lateDeal = memory.stockRemaining <= (trumpLead.groupLeadStockThreshold ?? HAND_SIZE);
    return lateDeal ? (trumpLead.lateGroupBonus ?? 14) : -(trumpLead.earlyGroupPenalty ?? 18);
  }
  return 0;
}

function chooseDummyLeadCards(playerIndex = DUMMY_PLAYER_INDEX, memory = makeDummyCardMemory(playerIndex)) {
  const leadOptions = legalDummyLeadOptions(playerIndex);
  const hasNonTrumpLead = leadOptions.some((cards) => cards.every((card) => card.suit !== state.trumpSuit));
  const scoredOptions = leadOptions
    .map((cards) => ({
      cards,
      score: scoreDummyLeadOption(cards, playerIndex, memory)
        + (isSafeDummyPairLead(cards, memory) ? (DUMMY_TUNING.safePair?.scoreBonus ?? 18) : 0)
        + dummyMultiLeadBonus(cards, memory)
        + dummyTrumpLeadAdjustment(cards, playerIndex, memory, hasNonTrumpLead),
      avoidSingleTrump: shouldAvoidSingleTrumpLead(cards, playerIndex, memory, hasNonTrumpLead)
    }));
  const preferredOptions = scoredOptions.filter((option) => !option.avoidSingleTrump);
  return (preferredOptions.length ? preferredOptions : scoredOptions)
    .sort((first, second) => second.score - first.score || cardPointTotal(first.cards) - cardPointTotal(second.cards))[0]?.cards || [];
}

function scoreDummyDiscardOption(cards, memory) {
  return cards.reduce((total, card) => total + dummyCardKeepValue(card, memory), 0) + cardPointTotal(cards) * 1.5;
}

function scoreDummyWinningAnswer(cards, playerIndex, memory) {
  const player = state.players[playerIndex];
  const leadPoints = cardPointTotal(state.trick.leadCards);
  const trickPoints = leadPoints + cardPointTotal(cards);
  const keepCost = cards.reduce((total, card) => total + dummyCardKeepValue(card, memory), 0);
  const usesTrump = cards.some((card) => card.suit === state.trumpSuit);
  let score = trickPoints * 2.3 - keepCost * 0.9;

  if (player.score + trickPoints >= TARGET_POINTS) score += 100;
  if (leadPoints >= 10) score += 25;
  if (state.stock.length === 0) score += 15;
  if (usesTrump && leadPoints <= 4 && trickPoints < 10 && state.stock.length > HAND_SIZE) score -= 18;
  if (memory.unseenTrumps.length <= cards.filter((card) => card.suit === state.trumpSuit).length) score += 6;
  return score;
}

function chooseDummyDiscardCards(options, memory) {
  return [...options]
    .sort((first, second) => scoreDummyDiscardOption(first, memory) - scoreDummyDiscardOption(second, memory))[0] || [];
}

function chooseDummyAnswerCards(playerIndex = DUMMY_PLAYER_INDEX, memory = makeDummyCardMemory(playerIndex)) {
  const options = legalDummyAnswerOptions(playerIndex);
  const winningOptions = options.filter((cards) => canBeatCards(state.trick.leadCards, cards));
  if (!winningOptions.length) return chooseDummyDiscardCards(options, memory);

  const bestWin = winningOptions
    .map((cards) => ({ cards, score: scoreDummyWinningAnswer(cards, playerIndex, memory) }))
    .sort((first, second) => second.score - first.score || scoreDummyDiscardOption(first.cards, memory) - scoreDummyDiscardOption(second.cards, memory))[0];
  if (bestWin.score < 4 && state.stock.length > HAND_SIZE) return chooseDummyDiscardCards(options, memory);
  return bestWin.cards;
}

function dummyPositionScore(playerIndex, memory) {
  const player = state.players[playerIndex];
  const opponent = state.players[otherPlayerIndex(playerIndex)];
  const hand = player.hand || [];
  const trumps = hand.filter((card) => card.suit === state.trumpSuit);
  const highCards = hand.filter((card) => DUMMY_HIGH_RANKS.has(card.rank));
  const likelyLeadWinners = hand.filter((card) => estimateDummyLeadRisk([card], memory) < 0.24).length;
  return (player.score - opponent.score)
    + trumps.length * 7
    + highCards.length * 4
    + likelyLeadWinners * 5
    - memory.unseenTrumps.length
    - memory.unseenHighCards.length * 0.5;
}

function shouldDummyOfferIncrease(playerIndex = DUMMY_PLAYER_INDEX, memory = makeDummyCardMemory(playerIndex)) {
  if (!canOfferIncreaseFor(playerIndex)) return false;
  const player = state.players[playerIndex];
  const opponent = state.players[otherPlayerIndex(playerIndex)];
  if (player.matchPoints + state.dealWeight >= state.matchTarget) return false;
  if (player.score >= TARGET_POINTS) return true;
  if (hasBura(playerIndex)) return true;

  const positionScore = dummyPositionScore(playerIndex, memory);
  const increasedPointMatters = player.matchPoints + state.dealWeight + 1 >= state.matchTarget;
  if (increasedPointMatters && positionScore > 18) return true;
  if (state.phase === "trickPause" && player.score >= 50 && positionScore > 20) return true;
  if (maliutkaCards(playerIndex).length === HAND_SIZE && positionScore > 24) return true;
  if (state.stock.length === 0 && player.score > opponent.score + 12 && positionScore > 24) return true;
  return positionScore > 34 && player.score >= opponent.score + 10;
}

function shouldDummyAcceptIncrease(playerIndex = DUMMY_PLAYER_INDEX, memory = makeDummyCardMemory(playerIndex)) {
  if (!state.offer || state.offer.to !== playerIndex) return false;
  const player = state.players[playerIndex];
  const offerer = state.players[state.offer.from];
  if (hasBura(playerIndex) || player.score >= TARGET_POINTS) return true;
  if (offerer.matchPoints + state.dealWeight >= state.matchTarget) return true;

  const positionScore = dummyPositionScore(playerIndex, memory);
  const increasedLossWouldEndMatch = offerer.matchPoints + state.offer.proposedWeight >= state.matchTarget;
  if (increasedLossWouldEndMatch && positionScore < 10) return false;
  if (player.score >= offerer.score - 6 && state.stock.length > 0 && positionScore > 4) return true;
  return positionScore > 0;
}

function shouldDummyDeclareMaliutka(playerIndex = DUMMY_PLAYER_INDEX, memory = makeDummyCardMemory(playerIndex)) {
  if (hasBura(playerIndex)) return false;
  const cards = maliutkaCards(playerIndex);
  if (cards.length !== HAND_SIZE) return false;
  const player = state.players[playerIndex];
  const risk = estimateDummyLeadRisk(cards, memory);
  const points = cardPointTotal(cards);
  return risk < 0.48 || player.score + points >= TARGET_POINTS || state.stock.length <= HAND_SIZE;
}

function scheduleDummyAction(action, extraDelayMs = 0) {
  scheduleAction(action, null, MOVE_DELAY_MS + DUMMY_ACTION_EXTRA_DELAY_MS + extraDelayMs);
}

function clearDummyFinalChoice() {
  dummyFinalChoice = null;
}

function scheduleDummyCardPlay(playerIndex, cards) {
  const finalChoice = Object.freeze({
    playerIndex,
    phase: state.phase,
    cardIds: Object.freeze(cards.map((card) => card.id))
  });
  if (!finalChoice.cardIds.length) return;
  dummyFinalChoice = finalChoice;
  scheduleDummyAction(() => {
    const choice = dummyFinalChoice;
    clearDummyFinalChoice();
    if (choice !== finalChoice
      || state.activePlayer !== choice.playerIndex
      || state.phase !== choice.phase) return false;
    return playCardsByIds(choice.playerIndex, choice.cardIds);
  });
}

function scheduleDummyTurn() {
  if (!state.dummyOpponent || state.actionPending || state.activePlayer !== DUMMY_PLAYER_INDEX || state.phase === "setup" || state.phase === "gameOver" || state.phase === "dealPause" || state.phase === "buraReveal") return;
  if (state.dummyTimer !== null) return;
  state.dummyTimer = window.setTimeout(() => {
    state.dummyTimer = null;
    playDummyTurn();
  }, state.openingTurnSignal && state.phase === "lead" ? 1050 : 420);
}

function playDummyTurn() {
  if (!state.dummyOpponent || state.activePlayer !== DUMMY_PLAYER_INDEX || state.phase === "gameOver") return;
  const playerIndex = DUMMY_PLAYER_INDEX;
  const memory = makeDummyCardMemory(playerIndex);

  if (state.phase === "offerPending") {
    scheduleDummyAction(() => respondToOffer(shouldDummyAcceptIncrease(playerIndex, memory), playerIndex));
    return;
  }

  if (state.phase === "trickPause") {
    if (!canReviewWonTrickFor(playerIndex)) return;
    // A qualifying score is always claimed before any other bot decision.
    if (state.players[playerIndex].score >= TARGET_POINTS) {
      scheduleDummyAction(() => claimPoints(playerIndex));
    } else {
      scheduleDummyAction(() => continueTurn(playerIndex), DUMMY_TRICK_CONTINUE_EXTRA_DELAY_MS);
    }
    return;
  }

  if (shouldDummyOfferIncrease(playerIndex, memory)) {
    scheduleDummyAction(() => offerIncrease(playerIndex));
    return;
  }

  if (state.phase === "maliutkaPending") {
    scheduleDummyAction(resolveMaliutka);
    return;
  }

  if (hasBura(playerIndex)) {
    scheduleDummyAction(declareBura);
    return;
  }

  if (shouldDummyDeclareMaliutka(playerIndex, memory)) {
    scheduleDummyAction(() => declareMaliutka(playerIndex));
    return;
  }

  state.privacyLock = false;
  const cards = state.phase === "answer"
    ? chooseDummyAnswerCards(playerIndex, memory)
    : chooseDummyLeadCards(playerIndex, memory);
  scheduleDummyCardPlay(playerIndex, cards);
}

function renderTable() {
  if (state.phase === "setup") return;

  const trumpCardMarkup = renderCard(state.trumpCard, { trumpDisplay: true });
  elements.trumpCard.innerHTML = trumpCardMarkup;
  elements.mobileTrumpCard.innerHTML = trumpCardMarkup;
  if (state.stock.length) {
    const stockCount = Math.floor(state.stock.length / 2);
    setLabelText(elements.stockCount, "game", "stockCount", { count: stockCount });
    elements.mobileStockCount.textContent = `${stockCount}-ში`;
  } else {
    elements.stockCount.textContent = "";
    elements.mobileStockCount.textContent = "";
  }
  const isReviewingTrick = state.phase === "trickPause" && Boolean(state.lastTrick);
  const canShowCurrentTrick = !isReviewingTrick
    && ["answer", "offerPending", "buraReveal", "maliutkaPending"].includes(state.phase);
  const hasCurrentTrick = canShowCurrentTrick
    && (state.trick.leadCards.length || state.trick.answerCards.length);
  const activeLeadCards = hasCurrentTrick
    ? state.trick.leadCards
    : isReviewingTrick ? state.lastTrick.leadCards : [];
  const activeAnswerCards = hasCurrentTrick
    ? state.trick.answerCards
    : isReviewingTrick ? state.lastTrick.answerCards : [];
  const leadPlayer = hasCurrentTrick
    ? state.trick.leadPlayer
    : isReviewingTrick ? state.lastTrick.leadPlayer : null;
  const answerPlayer = hasCurrentTrick
    ? state.trick.answerPlayer
    : isReviewingTrick ? state.lastTrick.answerPlayer : null;

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
    if (confirmedCards.length
      || state.phase === "trickPause"
      || !["lead", "answer"].includes(state.phase)
      || onlinePendingPlay?.playerIndex !== playerIndex) return sortHand(confirmedCards);
    return sortHand(onlinePendingPlay.cards);
  };

  renderPlayerPane(elements.playerOneRow, cardsForPlayer(bottomPlayerIndex), roleForPlayer(bottomPlayerIndex));
  renderPlayerPane(elements.playerTwoRow, cardsForPlayer(topPlayerIndex), roleForPlayer(topPlayerIndex));
  renderMatchPanel();

}

function renderMatchPanel() {
  const preservedAward = elements.matchPanel.querySelector(".match-score-award");
  const preservedAwardKey = preservedAward?.dataset.dealScoreAwardKey || "";
  const renderMatchScore = (playerIndex, seat) => {
    const player = state.players[playerIndex];
    const displayedMatchPoints = getDisplayedMatchPoints(playerIndex);
    const progress = Math.min(100, (displayedMatchPoints / state.matchTarget) * 100);
    const isAwarding = isDealScoreTransferActive(playerIndex);
    const showAward = isDealScoreAwardVisible(playerIndex);
    const awardedPoints = state.dealScoreAnimation?.to - state.dealScoreAnimation?.from;
    const awardAnimationKey = showAward ? dealScoreAnimationKey(state.dealScoreAnimation) : "";
    const awardAnimationDelay = showAward
      ? getDealScoreAwardAnimationDelay(state.dealScoreAnimation)
      : 0;
    return `
      <div class="match-score-player ${state.activePlayer === playerIndex ? "active" : ""} ${isAwarding ? "is-awarding" : ""}">
      <div class="match-score-heading">
          <span class="match-seat">${labelMarkup("game", seat.toLowerCase())}</span>
          <strong>${scoreboardPlayerNameMarkup(playerIndex, player.name)}</strong>
        </div>
        ${showAward ? `<div class="match-score-award" aria-live="polite" data-deal-score-award-key="${escapeHtml(awardAnimationKey)}" style="animation-delay: -${awardAnimationDelay}ms"><span>${labelMarkup("preGame", "matchPoints")}</span><strong>+${awardedPoints}</strong></div>` : ""}
        <div class="match-score-value">${displayedMatchPoints}</div>
        <div class="match-score-track"><span style="width: ${progress}%"></span></div>
      </div>
    `;
  };

  const dealResult = state.phase === "dealPause" ? getDealResultLabel() : null;
  const dealResultMarkup = dealResult
    ? (dealResult.key
      ? labelMarkup("game", dealResult.key, dealResult.variables)
      : escapeHtml(dealResult.text))
    : "";
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
        ${renderMatchScore(state.localPlayerIndex, "NORTH")}
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
        ${dealResultMarkup ? `<p class="match-deal-result match-deal-result-mobile">${dealResultMarkup}</p>` : ""}
        ${renderMatchScore(opponentIndex, "SOUTH")}
      </div>
    </div>
    ${dealResultMarkup ? `<p class="match-deal-result match-deal-result-desktop">${dealResultMarkup}</p>` : ""}
  `;
  const nextAward = elements.matchPanel.querySelector(".match-score-award");
  if (preservedAward && nextAward && preservedAwardKey === nextAward.dataset.dealScoreAwardKey) {
    nextAward.replaceWith(preservedAward);
  }
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
    updateLaneMarkup(elements.opponentLane, "");
    updateLaneMarkup(elements.currentLane, renderLane(state.localPlayerIndex, false));
    syncLaneControls();
    renderTurnTimer();
    return;
  }

  const localPlayerIndex = state.localPlayerIndex;
  const opponentPlayerIndex = localPlayerIndex === 0 ? 1 : 0;
  updateLaneMarkup(elements.opponentLane, renderLane(opponentPlayerIndex, state.activePlayer === opponentPlayerIndex));
  updateLaneMarkup(elements.currentLane, renderLane(localPlayerIndex, state.activePlayer === localPlayerIndex));
  syncLaneControls();
  renderTurnTimer();
}

function updateLaneMarkup(element, markup) {
  if (element._buraMarkup === markup) return;
  element._buraMarkup = markup;
  element.innerHTML = markup;
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
      selected: (state.selectedIds || []).includes(card.id)
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
        <h2>${lanePlayerNameMarkup(playerIndex, player.name)}</h2>
      </div>
      ${playerIndex === state.localPlayerIndex ? `
        <div class="captured-count" aria-label="${player.captured.length} ${uiLabel("game", "takenCards")}">
          <strong>${player.captured.length}</strong>
          <span>${labelMarkup("game", "takenCards")}</span>
        </div>
      ` : ""}
      <div class="turn-ornaments ${isCurrentLane ? "active" : ""} ${state.openingTurnSignal && state.phase === "lead" && state.leader === playerIndex ? "opening-turn-signal" : ""}" data-turn-ornaments="${playerIndex}" aria-hidden="true">
        <img src="assets/design/ornament1%201.svg" alt="">
        <img src="assets/design/ornament1%201.svg" alt="">
        <img src="assets/design/ornament1%201.svg" alt="">
      </div>
      <div class="turn-timer" data-turn-timer="${playerIndex}" aria-live="off" hidden></div>
    </div>
    ${playerIndex === state.localPlayerIndex ? `
      <div class="hand-controls-row">
        <div class="hand-row">${cardsMarkup}</div>
        <div class="lane-actions" id="current-lane-actions"></div>
      </div>
    ` : ""}
  `;
}

function setActionButtons(markup, count = 0, stackSpecialActions = false) {
  if (!elements.actionButtons) return;
  const shouldStack = count > 0 && (count <= 2 || (stackSpecialActions && count === 3));
  elements.actionButtons.className = `lane-actions${shouldStack ? " is-stacked-actions" : ""}`;
  elements.actionButtons.innerHTML = markup;
}

function renderActions() {
  if (state.phase === "setup") return;

  const localIndex = state.localPlayerIndex;
  const playerOneMaliutka = !hasBura(localIndex) && maliutkaCards(localIndex).length === HAND_SIZE;
  const playerOneMaliutkaButton = playerOneMaliutka
    ? `<button class="secondary-button gold action-special" type="button" data-action="maliutka">${labelMarkup("game", "declareMaliutka")}</button>`
    : "";

  if (state.phase === "dealPause") {
    setActionButtons("");
    return;
  }

  if (state.phase === "buraReveal") {
    setActionButtons("");
    return;
  }

  if (state.phase === "gameOver") {
    setActionButtons("");
    return;
  }

  if (state.phase === "trickPause") {
    if (isDealExhausted()) {
      setActionButtons("");
      return;
    }
    const canContinue = canReviewWonTrickFor(state.localPlayerIndex);
    const offerButton = canOfferIncrease()
      ? increaseOfferButtonMarkup()
      : "";
    setActionButtons(canContinue
      ? `
        <button class="primary-button action-primary" type="button" data-action="continue">${labelMarkup("game", "continue")}</button>
        ${offerButton}
        <button class="secondary-button action-secondary-right" type="button" data-action="claim">${labelMarkup("game", "claim61")}</button>
      `
      : "", canContinue ? 2 + Number(Boolean(offerButton)) : 0);
    bindActionButtons();
    return;
  }

  if (state.phase === "maliutkaPending") {
    const canResolve = canResolveMaliutkaFor(state.localPlayerIndex);
    const offerButton = canOfferIncrease()
      ? increaseOfferButtonMarkup()
      : "";
    setActionButtons(canResolve
      ? `<button class="primary-button action-primary" type="button" data-action="maliutka-continue">${labelMarkup("game", "maliutkaMove")}</button>${offerButton}`
      : "", canResolve ? 1 + Number(Boolean(offerButton)) : 0);
    bindActionButtons();
    return;
  }

  if (state.phase === "offerPending" && state.offer) {
    const offer = state.offer;
    if (state.localPlayerIndex !== offer.to || (state.dummyOpponent && state.activePlayer === 1)) {
      setActionButtons("");
    } else {
      setActionButtons(`
        <button class="primary-button action-primary" type="button" data-action="accept-offer">${labelMarkup("game", "acceptOffer")}</button>
        <button class="secondary-button action-secondary-right" type="button" data-action="decline-offer">${labelMarkup("game", "declineOffer")}</button>
      `, 2);
    }
    bindActionButtons();
    return;
  }

  if (state.dummyOpponent && state.activePlayer === 1) {
    setActionButtons(playerOneMaliutkaButton, playerOneMaliutkaButton ? 1 : 0);
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
    ? `<button class="secondary-button gold action-special" type="button" data-action="bura">${labelMarkup("game", "declareBura")}</button>`
    : "";
  const maliutkaButton = playerOneMaliutkaButton;
  const claimButton = state.claimAvailableFor === state.activePlayer
    && state.activePlayer === state.localPlayerIndex
    && state.lastTrick?.winnerIndex === state.activePlayer
    ? `<button class="secondary-button action-secondary-right" type="button" data-action="claim">${labelMarkup("game", "claim61")}</button>`
    : "";
  const canOffer = canOfferIncrease();
  const offerButton = canOffer
    ? increaseOfferButtonMarkup()
    : "";
  const secondaryRightButton = claimButton || `<button class="secondary-button action-secondary-right" type="button" data-action="clear" ${isLocalTurn && cards.length ? "" : "disabled"}>${labelMarkup("game", "clear")}</button>`;
  const actionCount = 2 + Number(Boolean(offerButton)) + Number(Boolean(buraButton)) + Number(Boolean(maliutkaButton));
  setActionButtons(`
    <button class="primary-button action-primary" type="button" data-action="play" ${!hasValidSelection ? "disabled" : ""}>${playText}</button>
    ${offerButton}
    ${secondaryRightButton}
    ${buraButton}
    ${maliutkaButton}
  `, actionCount, Boolean(buraButton || maliutkaButton));
  bindActionButtons();
}

function bindActionButtons() {
  if (state.actionPending) {
    elements.actionButtons.querySelectorAll("[data-action]").forEach((button) => {
      button.disabled = true;
      button.setAttribute("aria-busy", "true");
    });
    return;
  }
  elements.actionButtons.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      if (["accept-offer", "decline-offer"].includes(action) && (!state.offer || state.localPlayerIndex !== state.offer.to)) return;
      if (onlineEnabled()) {
        if (action === "setup") return;
        if (action === "play") {
          const cards = selectedCards();
          const isValidSelection = state.phase === "lead" ? isValidLead(cards) : isValidAnswer(cards);
          if (!isValidSelection) return;
          scheduleOnlinePlay(cards);
          return;
        }
        if (action === "clear") {
          onlinePendingSelection = null;
          onlinePendingPlay = null;
          clearSelection();
          return;
        }
        scheduleOnlineAction(action);
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
    <picture>
      <source media="(max-width: 660px)" srcset="${mobileCardAssetPath(card)}" type="image/svg+xml">
      <img class="card-image" src="${cardAssetPath(card)}" alt="${label}">
    </picture>
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
  const directory = currentCardDeck === "mobile" ? "assets/cards/mobile" : "assets/cards";
  return `${directory}/${card.suit}-${card.rank.toLowerCase()}.svg`;
}

function mobileCardAssetPath(card) {
  return cardAssetPath(card);
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
elements.accountMenuButton?.addEventListener("click", () => setAccountSidebarOpen(true));
elements.accountSidebarBackdrop?.addEventListener("click", () => setAccountSidebarOpen(false));
elements.accountSidebarCloseButton?.addEventListener("click", () => setAccountSidebarOpen(false));
elements.accountSidebarSettingsButton?.addEventListener("click", () => {
  setAccountPreferencesOpen(elements.accountPreferences?.hidden);
});
elements.settingsButton?.addEventListener("click", () => {
  setGameSettingsOpen(elements.gameSettingsMenu?.hidden);
});
elements.gameSettingsMenu?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-card-deck-choice]");
  if (button) setCardDeck(button.dataset.cardDeckChoice);
});
elements.accountPreferences?.addEventListener("click", (event) => {
  const languageButton = event.target.closest("[data-language-choice]");
  if (languageButton) {
    setLanguage(languageButton.dataset.languageChoice);
    return;
  }
  const themeButton = event.target.closest("[data-theme-choice]");
  if (themeButton) setTheme(themeButton.dataset.themeChoice);
});
elements.accountNameEditButton?.addEventListener("click", () => {
  if (elements.accountPlayerName?.hidden) {
    setAccountNameEditing(true);
  } else {
    void saveAccountPlayerName();
  }
});
elements.accountPlayerName?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    void saveAccountPlayerName();
  }
  if (event.key === "Escape") setAccountNameEditing(false);
});
elements.accountProfileId?.addEventListener("click", () => { void copyAccountId(); });
elements.accountGoogleButton?.addEventListener("click", () => { void signInWithAccountProvider("google"); });
elements.accountFacebookButton?.addEventListener("click", () => { void signInWithAccountProvider("facebook"); });
elements.inviteGuestButton?.addEventListener("click", () => { void joinInviteAsGuest(); });
elements.inviteGoogleButton?.addEventListener("click", () => { void signInWithAccountProvider("google"); });
elements.inviteFacebookButton?.addEventListener("click", () => { void signInWithAccountProvider("facebook"); });
elements.accountSignOutButton?.addEventListener("click", () => { void signOutAccount(); });
elements.resultExitButton?.addEventListener("click", () => closeMatchSummary(true));
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
  renderLobby();
});

elements.lobbyActiveButton?.addEventListener("click", () => {
  if (lobbyView === "active") return;
  lobbyView = "active";
  renderLobby();
});

elements.lobbyList?.addEventListener("click", (event) => {
  const copyButton = event.target.closest("[data-lobby-copy-link]");
  if (copyButton) {
    void copyLobbyRoomLink(copyButton.dataset.lobbyCopyLink, copyButton);
    return;
  }
  const rejoinButton = event.target.closest("[data-lobby-rejoin-id]");
  if (rejoinButton) {
    void rejoinLobbyRoom(rejoinButton.dataset.lobbyRejoinId);
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
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!elements.gameSettingsMenu?.hidden) {
    setGameSettingsOpen(false);
    return;
  }
  if (!elements.accountSidebar?.hidden) setAccountSidebarOpen(false);
});

showSetup();
if (pendingInviteRoomCode()) void openInviteJoinGate();

getAccountClient()?.auth?.onAuthStateChange((_event, session) => {
  void refreshAccountControls(session?.user || null);
  if (session?.user && !isGuestAccount(session.user) && pendingInviteRoomCode()) {
    void joinInviteAsSignedInUser(session.user);
  }
});

function warmBackgroundSounds(registration) {
  const requestCaching = () => {
    const worker = registration.active || navigator.serviceWorker.controller;
    worker?.postMessage({ type: "CACHE_BACKGROUND_SOUNDS" });
  };
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(requestCaching, { timeout: 2000 });
  } else {
    window.setTimeout(requestCaching, 0);
  }
}

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("service-worker.js?v=3.204.0", { updateViaCache: "none" })
    .then(() => navigator.serviceWorker.ready)
    .then(warmBackgroundSounds)
    .catch(() => {});
}

if (readOnlineSession() && !pendingInviteRoomCode()) void reconnectSavedRoom();
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    if (state.phase === "setup") pauseLobbyRefresh();
    return;
  }
  if (onlineEnabled()) {
    void refreshOnlineRoom();
    return;
  }
  if (state.phase === "setup" && elements.onlineMode?.checked) startLobbyUpdates();
});
