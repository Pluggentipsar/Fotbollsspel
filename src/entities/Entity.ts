export interface EntityConfig {
  x: number;
  y: number;
  texture: string;
  frame?: string;
  health?: number;
  speed?: number;
}

export abstract class Entity {
  scene: Phaser.Scene;
  sprite: Phaser.Physics.Arcade.Sprite;
  health: number;
  maxHealth: number;
  speed: number;
  alive: boolean = true;

  constructor(scene: Phaser.Scene, config: EntityConfig) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(config.x, config.y, config.texture, config.frame);
    this.health = config.health ?? 100;
    this.maxHealth = this.health;
    this.speed = config.speed ?? 200;
  }

  get x(): number {
    return this.sprite.x;
  }

  get y(): number {
    return this.sprite.y;
  }

  get body(): Phaser.Physics.Arcade.Body {
    return this.sprite.body as Phaser.Physics.Arcade.Body;
  }

  takeDamage(amount: number): void {
    if (!this.alive) return;
    this.health = Math.max(0, this.health - amount);
    if (this.health <= 0) {
      this.die();
    }
  }

  heal(amount: number): void {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  die(): void {
    this.alive = false;
    this.sprite.setActive(false);
    this.sprite.setVisible(false);
    this.body.enable = false;
    this.scene.events.emit('entity-died', this);
  }

  respawn(x: number, y: number): void {
    this.alive = true;
    this.health = this.maxHealth;
    this.sprite.setPosition(x, y);
    this.sprite.setActive(true);
    this.sprite.setVisible(true);
    this.body.enable = true;
    this.body.setVelocity(0, 0);
  }

  abstract update(delta: number): void;

  destroy(): void {
    this.sprite.destroy();
  }
}
