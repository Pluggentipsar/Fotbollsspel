import { FIELD_CONFIG } from '@/config/field';

export class Field {
  private scene: Phaser.Scene;
  private graphics: Phaser.GameObjects.Graphics;

  // Mål-zoner för kollision
  homeGoal!: Phaser.GameObjects.Zone;
  awayGoal!: Phaser.GameObjects.Zone;

  // Väggar (inklusive målstolpar)
  walls!: Phaser.Physics.Arcade.StaticGroup;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.graphics = scene.add.graphics();
    this.draw();
    this.createGoalZones();
    this.createWalls();
  }

  private draw(): void {
    const g = this.graphics;
    const f = FIELD_CONFIG;

    // Bakgrund
    g.fillStyle(f.FIELD_COLOR);
    g.fillRect(0, 0, 1280, 720);

    // Planens ytterlinje
    g.lineStyle(f.LINE_WIDTH, f.LINE_COLOR);
    g.strokeRect(f.LEFT, f.TOP, f.RIGHT - f.LEFT, f.BOTTOM - f.TOP);

    // Mittlinje
    g.beginPath();
    g.moveTo(f.CENTER_X, f.TOP);
    g.lineTo(f.CENTER_X, f.BOTTOM);
    g.strokePath();

    // Mittcirkel
    g.strokeCircle(f.CENTER_X, f.CENTER_Y, f.CENTER_CIRCLE_RADIUS);

    // Mittpunkt
    g.fillStyle(f.LINE_COLOR);
    g.fillCircle(f.CENTER_X, f.CENTER_Y, 4);

    // Vänster mål (home)
    g.lineStyle(f.LINE_WIDTH + 2, f.GOAL_COLOR);
    g.strokeRect(
      f.LEFT - f.GOAL_WIDTH,
      f.GOAL_TOP,
      f.GOAL_WIDTH,
      f.GOAL_HEIGHT,
    );

    // Höger mål (away)
    g.strokeRect(
      f.RIGHT,
      f.GOAL_TOP,
      f.GOAL_WIDTH,
      f.GOAL_HEIGHT,
    );

    // Straffområden
    g.lineStyle(f.LINE_WIDTH, f.LINE_COLOR);
    const penaltyWidth = 120;
    const penaltyHeight = 280;
    const penaltyTop = f.CENTER_Y - penaltyHeight / 2;

    // Vänster straffområde
    g.strokeRect(f.LEFT, penaltyTop, penaltyWidth, penaltyHeight);
    // Höger straffområde
    g.strokeRect(f.RIGHT - penaltyWidth, penaltyTop, penaltyWidth, penaltyHeight);
  }

  private createGoalZones(): void {
    const f = FIELD_CONFIG;

    // Home mål (vänster)
    this.homeGoal = this.scene.add.zone(
      f.LEFT - f.GOAL_WIDTH / 2,
      f.CENTER_Y,
      f.GOAL_WIDTH,
      f.GOAL_HEIGHT,
    );
    this.scene.physics.add.existing(this.homeGoal, true);

    // Away mål (höger)
    this.awayGoal = this.scene.add.zone(
      f.RIGHT + f.GOAL_WIDTH / 2,
      f.CENTER_Y,
      f.GOAL_WIDTH,
      f.GOAL_HEIGHT,
    );
    this.scene.physics.add.existing(this.awayGoal, true);
  }

  private createWalls(): void {
    const f = FIELD_CONFIG;
    this.walls = this.scene.physics.add.staticGroup();

    // Övre vägg
    this.createWall(f.CENTER_X, f.TOP - 10, f.RIGHT - f.LEFT + f.GOAL_WIDTH * 2, 20);
    // Undre vägg
    this.createWall(f.CENTER_X, f.BOTTOM + 10, f.RIGHT - f.LEFT + f.GOAL_WIDTH * 2, 20);

    // Vänster vägg — ovanför mål
    this.createWall(f.LEFT - 10, (f.TOP + f.GOAL_TOP) / 2, 20, f.GOAL_TOP - f.TOP);
    // Vänster vägg — nedanför mål
    this.createWall(f.LEFT - 10, (f.GOAL_BOTTOM + f.BOTTOM) / 2, 20, f.BOTTOM - f.GOAL_BOTTOM);
    // Vänster mål baksida
    this.createWall(f.LEFT - f.GOAL_WIDTH - 10, f.CENTER_Y, 20, f.GOAL_HEIGHT);

    // Höger vägg — ovanför mål
    this.createWall(f.RIGHT + 10, (f.TOP + f.GOAL_TOP) / 2, 20, f.GOAL_TOP - f.TOP);
    // Höger vägg — nedanför mål
    this.createWall(f.RIGHT + 10, (f.GOAL_BOTTOM + f.BOTTOM) / 2, 20, f.BOTTOM - f.GOAL_BOTTOM);
    // Höger mål baksida
    this.createWall(f.RIGHT + f.GOAL_WIDTH + 10, f.CENTER_Y, 20, f.GOAL_HEIGHT);
  }

  private createWall(x: number, y: number, width: number, height: number): void {
    const wall = this.scene.add.zone(x, y, width, height);
    this.scene.physics.add.existing(wall, true);
    this.walls.add(wall);
  }

  destroy(): void {
    this.graphics.destroy();
    this.homeGoal.destroy();
    this.awayGoal.destroy();
    this.walls.destroy(true);
  }
}
