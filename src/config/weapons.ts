export const PISTOL = {
  damage: 15,
  fireRate: 4,                    // skott per sekund
  projectileSpeed: 500,           // px/s
  projectileSize: 4,              // px radie
  cooldown: 250,                  // ms
  ammo: Infinity,
  spread: 0.05,                   // radianer
  knockback: 50,                  // kraft i px/s
  stunDuration: 200,              // ms
} as const;

export const SHOTGUN = {
  damage: 8,
  fireRate: 1.5,
  projectileSpeed: 400,
  projectileSize: 3,
  cooldown: 667,
  ammo: Infinity,
  spread: 0.3,
  knockback: 120,
  stunDuration: 400,
  pelletsPerShot: 5,
} as const;

export const SNIPER = {
  damage: 50,
  fireRate: 0.5,
  projectileSpeed: 900,
  projectileSize: 3,
  cooldown: 2000,
  ammo: Infinity,
  spread: 0,
  knockback: 200,
  stunDuration: 800,
} as const;

export type WeaponConfig = typeof PISTOL;
