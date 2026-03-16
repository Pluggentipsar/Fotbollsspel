---
paths:
  - "src/input/**/*.ts"
---

# Input-regler

- All input-kod MÅSTE gå genom `InputManager`
- Exponera aldrig raw keyboard/gamepad-events till game logic
- `InputState` interface ska användas överallt:
  ```typescript
  interface InputState {
    movement: { x: number; y: number }  // normaliserad -1 till 1
    aim: { x: number; y: number }        // världskoordinater eller normaliserad
    shoot: boolean
    pass: boolean
    special: boolean
  }
  ```
- Gamepad deadzone: minst 0.15 för att undvika drift
- Stöd för hot-plugging av gamepads
