import { BALL_CONFIG } from '@/config/ball';

export class Ball {
  scene: Phaser.Scene;
  sprite: Phaser.Physics.Arcade.Sprite;
  visual: Phaser.GameObjects.Arc;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;

    // Physics sprite (osynlig)
    this.sprite = scene.physics.add.sprite(x, y, '__DEFAULT');
    this.sprite.setVisible(false);
    this.sprite.setCircle(BALL_CONFIG.SIZE);

    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setBounce(BALL_CONFIG.BOUNCE, BALL_CONFIG.BOUNCE);
    body.setMaxVelocity(BALL_CONFIG.MAX_SPEED, BALL_CONFIG.MAX_SPEED);

    // Visuell representation — vit cirkel
    this.visual = scene.add.circle(x, y, BALL_CONFIG.SIZE, 0xffffff);
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

  kick(angle: number, force: number): void {
    const vx = Math.cos(angle) * force;
    const vy = Math.sin(angle) * force;
    this.body.setVelocity(vx, vy);
  }

  update(_delta: number): void {
    // Applicera friktion
    const vx = this.body.velocity.x * BALL_CONFIG.FRICTION;
    const vy = this.body.velocity.y * BALL_CONFIG.FRICTION;

    // Stoppa bollen om den är tillräckligt långsam
    if (Math.abs(vx) < BALL_CONFIG.MIN_SPEED && Math.abs(vy) < BALL_CONFIG.MIN_SPEED) {
      this.body.setVelocity(0, 0);
    } else {
      this.body.setVelocity(vx, vy);
    }

    // Synka visuell position
    this.visual.setPosition(this.x, this.y);
  }

  resetPosition(x: number, y: number): void {
    this.sprite.setPosition(x, y);
    this.body.setVelocity(0, 0);
    this.visual.setPosition(x, y);
  }

  destroy(): void {
    this.sprite.destroy();
    this.visual.destroy();
  }
}
