import { InputManager } from '@/input/InputManager';
import { Player, type Team } from '@/entities/Player';
import { Ball } from '@/entities/Ball';
import { Field } from '@/entities/Field';
import { ProjectilePool } from '@/entities/ProjectilePool';
import { Pistol } from '@/weapons/Pistol';
import { AISystem } from '@/systems/AISystem';
import { HUD } from '@/ui/HUD';
import { GAME_CONFIG } from '@/config/game';
import { FIELD_CONFIG } from '@/config/field';
import { PLAYER_CONFIG } from '@/config/player';

export class GameScene extends Phaser.Scene {
  private field!: Field;
  private ball!: Ball;
  private players: Player[] = [];
  private homePlayers: Player[] = [];
  private awayPlayers: Player[] = [];
  private humanPlayer!: Player;
  private inputManager!: InputManager;
  private projectilePool!: ProjectilePool;
  private aiSystem!: AISystem;
  private hud!: HUD;

  private matchTimer: number = GAME_CONFIG.MATCH_DURATION;
  private homeScore: number = 0;
  private awayScore: number = 0;
  private isGoalCooldown: boolean = false;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    // Fotbollsplan
    this.field = new Field(this);

    // Projektil-pool
    this.projectilePool = new ProjectilePool(this);

    // Input
    this.inputManager = new InputManager(this);

    // AI
    this.aiSystem = new AISystem();

    // Boll i mitten
    this.ball = new Ball(this, FIELD_CONFIG.CENTER_X, FIELD_CONFIG.CENTER_Y);

    // Skapa spelare
    this.createTeams();

    // Physics-kollisioner
    this.setupCollisions();

    // HUD
    this.hud = new HUD(this);
    this.hud.updateHealth(this.humanPlayer.health, this.humanPlayer.maxHealth);
    this.hud.updateWeapon(this.humanPlayer.weapon?.name ?? 'Ingen');

