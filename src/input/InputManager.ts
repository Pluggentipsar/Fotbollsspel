import { type InputState, createEmptyInputState } from './InputState';
import { KeyboardMouseInput } from './KeyboardMouseInput';
import { GamepadInput } from './GamepadInput';

export type InputMode = 'keyboard' | 'gamepad';

export class InputManager {
  private keyboardInput: KeyboardMouseInput;
  private gamepadInput: GamepadInput;
  private currentMode: InputMode = 'keyboard';

  constructor(scene: Phaser.Scene, gamepadIndex: number = 0) {
    this.keyboardInput = new KeyboardMouseInput(scene);
    this.gamepadInput = new GamepadInput(scene, gamepadIndex);

    // Auto-detect: byt till gamepad om en knapp trycks
    scene.input.gamepad?.on('down', () => {
      this.currentMode = 'gamepad';
    });

    // Byt tillbaka till keyboard vid tangenttryck
    scene.input.keyboard?.on('keydown', () => {
      this.currentMode = 'keyboard';
    });

    // Byt tillbaka till keyboard vid musrörelse
    scene.input.on('pointermove', () => {
      this.currentMode = 'keyboard';
    });
  }

  getState(playerX: number = 0, playerY: number = 0): InputState {
    if (this.currentMode === 'gamepad' && this.gamepadInput.isConnected()) {
      return this.gamepadInput.getState(playerX, playerY);
    }
    return this.keyboardInput.getState();
  }

  getMode(): InputMode {
    return this.currentMode;
  }

  destroy(): void {
    this.keyboardInput.destroy();
  }
}
