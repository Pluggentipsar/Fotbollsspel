export const PLAYER_CONFIG = {
  SPEED: 200,                     // px/s
  SPRINT_SPEED: 320,              // px/s
  HEALTH: 100,
  SIZE: 16,                       // px radie
  DRIBBLE_RANGE: 30,              // px - avstånd för automatisk dribbling
  PASS_FORCE: 400,                // px/s - bollhastighet vid pass
  SHOT_FORCE: 600,                // px/s - bollhastighet vid skott
  STUN_RECOVERY: 500,             // ms - tid att återhämta sig från stun
} as const;

export type PlayerConfig = typeof PLAYER_CONFIG;
