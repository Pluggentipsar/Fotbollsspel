export const FIELD_CONFIG = {
  // Plan-dimensioner (inuti linjer)
  LEFT: 40,                       // px
  RIGHT: 1240,                    // px
  TOP: 60,                        // px
  BOTTOM: 660,                    // px

  // Mål
  GOAL_WIDTH: 20,                 // px djup
  GOAL_HEIGHT: 140,               // px höjd
  GOAL_TOP: 290,                  // px — y-position för målets överkant
  GOAL_BOTTOM: 430,               // px — y-position för målets underkant

  // Mittcirkeln
  CENTER_X: 640,                  // px
  CENTER_Y: 360,                  // px
  CENTER_CIRCLE_RADIUS: 80,       // px

  // Linjer
  LINE_COLOR: 0xffffff,
  LINE_WIDTH: 2,
  FIELD_COLOR: 0x2d5a27,
  GOAL_COLOR: 0xcccccc,

  // Spelarpositioner vid avspark (relativ till center)
  HOME_SPAWN_POSITIONS: [
    { x: -200, y: 0 },           // Mittfältare
    { x: -350, y: -120 },        // Vänster
    { x: -350, y: 120 },         // Höger
    { x: -500, y: 0 },           // Försvarare
  ],
  AWAY_SPAWN_POSITIONS: [
    { x: 200, y: 0 },
    { x: 350, y: -120 },
    { x: 350, y: 120 },
    { x: 500, y: 0 },
  ],
} as const;

export type FieldConfig = typeof FIELD_CONFIG;
