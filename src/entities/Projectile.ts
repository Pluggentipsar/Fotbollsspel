import type { Player } from './Player';

export interface ProjectileConfig {
  damage: number;
  speed: number;
  size: number;
  knockback: number;
  stunDuration: number;
  color?: number;
}

export class Projectile {
  sprite: Phaser.Physics.Arcade.Sprite;
  visual: Phaser.GameObjects.Arc;
  damage: number;
  knockback: number;
  stunDuration: number;
  owner: Player;
  active: boolean = false;

  constructor(scene: Phaser.Scene) {
    // Skapa osynlig physics sprite
    this.sprite = scene.physics.add.sprite(-100, -100, '__DEFAULT');
    this.sprite.setVisible(false);
    this.sprite.setActive(false);

    // Visuell
    this.visual = scene.add.circle(-100, -100, 4, 0xffff00);
    this.visual.setVisible(false);

    // Defaults — skrivs över vid fire()
    this.damage = 0;
    this.knockback = 0;
    this.stunDuration = 0;
    this.owner = null as unknown as Player;
  }

  fire(owner: Player, x: number, y: number, angle: number, config: ProjectileConfig): void {
    this.owner = owner;
    this.damage = config.damage;
    this.knockback = config.knockback;
    this.stunDuration = config.stunDuration;
    this.active = true;

    // Positionera
    this.sprite.setPosition(x, y);
    this.sprite.setActive(true);
    this.sprite.setCircle(config.size);

    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.enable = true;

    // Sätt hastighet
    const vx = Math.cos(angle) * config.speed;
    const vy = Math.sin(angle) * config.speed;
    body.setVelocity(vx, vy);

    // Visuell
    this.visual.setPosition(x, y);
    this.visual.setRadius(config.size);
    this.visual.setFillStyle(config.color ?? 0xffff00);
    this.visual.setVisible(true);
  }

  update(): void {
    if (!this.active) return;
    this.visual.setPosition(this.sprite.x, this.sprite.y);
  }

  deactivate(): void {
    this.active = false;
    this.sprite.setActive(false);
    this.sprite.setPosition(-100, -100);
    (this.sprite.body as Phaser.Physics.Arcade.Body).enable = false;
    this.visual.setVisible(false);
  }

  destroy(): void {
    this.sprite.destroy();
    this.visual.destroy();
  }
}