    // Lyssna på mål-event
    this.events.on('entity-died', (entity: Player) => {
      this.time.delayedCall(GAME_CONFIG.RESPAWN_TIME, () => {
        const spawnPos = this.getSpawnPosition(entity.team);
        entity.respawn(spawnPos.x, spawnPos.y);
      });
    });
  }

  private createTeams(): void {
    const cx = FIELD_CONFIG.CENTER_X;
    const cy = FIELD_CONFIG.CENTER_Y;

    // Mänsklig spelare (home team, första positionen)
    const humanPos = FIELD_CONFIG.HOME_SPAWN_POSITIONS[0];
    this.humanPlayer = new Player(
      this,
      cx + humanPos.x,
      cy + humanPos.y,
      'home',
      this.inputManager,
    );
    this.humanPlayer.setWeapon(new Pistol(this.projectilePool));
    this.homePlayers.push(this.humanPlayer);
    this.players.push(this.humanPlayer);

    // Resten av home team (AI)
    for (let i = 1; i < FIELD_CONFIG.HOME_SPAWN_POSITIONS.length; i++) {
      const pos = FIELD_CONFIG.HOME_SPAWN_POSITIONS[i];
      const player = new Player(this, cx + pos.x, cy + pos.y, 'home');
      player.setWeapon(new Pistol(this.projectilePool));
      this.homePlayers.push(player);
      this.players.push(player);
    }

    // Away team (alla AI)
    for (const pos of FIELD_CONFIG.AWAY_SPAWN_POSITIONS) {
      const player = new Player(this, cx + pos.x, cy + pos.y, 'away');
      player.setWeapon(new Pistol(this.projectilePool));
      this.awayPlayers.push(player);
      this.players.push(player);
    }
  }

  private setupCollisions(): void {
    const playerSprites = this.players.map((p) => p.sprite);

    // Spelare vs spelare
    for (let i = 0; i < playerSprites.length; i++) {
      for (let j = i + 1; j < playerSprites.length; j++) {
        this.physics.add.collider(playerSprites[i], playerSprites[j]);
      }
    }

    // Spelare vs väggar
    for (const player of this.players) {
      this.physics.add.collider(player.sprite, this.field.walls);
    }

    // Boll vs väggar
    this.physics.add.collider(this.ball.sprite, this.field.walls);

    // Boll vs spelare (dribbling/bollkontroll)
    for (const player of this.players) {
      this.physics.add.overlap(
        player.sprite,
        this.ball.sprite,
        () => this.handleBallContact(player),
      );
    }

    // Projektiler vs spelare
    for (const projectile of this.projectilePool.getAllSprites()) {
      for (const player of this.players) {
        this.physics.add.overlap(
          projectile,
          player.sprite,
          () => this.handleProjectileHit(projectile, player),
        );
      }
    }

    // Boll vs mål
    this.physics.add.overlap(
      this.ball.sprite,
      this.field.homeGoal,
      () => this.handleGoal('away'),
    );
    this.physics.add.overlap(
      this.ball.sprite,
      this.field.awayGoal,
      () => this.handleGoal('home'),
    );
  }

  private handleBallContact(player: Player): void {
    if (!player.alive) return;

    const dist = Phaser.Math.Distance.Between(player.x, player.y, this.ball.x, this.ball.y);
    if (dist > PLAYER_CONFIG.DRIBBLE_RANGE) return;

    // Markera att spelaren har bollen
    for (const p of this.players) p.hasBall = false;
    player.hasBall = true;

    // Pass/skott
    if (player.lastInput?.pass) {
      const aimAngle = Phaser.Math.Angle.Between(
        player.x, player.y,
        player.lastInput.aim.x, player.lastInput.aim.y,
      );
      this.ball.kick(aimAngle, PLAYER_CONFIG.SHOT_FORCE);
      player.hasBall = false;
    } else {
      // Dribbling — bollen följer spelaren mjukt
      const angle = Phaser.Math.Angle.Between(this.ball.x, this.ball.y, player.x, player.y);
      const offsetX = player.x + Math.cos(angle + Math.PI) * 20;
      const offsetY = player.y + Math.sin(angle + Math.PI) * 20;
      const dx = offsetX - this.ball.x;
      const dy = offsetY - this.ball.y;
      this.ball.body.setVelocity(dx * 5, dy * 5);
    }
  }

  private handleProjectileHit(
    projectileSprite: Phaser.Physics.Arcade.Sprite,
    player: Player,
  ): void {
    if (!player.alive || !projectileSprite.active) return;

    // Hitta projektil-objektet
    const activeProjectiles = this.projectilePool.getActiveProjectiles();
    const projectile = activeProjectiles.find((p) => p.sprite === projectileSprite);
    if (!projectile) return;

    // Inte skada sig själv
    if (projectile.owner === player) return;
    // Inte skada lagkamrater
    if (projectile.owner.team === player.team) return;

    // Applicera skada
    player.takeDamage(projectile.damage);

    // Knockback
    const angle = Phaser.Math.Angle.Between(
      projectile.sprite.x, projectile.sprite.y,
      player.x, player.y,
    );
    player.applyKnockback(
      Math.cos(angle) * projectile.knockback,
      Math.sin(angle) * projectile.knockback,
    );

    // Stun
    if (projectile.stunDuration > 0) {
      player.applyStun(projectile.stunDuration);
    }

    // Ta bort projektil
    projectile.deactivate();

    // Uppdatera HUD om det är human player
    if (player === this.humanPlayer) {
      this.hud.updateHealth(player.health, player.maxHealth);
    }
  }

  private handleGoal(scoringTeam: Team): void {
    if (this.isGoalCooldown) return;
    this.isGoalCooldown = true;

    if (scoringTeam === 'home') this.homeScore++;
    else this.awayScore++;

    this.hud.goalScored(scoringTeam);

    // Reset efter 2 sekunder
    this.time.delayedCall(2000, () => {
      this.resetAfterGoal();
      this.isGoalCooldown = false;
    });
  }

  private resetAfterGoal(): void {
    // Boll till center
    this.ball.resetPosition(FIELD_CONFIG.CENTER_X, FIELD_CONFIG.CENTER_Y);

    // Spelare till startpositioner
    const cx = FIELD_CONFIG.CENTER_X;
    const cy = FIELD_CONFIG.CENTER_Y;

    for (let i = 0; i < this.homePlayers.length; i++) {
      const pos = FIELD_CONFIG.HOME_SPAWN_POSITIONS[i];
      if (pos) {
        this.homePlayers[i].respawn(cx + pos.x, cy + pos.y);
      }
    }
    for (let i = 0; i < this.awayPlayers.length; i++) {
      const pos = FIELD_CONFIG.AWAY_SPAWN_POSITIONS[i];
      if (pos) {
        this.awayPlayers[i].respawn(cx + pos.x, cy + pos.y);
      }
    }
  }

  private getSpawnPosition(team: Team): { x: number; y: number } {
    const positions = team === 'home'
      ? FIELD_CONFIG.HOME_SPAWN_POSITIONS
      : FIELD_CONFIG.AWAY_SPAWN_POSITIONS;
    const pos = positions[Math.floor(Math.random() * positions.length)];
    return {
      x: FIELD_CONFIG.CENTER_X + pos.x,
      y: FIELD_CONFIG.CENTER_Y + pos.y,
    };
  }

  update(_time: number, delta: number): void {
    // Match-timer
    this.matchTimer -= delta / 1000;
    if (this.matchTimer <= 0) {
      this.matchTimer = 0;
      this.scene.start('GameOverScene', {
        homeScore: this.homeScore,
        awayScore: this.awayScore,
      });
      return;
    }
    this.hud.updateTimer(this.matchTimer);

    // Uppdatera AI för alla AI-spelare
    for (const player of this.players) {
      if (player.isAI && player.alive) {
        const opponents = player.team === 'home' ? this.awayPlayers : this.homePlayers;
        const teammates = player.team === 'home' ? this.homePlayers : this.awayPlayers;
        player.lastInput = this.aiSystem.update({
          player,
          ball: this.ball,
          teammates: teammates.filter((p) => p !== player),
          opponents,
          ownGoalX: player.team === 'home' ? FIELD_CONFIG.LEFT : FIELD_CONFIG.RIGHT,
          opponentGoalX: player.team === 'home' ? FIELD_CONFIG.RIGHT : FIELD_CONFIG.LEFT,
        });
      }
    }

    // Uppdatera alla spelare
    for (const player of this.players) {
      player.update(delta);
    }

    // Uppdatera boll
    this.ball.update(delta);

    // Uppdatera projektiler
    this.projectilePool.update();

    // Uppdatera HUD
    this.hud.updateHealth(this.humanPlayer.health, this.humanPlayer.maxHealth);
    this.hud.updateInputMode(this.inputManager.getMode());
    if (this.humanPlayer.weapon) {
      this.hud.updateWeapon(this.humanPlayer.weapon.name);
    }
  }

  shutdown(): void {
    this.field.destroy();
    this.ball.destroy();
    this.players.forEach((p) => p.destroy());
    this.projectilePool.destroy();
    this.hud.destroy();
    this.inputManager.destroy();
  }
}
