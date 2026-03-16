interface GameOverData {
  homeScore: number;
  awayScore: number;
}

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(data: GameOverData): void {
    const { width, height } = this.cameras.main;
    const { homeScore, awayScore } = data;

    // Bakgrund
    this.cameras.main.setBackgroundColor('#1a1a2e');

    // Titel
    this.add.text(width / 2, height * 0.2, 'MATCH SLUT', {
      fontSize: '48px',
      color: '#ffffff',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    // Resultat
    const resultColor = homeScore > awayScore ? '#44ff44' : homeScore < awayScore ? '#ff4444' : '#ffff00';
    const resultText = homeScore > awayScore ? 'VINST!' : homeScore < awayScore ? 'FÖRLUST' : 'OAVGJORT';

    this.add.text(width / 2, height * 0.35, resultText, {
      fontSize: '36px',
      color: resultColor,
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    // Score
    this.add.text(width / 2, height * 0.5, `${homeScore} - ${awayScore}`, {
      fontSize: '64px',
      color: '#ffffff',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    // Lag-etiketter
    this.add.text(width / 2 - 80, height * 0.5, 'HEM', {
      fontSize: '16px',
      color: '#3366ff',
      fontFamily: 'Arial',
    }).setOrigin(1, 0.5);

    this.add.text(width / 2 + 80, height * 0.5, 'BORTA', {
      fontSize: '16px',
      color: '#ff3333',
      fontFamily: 'Arial',
    }).setOrigin(0, 0.5);

    // Spela igen
    this.add.text(width / 2, height * 0.75, 'Tryck SPACE eller A-knapp för att spela igen', {
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
