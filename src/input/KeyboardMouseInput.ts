import { type InputState, createEmptyInputState } from './InputState';

export class KeyboardMouseInput {
  private scene: Phaser.Scene;
  private keys: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    shoot: Phaser.Input.Keyboard.Key;
    pass: Phaser.Input.Keyboard.Key;
    special: Phaser.Input.Keyboard.Key;
  };

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    const kb = scene.input.keyboard!;
    this.keys = {
      up: kb.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: kb.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: kb.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: kb.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      shoot: kb.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      pass: kb.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      special: kb.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
    };
  }

  getState(): InputState {
    const state = createEmptyInputState();

    // Rörelse via WASD
    if (this.keys.left.isDown) state.movement.x -= 1;
    if (this.keys.right.isDown) state.movement.x += 1;
    if (this.keys.up.isDown) state.movement.y -= 1;
    if (this.keys.down.isDown) state.movement.y += 1;

    // Normalisera diagonal rörelse
    const len = Math.sqrt(state.movement.x ** 2 + state.movement.y ** 2);
    if (len > 1) {
      state.movement.x /= len;
      state.movement.y /= len;
    }

    // Sikte via musposition (världskoordinater)
    const pointer = this.scene.input.activePointer;
    const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
    state.aim.x = worldPoint.x;
    state.aim.y = worldPoint.y;

    // Knappar — musklick för skjutning
    state.shoot = pointer.isDown || this.keys.shoot.isDown;
    state.pass = this.keys.pass.isDown;
    state.special = this.keys.special.isDown;

    return state;
  }

  destroy(): void {
    const kb = this.scene.input.keyboard;
    if (kb) {
      Object.values(this.keys).forEach((key) => kb.removeKey(key));
    }
  }
}
