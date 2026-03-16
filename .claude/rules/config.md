---
paths:
  - "src/config/**/*.ts"
---

# Config-regler

- Alla spelparametrar ska vara `as const` objects
- Använd UPPER_SNAKE_CASE för config-objekt
- Gruppa relaterade värden i namngivna objekt
- Dokumentera enheter i kommentarer (ms, px, px/s, radianer)
- Inga beräknade värden — håll allt explicit
- Exportera typer för varje config-objekt med `typeof`
