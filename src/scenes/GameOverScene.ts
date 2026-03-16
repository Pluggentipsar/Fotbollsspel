export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    this.add.text(width / 2, height / 3, 'MATCH SLUT', {
      fontSize: '48px',
      color: '#ffffff',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    // TODO: Visa slutresultat, mål, statistik

    this.add.text(width / 2, height * 0.6, 'Tryck SPACE eller A-knapp för att spela igen', {
      fontSize: '20px',
      color: '#cccccc',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    this.input.keyboard?.on('keydown-SPACE', () => {
      this.scene.start('MenuScene');
    });

    this.input.gamepad?.on('down', (
      _pad: Phaser.Input.Gamepad.Gamepad,
      button: Phaser.Input.Gamepad.Button,
    ) => {
      if (button.index === 0) {
        this.scene.start('MenuScene');
      }
    });
  }
}
