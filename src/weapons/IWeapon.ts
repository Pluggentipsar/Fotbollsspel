import type { Player } from '@/entities/Player';

export interface IWeapon {
  readonly name: string;
  readonly fireRate: number;

  /** Skjut vapnet i angiven riktning (radianer) */
  fire(owner: Player, angle: number): void;

  /** Returnerar true om vapnet kan skjutas (cooldown redo) */
  canFire(): boolean;

  /** Uppdatera cooldown etc. */
  update(delta: number): void;
}
