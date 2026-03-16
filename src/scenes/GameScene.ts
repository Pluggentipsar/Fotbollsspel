export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    // TODO: Implementera spellogik
    // - Skapa fotbollsplan
    // - Spawna spelare
    // - Skapa boll
    // - Sätt upp input
    // - Starta match-timer

    const { width, height } = this.cameras.main;

    this.add.text(width / 2, height / 2, 'GameScene - Under konstruktion', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial',
    }).setOrigin(0.5);
  }

  update(_time: number, _delta: number): void {
    // TODO: Game loop
    // - Uppdatera input
    // - Uppdatera entities
    // - Kolla kollisioner
    // - Uppdatera UI
  }
}
