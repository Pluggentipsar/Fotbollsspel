---
paths:
  - "src/weapons/**/*.ts"
---

# Vapen-regler

- Alla vapen implementerar `IWeapon` interface
- Projektiler ska använda object pooling via Phaser Groups
- Cooldown-hantering med timestamps, inte timers
- Varje vapen har en unik visuell och audio-feedback
- Knockback och stun-värden ska vara separata från damage
- Spridning (spread) anges i radianer
