export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Bakgrund så menyn syns tydligt
    this.cameras.main.setBackgroundColor('#1a1a2e');

    this.add.text(width / 2, height / 3, 'FOTBOLLSSPEL', {
      fontSize: '48px',
      color: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2, 'Tryck SPACE eller A-knapp för att starta', {
      fontSize: '20px',
      color: '#cccccc',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    // Enkel pulsande effekt på texten
    this.tweens.add({
      targets: this.children.list[1],
      alpha: { from: 1, to: 0.3 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });

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
