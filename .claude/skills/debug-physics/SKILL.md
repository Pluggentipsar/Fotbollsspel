---
name: debug-physics
description: Debugga physics-problem i spelet. Använd vid kollisions- eller rörelsebuggar.
allowed-tools: Read, Edit, Grep, Glob, Bash
argument-hint: "[problem-description]"
---

# Debug Physics

Analysera och fixa physics-relaterade buggar i spelet.

## Steg

1. **Identifiera problemet**: Läs problembeskrivningen i `$ARGUMENTS`
2. **Sök i physics-kod**: Granska filer i `src/systems/` och `src/entities/`
3. **Kolla collision groups**: Verifiera att rätt grupper kolliderar i Phaser config
4. **Kolla physics bodies**: Verifiera storlek, offset och typ (circle vs rectangle)
5. **Granska update-loop**: Kolla att delta time används korrekt
6. **Testa fix**: Föreslå eller implementera fix

## Vanliga problem

- **Tunneling**: Projektiler passerar genom objekt → öka physics steps eller använd CCD
- **Sticky collisions**: Objekt fastnar i varandra → kolla overlap vs collide
- **Inkonsekvent bollphysik**: → kolla bounce, friction, drag-värden i config
- **Gamepad drift**: → kolla deadzone-värden i input-systemet

## Phaser Physics Tips

- `arcade.world.setBounds()` för att begränsa spelområdet
- `body.setCircle()` för boll och projektiler
- `body.setBounce()` för studsning
- Collision callbacks: `this.physics.add.collider(a, b, callback)`
