---
name: add-entity
description: Skapa en ny spelenhet (entity) med rätt struktur, typning och registrering.
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Glob, Grep
argument-hint: "<entity-name> [entity-type]"
---

# Skapa ny entity

Skapa en ny spelenhet i projektet. Följ dessa steg:

1. **Skapa entity-klass** i `src/entities/$ARGUMENTS[0].ts`:
   - Ärver från basklassen i `src/entities/`
   - Implementera `update(delta: number)` metod
   - Lägg till relevanta komponenter baserat på entity-typ
   - Typdeklarera alla properties

2. **Lägg till i barrel export**: Uppdatera `src/entities/index.ts`

3. **Skapa config**: Lägg till standardvärden i `src/config/entities.ts`:
   - Hastighet, health, storlek
   - Eventuella entity-specifika parametrar

4. **Registrera i scene**: Uppdatera `GameScene` för att kunna spawna entiteten

5. **Collision setup**: Lägg till rätt collision group och handlers

Entity-typer att stödja:
- `player` — Styrbar karaktär med input och shooting
- `enemy` — AI-styrd motståndare
- `projectile` — Projektil från vapen
- `pickup` — Power-up eller item på planen
- `ball` — Fotbollen

Om entity-typ ($ARGUMENTS[1]) anges, anpassa mallen efter den typen.
