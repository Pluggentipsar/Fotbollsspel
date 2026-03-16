---
name: add-weapon
description: Skapa en ny vapentyp med projektil, stats och visuell effekt.
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Glob, Grep
argument-hint: "<weapon-name>"
---

# Skapa nytt vapen

Skapa en ny vapentyp i `src/weapons/`. Följ mönstret:

1. **Skapa vapenklass** i `src/weapons/$ARGUMENTS.ts`:
   - Implementera `IWeapon` interface
   - Definiera `fire(owner, direction)` metod
   - Hantera cooldown/fire rate
   - Skapa projektil-typ eller effekt

2. **Lägg till config** i `src/config/weapons.ts`:
   ```typescript
   export const WEAPON_NAME = {
     damage: number,
     fireRate: number,      // skott per sekund
     projectileSpeed: number,
     projectileSize: number,
     cooldown: number,       // ms
     ammo: number | Infinity,
     spread: number,         // vinkelspridning i radianer
     knockback: number,      // kraft på träffat objekt
     stunDuration: number,   // ms stun vid träff
   }
   ```

3. **Uppdatera barrel export**: `src/weapons/index.ts`

4. **Registrera**: Lägg till i weapon registry så spelare kan byta till det

5. **Balansering**: Alla vapen ska ha trade-offs (hög skada = lång cooldown, etc.)

## Vapentyper att inspireras av
- Pistol (standard, snabb, låg skada)
- Shotgun (spridning, kort räckvidd, hög skada)
- Sniper (långsam, lång räckvidd, hög skada)
- Rocket (AoE, knockback, långsam projektil)
- Freeze gun (stun, ingen skada)
