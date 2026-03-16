import { GAME_CONFIG } from '@/config/game';

export class HUD {
  private scene: Phaser.Scene;
  private scoreText: Phaser.GameObjects.Text;
  private timerText: Phaser.GameObjects.Text;
  private healthBar: Phaser.GameObjects.Graphics;
  private weaponText: Phaser.GameObjects.Text;
  private inputModeText: Phaser.GameObjects.Text;

  private homeScore: number = 0;
  private awayScore: number = 0;
  private matchTime: number = GAME_CONFIG.MATCH_DURATION;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    // Score — centrerat upptill
    this.scoreText = scene.add.text(640, 10, '0 - 0', {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5, 0).setDepth(100);

    // Timer — under score
    this.timerText = scene.add.text(640, 45, this.formatTime(this.matchTime), {
      fontSize: '18px',
      color: '#cccccc',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5, 0).setDepth(100);

    // Health bar — nere till vänster
    this.healthBar = scene.add.graphics().setDepth(100);

    // Weapon — nere till höger
    this.weaponText = scene.add.text(1200, 690, 'Pistol', {
      fontSize: '16px',
      color: '#ffff00',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5, 1).setDepth(100);

    // Input mode — nere till vänster, under health
    this.inputModeText = scene.add.text(80, 710, 'KB+MUS', {
      fontSize: '12px',
      color: '#888888',
      fontFamily: 'Arial',
    }).setOrigin(0.5, 1).setDepth(100);
  }

  updateScore(home: number, away: number): void {
    this.homeScore = home;
    this.awayScore = away;
    this.scoreText.setText(`${home} - ${away}`);
  }

  updateTimer(timeLeft: number): void {
    this.matchTime = timeLeft;
    this.timerText.setText(this.formatTime(timeLeft));

    // Röd text sista 30 sekunderna
    if (timeLeft <= 30) {
      this.timerText.setColor('#ff4444');
    }
  }

  updateHealth(current: number, max: number): void {
    this.healthBar.clear();

    const barX = 20;
    const barY = 680;
    const barWidth = 120;
    const barHeight = 16;
    const ratio = current / max;

    // Bakgrund
    this.healthBar.fillStyle(0x333333);
    this.healthBar.fillRect(barX, barY, barWidth, barHeight);

    // Hälsa — grön till röd
    const color = ratio > 0.5 ? 0x00ff00 : ratio > 0.25 ? 0xffaa00 : 0xff0000;
    this.healthBar.fillStyle(color);
    this.healthBar.fillRect(barX, barY, barWidth * ratio, barHeight);

    // Ram
    this.healthBar.lineStyle(1, 0xffffff, 0.5);
    this.healthBar.strokeRect(barX, barY, barWidth, barHeight);
  }

  updateWeapon(weaponName: string): void {
    this.weaponText.setText(weaponName);
  }

  updateInputMode(mode: string): void {
    this.inputModeText.setText(mode === 'keyboard' ? 'KB+MUS' : 'GAMEPAD');
  }

  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  goalScored(team: 'home' | 'away'): void {
    if (team === 'home') this.homeScore++;
    else this.awayScore++;
    this.updateScore(this.homeScore, this.awayScore);

    // Visuell feedback — stor text
    const goalText = this.scene.add.text(640, 360, 'MÅL!', {
      fontSize: '72px',
      color: '#ffff00',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5).setDepth(200);

    this.scene.tweens.add({
      targets: goalText,
      alpha: 0,
      scale: 2,
      duration: 1500,
      ease: 'Power2',
      onComplete: () => goalText.destroy(),
    });
  }

  destroy(): void {
    this.scoreText.destroy();
    this.timerText.destroy();
    this.healthBar.destroy();
    this.weaponText.destroy();
    this.inputModeText.destroy();
  }
}
