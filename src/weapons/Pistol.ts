import type { IWeapon } from './IWeapon';
import type { Player } from '@/entities/Player';
import type { ProjectilePool } from '@/entities/ProjectilePool';
import { PISTOL } from '@/config/weapons';

export class Pistol implements IWeapon {
  readonly name = 'Pistol';
  readonly fireRate = PISTOL.fireRate;
  private pool: ProjectilePool;
  private lastFireTime: number = 0;

  constructor(pool: ProjectilePool) {
    this.pool = pool;
  }

  canFire(): boolean {
    const now = Date.now();
    return now - this.lastFireTime >= PISTOL.cooldown;
  }

  fire(owner: Player, angle: number): void {
    if (!this.canFire()) return;
    this.lastFireTime = Date.now();

    // Lägg till lite spridning
    const spread = (Math.random() - 0.5) * PISTOL.spread * 2;
    const finalAngle = angle + spread;

    this.pool.fire(owner, owner.x, owner.y, finalAngle, {
      damage: PISTOL.damage,
      speed: PISTOL.projectileSpeed,
      size: PISTOL.projectileSize,
      knockback: PISTOL.knockback,
      stunDuration: PISTOL.stunDuration,
      color: 0xffff00,
    });
  }

  update(_delta: number): void {
    // Pistol har ingen speciell update-logik
  }
}
