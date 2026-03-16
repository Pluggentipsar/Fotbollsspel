import type { IWeapon } from './IWeapon';
import type { Player } from '@/entities/Player';
import type { ProjectilePool } from '@/entities/ProjectilePool';
import { SHOTGUN } from '@/config/weapons';

export class Shotgun implements IWeapon {
  readonly name = 'Shotgun';
  readonly fireRate = SHOTGUN.fireRate;
  private pool: ProjectilePool;
  private lastFireTime: number = 0;

  constructor(pool: ProjectilePool) {
    this.pool = pool;
  }

  canFire(): boolean {
    const now = Date.now();
    return now - this.lastFireTime >= SHOTGUN.cooldown;
  }

  fire(owner: Player, angle: number): void {
    if (!this.canFire()) return;
    this.lastFireTime = Date.now();

    // Skjut flera pellets i en kon
    const totalSpread = SHOTGUN.spread * 2;
    const startAngle = angle - SHOTGUN.spread;

    for (let i = 0; i < SHOTGUN.pelletsPerShot; i++) {
      const pelletAngle = startAngle + (totalSpread * i) / (SHOTGUN.pelletsPerShot - 1);
      // Lite extra slump per pellet
      const jitter = (Math.random() - 0.5) * 0.1;

      this.pool.fire(owner, owner.x, owner.y, pelletAngle + jitter, {
        damage: SHOTGUN.damage,
        speed: SHOTGUN.projectileSpeed + (Math.random() - 0.5) * 50,
        size: SHOTGUN.projectileSize,
        knockback: SHOTGUN.knockback,
        stunDuration: SHOTGUN.stunDuration,
        color: 0xff8800,
      });
    }
  }

  update(_delta: number): void {
    // Shotgun har ingen speciell update-logik
  }
}
