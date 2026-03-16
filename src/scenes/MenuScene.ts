export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    this.add.text(width / 2, height / 3, 'FOTBOLLSSPEL', {
      fontSize: '48px',
      color: '#ffffff',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2, 'Tryck SPACE eller A-knapp för att starta', {
      fontSize: '20px',
      color: '#cccccc',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    // Keyboard input
    this.input.keyboard?.on('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });

    // Gamepad input
    this.input.gamepad?.on('down', (
      _pad: Phaser.Input.Gamepad.Gamepad,
      button: Phaser.Input.Gamepad.Button,
    ) => {
      if (button.index === 0) { // A-knapp
        this.scene.start('GameScene');
      }
    });
  }
}
