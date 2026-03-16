export const BALL_CONFIG = {
  SIZE: 8,                        // px radie
  FRICTION: 0.98,                 // hastighetsförlust per frame (1 = ingen friktion)
  BOUNCE: 0.7,                    // studskoefficient mot väggar
  MAX_SPEED: 800,                 // px/s
  MIN_SPEED: 5,                   // px/s - under detta stannar bollen
} as const;

export type BallConfig = typeof BALL_CONFIG;
