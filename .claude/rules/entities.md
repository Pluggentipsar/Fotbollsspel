---
paths:
  - "src/entities/**/*.ts"
---

# Entity-regler

- Alla entities ska ha en `destroy()` metod som rensar upp Phaser-objekt
- Använd `this.scene.events` för kommunikation, inte direkta referanser
- Entities ska inte känna till specifika scene-implementationer
- Health-hantering via en gemensam `Damageable` interface
- Alla sprites ska använda texture atlases, inte enskilda bilder
- Position och velocity ska alltid gå via Phaser physics body
