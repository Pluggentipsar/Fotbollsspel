# Fotbollsspel - 2D Top-Down Football Shooter

## Projekt

Ett 2D top-down fotbollsspel med shooter-mekanik. Spelare styrs med gamepad eller mus+tangentbord. Byggt med **Phaser 3**, **TypeScript** och **Vite**.

## Tech Stack

- **Engine**: Phaser 3 (latest)
- **Språk**: TypeScript (strict mode)
- **Build**: Vite
- **Pakethanterare**: npm

## Kommandon

- `npm run dev` — Starta dev-server med HMR
- `npm run build` — Production build
- `npm run preview` — Förhandsgranska production build
- `npm run lint` — Kör ESLint
- `npm run typecheck` — Kör TypeScript-kompilering utan output

## Projektstruktur

```
src/
├── main.ts              # Entry point, Phaser config
├── scenes/              # Phaser scenes (Boot, Menu, Game, GameOver)
├── entities/            # Spelobjekt (Player, Ball, Enemy, Projectile)
├── systems/             # ECS-liknande system (Physics, Input, Shooting, AI)
├── weapons/             # Vapentyper och projektiler
├── input/               # Input-hantering (Keyboard, Mouse, Gamepad)
├── ui/                  # HUD, menyer, score
├── config/              # Spelkonstanter, balansering
├── utils/               # Hjälpfunktioner
└── assets/              # Typdeklarationer för assets
public/
├── assets/
│   ├── sprites/         # Spelarsprites, boll, fiender
│   ├── audio/           # Ljudeffekter, musik
│   ├── maps/            # Tilemaps (JSON)
│   └── ui/              # UI-grafik
```

## Arkitektur

### Scenes
- **BootScene**: Laddar assets, visar laddningsskärm
- **MenuScene**: Huvudmeny, inställningar, kontrollval
- **GameScene**: Huvudscenen med match-logik
- **GameOverScene**: Resultat, replay

### Entity-mönster
Varje spelobjekt ärver från en bas-entity med:
- Position, velocity, health
- Phaser.GameObjects.Sprite som visuell representation
- `update(delta)` metod
- Komponentbaserat: kan ha `ShootingComponent`, `InputComponent`, etc.

### Input-system
Dual-input stöd genom `InputManager`:
- **Keyboard+Mouse**: WASD rörelse, mus för sikte/skjutning
- **Gamepad**: Vänster stick rörelse, höger stick sikte, triggers för skjutning
- Abstraherat via `InputState` interface så game logic inte bryr sig om input-typ

### Physics
- Phaser Arcade Physics för enkel kollision
- Anpassad bollphysik för realistisk bolkontroll
- Collision groups: Players, Ball, Projectiles, Walls

## Kodkonventioner

- **Namngivning**: camelCase för variabler/funktioner, PascalCase för klasser/interfaces/typer
- **Filer**: En klass per fil, filnamn matchar klassnamn (PascalCase.ts)
- **Imports**: Använd barrel exports (index.ts) per mapp
- **Konstanter**: UPPER_SNAKE_CASE, samlade i `src/config/`
- **Inga magic numbers**: Alla spelparametrar i config-filer
- **Kommentarer**: Skriv på svenska i kommentarer, engelska i kod (variabelnamn etc.)

## Spelmekanik

- Fotbollsplan som arena
- 2 lag, AI eller multiplayer
- Spelare kan skjuta projektiler för att störa motståndare (stun, knockback)
- Bollkontroll: nära bollen = automatisk dribbling, pass/skott-mekanik
- Power-ups spawnar på planen
- Mål = poäng, eliminering av spelare = tillfällig fördel

## Viktigt

- Alla spelvärden (hastighet, skada, cooldowns) ska vara konfigurerbara i `src/config/`
- Testa alltid med både keyboard och gamepad i åtanke
- Phaser lifecycle: `preload()`, `create()`, `update(time, delta)`
- Använd Phaser events för kommunikation mellan system, inte direkta anrop
- Undvik `any` — typdeklarera allt
