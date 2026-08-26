(function attachBuraAuthorityClient(global) {
  "use strict";

  class BuraAuthorityClient {
    constructor({ supabase, gameServerUrl }) {
      if (!supabase) throw new Error("Supabase client is required");
      if (!gameServerUrl) throw new Error("Game server URL is required");
      this.supabase = supabase;
      this.gameServerUrl = gameServerUrl.replace(/\/$/, "");
    }

    async ensureSession() {
      const existing = await this.getSession();
      if (existing) return existing;
      const { data, error } = await this.supabase.auth.signInAnonymously();
      if (error || !data.session) throw error || new Error("Guest sign-in failed");
      return data.session;
    }

    async getSession() {
      const { data, error } = await this.supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    }

    async getCurrentUser() {
      const { data, error } = await this.supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    }

    async signOut() {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
    }

    async signInWith(provider, redirectTo = global.location.href) {
      const { data, error } = await this.supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
      if (error) throw error;
      return data;
    }

    async upgradeGuestWith(provider, redirectTo = global.location.href) {
      await this.ensureSession();
      const { data, error } = await this.supabase.auth.linkIdentity({ provider, options: { redirectTo } });
      if (error) throw error;
      return data;
    }

    async listLobby() { return this.request("/v1/lobby"); }
    async setNickname(nickname) { return this.request("/v1/profile", { method: "POST", body: { nickname } }); }
    async createMatch({ stake, private: isPrivate = false, matchTarget = 3 }) { return this.request("/v1/matches", { method: "POST", body: { stake, private: isPrivate, matchTarget } }); }
    async joinMatch(matchId) { return this.request(`/v1/matches/${encodeURIComponent(matchId)}/join`, { method: "POST", body: {} }); }
    async joinMatchByCode(roomCode) { return this.request("/v1/matches/join-by-code", { method: "POST", body: { roomCode } }); }
    async cancelMatch(matchId) { return this.request(`/v1/matches/${encodeURIComponent(matchId)}`, { method: "DELETE" }); }
    async getMatch(matchId) { return this.request(`/v1/matches/${encodeURIComponent(matchId)}`); }

    async connect(matchId, handlers = {}) {
      const ticket = await this.request(`/v1/matches/${encodeURIComponent(matchId)}/socket-ticket`, { method: "POST", body: {} });
      const webSocketUrl = this.gameServerUrl.replace(/^http:/i, "ws:").replace(/^https:/i, "wss:");
      const socket = new WebSocket(`${webSocketUrl}/v1/matches/${encodeURIComponent(matchId)}/connect?ticket=${encodeURIComponent(ticket.ticket)}`);
      socket.addEventListener("message", (event) => {
        let payload;
        try { payload = JSON.parse(event.data); } catch { return; }
        if (payload.type === "state") handlers.onState?.(payload.state);
        if (payload.type === "error") handlers.onError?.(payload.error);
      });
      socket.addEventListener("open", () => handlers.onOpen?.());
      socket.addEventListener("close", (event) => handlers.onClose?.(event));
      socket.addEventListener("error", () => handlers.onError?.("socket_error"));
      return {
        socket,
        send(command) {
          if (socket.readyState !== WebSocket.OPEN) throw new Error("Match connection is not open");
          socket.send(JSON.stringify(command));
        },
        close() { socket.close(1000, "client_closed"); }
      };
    }

    async request(path, options = {}) {
      const session = await this.ensureSession();
      const response = await fetch(`${this.gameServerUrl}${path}`, {
        method: options.method || "GET",
        cache: "no-store",
        headers: { Authorization: `Bearer ${session.access_token}`, ...(options.body ? { "Content-Type": "application/json" } : {}) },
        body: options.body ? JSON.stringify(options.body) : undefined
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "game_server_request_failed");
      return payload;
    }
  }

  global.BURA_AUTHORITY_CLIENT = { BuraAuthorityClient, create: (options) => new BuraAuthorityClient(options) };
})(window);
