import type { IWeapon } from './IWeapon';
import type { Player } from '@/entities/Player';
import type { ProjectilePool } from '@/entities/ProjectilePool';
import { SNIPER } from '@/config/weapons';

export class Sniper implements IWeapon {
  readonly name = 'Sniper';
  readonly fireRate = SNIPER.fireRate;
  private pool: ProjectilePool;
  private lastFireTime: number = 0;

  constructor(pool: ProjectilePool) {
    this.pool = pool;
  }

  canFire(): boolean {
    const now = Date.now();
    return now - this.lastFireTime >= SNIPER.cooldown;
  }

  fire(owner: Player, angle: number): void {
    if (!this.canFire()) return;
    this.lastFireTime = Date.now();

    // Sniper — helt rak, ingen spridning
    this.pool.fire(owner, owner.x, owner.y, angle, {
      damage: SNIPER.damage,
      speed: SNIPER.projectileSpeed,
      size: SNIPER.projectileSize,
      knockback: SNIPER.knockback,
      stunDuration: SNIPER.stunDuration,
      color: 0xff0000,
    });
  }

  update(_delta: number): void {
    // Sniper har ingen speciell update-logik
  }
}
