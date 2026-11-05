# Changelog

All notable changes to this project are listed here. Versions follow the
roadmap's releases (R1 = 0.1.0 … R5 = 1.0.0).

## 0.1.0 — R1 Foundation

- Home page with a map of Indonesia and its 34 province outlines
  (geoBoundaries gbOpen IDN ADM1, from OpenStreetMap, ODbL).
- Emergency numbers 112 and 119 at the top of every page, as phone links.
- Map tiles from OpenStreetMap; the tile server can be changed with
  `VITE_TILE_URL` without a code change.
- Indonesian and English, picked from the browser and remembered.
- Sources footer crediting every data source.
- A wording policy test: no medical advice, no rankings, no promotion.
- Quality gates in CI on every pull request: typecheck, lint, formatting,
  unit tests with coverage thresholds (95/85/95/95), bundle size budget,
  Playwright end-to-end tests with axe, and a gitleaks secret scan.
- Every green push to `main` is published to GitHub Pages.
- Built from modules of the simple-geolocation 0.5.0 reference.
