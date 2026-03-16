export const GAME_CONFIG = {
  WIDTH: 1280,                    // px
  HEIGHT: 720,                    // px
  BACKGROUND_COLOR: '#2d5a27',    // grönt som fotbollsplan
  DEBUG: true,                    // visa physics debug
  MAX_PLAYERS_PER_TEAM: 5,
  MATCH_DURATION: 180,            // sekunder
  RESPAWN_TIME: 3000,             // ms
} as const;

export type GameConfig = typeof GAME_CONFIG;
