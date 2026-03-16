import { type InputState, createEmptyInputState } from './InputState';

const DEADZONE = 0.15;

export class GamepadInput {
  private scene: Phaser.Scene;
  private padIndex: number;

  constructor(scene: Phaser.Scene, padIndex: number = 0) {
    this.scene = scene;
    this.padIndex = padIndex;
  }

  private getPad(): Phaser.Input.Gamepad.Gamepad | undefined {
    return this.scene.input.gamepad?.getPad(this.padIndex);
  }

  private applyDeadzone(value: number): number {
    return Math.abs(value) < DEADZONE ? 0 : value;
  }

  getState(playerX: number, playerY: number): InputState {
    const state = createEmptyInputState();
    const pad = this.getPad();
    if (!pad) return state;

    // Vänster stick — rörelse
    state.movement.x = this.applyDeadzone(pad.leftStick.x);
    state.movement.y = this.applyDeadzone(pad.leftStick.y);

    // Normalisera om över 1
    const moveLen = Math.sqrt(state.movement.x ** 2 + state.movement.y ** 2);
    if (moveLen > 1) {
      state.movement.x /= moveLen;
      state.movement.y /= moveLen;
    }

    // Höger stick — sikte (konvertera till världskoordinater relativt spelare)
    const aimX = this.applyDeadzone(pad.rightStick.x);
    const aimY = this.applyDeadzone(pad.rightStick.y);
    const AIM_DISTANCE = 200;
    state.aim.x = playerX + aimX * AIM_DISTANCE;
    state.aim.y = playerY + aimY * AIM_DISTANCE;

    // Knappar
    // RT (höger trigger) = skjut, LT (vänster trigger) = pass
    state.shoot = pad.R2 > 0.3;
    state.pass = pad.L2 > 0.3;
    state.special = pad.A; // A-knapp = special

    return state;
  }

  isConnected(): boolean {
    return this.getPad() !== undefined;
  }
}
