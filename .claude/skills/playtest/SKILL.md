---
name: playtest
description: Starta dev-servern och öppna spelet för testning. Använd efter kodändringar för att verifiera gameplay.
disable-model-invocation: true
allowed-tools: Bash, Read
argument-hint: "[focus-area]"
---

# Playtest

Kör igenom följande steg för att starta och verifiera spelet:

1. **Typecheck**: Kör `npm run typecheck` och fixa eventuella TypeScript-fel
2. **Lint**: Kör `npm run lint` och fixa eventuella lint-fel
3. **Starta dev-server**: Kör `npm run dev`
4. **Rapportera**: Sammanfatta status — vad fungerar, eventuella varningar

Om ett fokusområde anges via `$ARGUMENTS`, ge specifik feedback om den delen:
- "input" — verifiera att keyboard och gamepad-mappning är korrekt
- "physics" — kolla att kollisioner och bollphysik beter sig rätt
- "shooting" — verifiera vapensystem och projektiler
- "ui" — kolla HUD och menyer
