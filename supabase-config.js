// Publishable browser client configuration. RLS protects room data in Supabase.
window.BURA_SUPABASE_CONFIG = {
  url: "https://jchwubvlaexheequcvim.supabase.co",
  publishableKey: "sb_publishable_c_AYsTtWxjBpkpHCva5oNw_5mIqAz9D",
  authRedirectUrl: "https://project-bura-v2124b.pages.dev/"
};

// Set this only after deploying game-server. Browser code never receives Worker secrets.
window.BURA_GAME_SERVER_CONFIG = {
  url: "https://bura-game-server.nikolozshurgaia.workers.dev"
};
