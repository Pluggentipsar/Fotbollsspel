export interface InputState {
  /** Normaliserad rörelsevektor (-1 till 1) */
  movement: { x: number; y: number };
  /** Siktpunkt i världskoordinater */
  aim: { x: number; y: number };
  /** Skjut-knapp nedtryckt */
  shoot: boolean;
  /** Pass/skott-knapp nedtryckt */
  pass: boolean;
  /** Special-knapp nedtryckt */
  special: boolean;
}

export function createEmptyInputState(): InputState {
  return {
    movement: { x: 0, y: 0 },
    aim: { x: 0, y: 0 },
    shoot: false,
    pass: false,
    special: false,
  };
}
