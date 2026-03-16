import { Projectile, type ProjectileConfig } from './Projectile';
import type { Player } from './Player';

const POOL_SIZE = 50;

export class ProjectilePool {
  private pool: Projectile[] = [];
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    // Förallokera projektiler
    for (let i = 0; i < POOL_SIZE; i++) {
      this.pool.push(new Projectile(scene));
    }
  }

  fire(owner: Player, x: number, y: number, angle: number, config: ProjectileConfig): Projectile | null {
    // Hitta en inaktiv projektil
    const projectile = this.pool.find((p) => !p.active);
    if (!projectile) return null;

    projectile.fire(owner, x, y, angle, config);
    return projectile;
  }

  getActiveProjectiles(): Projectile[] {
    return this.pool.filter((p) => p.active);
  }

  getAllSprites(): Phaser.Physics.Arcade.Sprite[] {
    return this.pool.map((p) => p.sprite);
  }

  update(): void {
    for (const projectile of this.pool) {
      if (!projectile.active) continue;
      projectile.update();

      // Avaktivera projektiler utanför skärmen
      const { x, y } = projectile.sprite;
      if (x < -50 || x > 1330 || y < -50 || y > 770) {
        projectile.deactivate();
      }
    }
  }

  destroy(): void {
    this.pool.forEach((p) => p.destroy());
    this.pool = [];
  }
}
