import { Entity } from './Entity';
import { InputManager } from '@/input/InputManager';
import { type InputState } from '@/input/InputState';
import { PLAYER_CONFIG } from '@/config/player';
import type { IWeapon } from '@/weapons/IWeapon';

export type Team = 'home' | 'away';

export class Player extends Entity {
  team: Team;
  inputManager: InputManager | null;
  weapon: IWeapon | null = null;
  hasBall: boolean = false;
  stunTimer: number = 0;
  isAI: boolean;

  // Senaste input-state, tillgängligt för AI och andra system
  lastInput: InputState | null = null;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    team: Team,
    inputManager: InputManager | null = null,
  ) {
    super(scene, {
      x,
      y,
      texture: '__DEFAULT', // Placeholder tills vi har sprites
      health: PLAYER_CONFIG.HEALTH,
      speed: PLAYER_CONFIG.SPEED,
    });

    this.team = team;
    this.inputManager = inputManager;
    this.isAI = inputManager === null;

    // Physics body setup
    this.sprite.setCircle(PLAYER_CONFIG.SIZE);
    this.body.setCollideWorldBounds(true);

    // Visuell placeholder — färgad cirkel baserat på lag
    this.sprite.setVisible(false);
    const color = team === 'home' ? 0x3366ff : 0xff3333;
    const graphics = scene.add.circle(x, y, PLAYER_CONFIG.SIZE, color);
    // Koppla grafik till sprite-position
    this.sprite.setData('visual', graphics);
  }

  setWeapon(weapon: IWeapon): void {
    this.weapon = weapon;
  }

  applyStun(duration: number): void {
    this.stunTimer = duration;
  }

  applyKnockback(forceX: number, forceY: number): void {
    this.body.setVelocity(
      this.body.velocity.x + forceX,
      this.body.velocity.y + forceY,
    );
  }

  update(delta: number): void {
    if (!this.alive) return;

    // Uppdatera stun-timer
    if (this.stunTimer > 0) {
      this.stunTimer -= delta;
      // Under stun: sakta ner kraftigt
      this.body.setVelocity(
        this.body.velocity.x * 0.9,
        this.body.velocity.y * 0.9,
      );
      this.syncVisual();
      return;
    }

    // Hämta input (AI sätter lastInput externt)
    if (this.inputManager) {
      this.lastInput = this.inputManager.getState(this.x, this.y);
    }

    if (this.lastInput) {
      // Rörelse
      const speed = this.speed;
      this.body.setVelocity(
        this.lastInput.movement.x * speed,
        this.lastInput.movement.y * speed,
      );

      // Skjut vapen
      if (this.lastInput.shoot && this.weapon) {
        const aimAngle = Phaser.Math.Angle.Between(
          this.x, this.y,
          this.lastInput.aim.x, this.lastInput.aim.y,
        );
        this.weapon.fire(this, aimAngle);
      }
    }

    this.syncVisual();
  }

  private syncVisual(): void {
    const visual = this.sprite.getData('visual') as Phaser.GameObjects.Arc | undefined;
    if (visual) {
      visual.setPosition(this.x, this.y);
    }
  }

  destroy(): void {
    const visual = this.sprite.getData('visual') as Phaser.GameObjects.Arc | undefined;
    visual?.destroy();
    super.destroy();
  }
}
