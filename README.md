# Simple Geohealth

Health facilities in Indonesia on a map, from open data. No account, no
backend, no tracking. Live at https://codewithriyan.github.io/simple-geohealth/.

**This site is not an emergency service.** In an emergency call **112**, or
**119** for an ambulance; both numbers are at the top of every page. The data
can be incomplete or out of date, and the site gives no medical advice.

## What it does today (0.1.0)

A map of Indonesia with its province outlines and the emergency numbers, in
Indonesian or English. This release is the foundation; the features below
arrive one per release.

| Version | Adds                                                                                                                           |
| ------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 0.2.0   | `/facilities/`: hospitals, community health centres, clinics, pharmacies and doctors' practices around a place (OpenStreetMap) |
| 0.3.0   | `/nearest/`: the nearest facility per type, emergency departments, call and route buttons, CSV export                          |
| 0.4.0   | `/coverage/`: facilities per 10,000 people by regency, and areas more than 5 km from a facility (OSM, WorldPop)                |
| 1.0.0   | `/risk/`: facilities near recent earthquakes (BMKG), floods (PetaBencana) and haze (air quality, NASA FIRMS)                   |

## Data sources

| Source                                                                                      | Used for                               | Licence or terms                                                                                    |
| ------------------------------------------------------------------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [OpenStreetMap](https://www.openstreetmap.org/copyright)                                    | Map tiles                              | ODbL; tiles under the [OSM tile usage policy](https://operations.osmfoundation.org/policies/tiles/) |
| [geoBoundaries gbOpen IDN ADM1](https://www.geoboundaries.org/api/current/gbOpen/IDN/ADM1/) | Province outlines (34 provinces, 2017) | ODbL 1.0 (built from OpenStreetMap)                                                                 |

The province file is built by `pnpm boundaries:build` from a pinned
geoBoundaries release and committed as `public/data/provinces.geojson`.

## Getting started

Needs Node 22 (see `.nvmrc`) and pnpm.

```bash
pnpm install
pnpm dev          # http://localhost:3000/simple-geohealth/
```

| Command                       | What it does                                       |
| ----------------------------- | -------------------------------------------------- |
| `pnpm test --coverage`        | Unit tests; fails below 95/85/95/95 coverage       |
| `pnpm e2e`                    | Builds, serves the build, runs Playwright with axe |
| `pnpm size`                   | Builds and checks the bundle size budget           |
| `pnpm typecheck`, `pnpm lint` | TypeScript and ESLint                              |
| `pnpm boundaries:build`       | Rebuilds the province outlines                     |

Copy `.env.example` to `.env` to point the map at another tile server
(`VITE_TILE_URL`). No key is needed for anything.

## Deploy

`.github/workflows/ci.yml` runs every gate on each pull request and push.
A push to `main` that passes them all is published to GitHub Pages. In the
repository settings, set Pages → Source to "GitHub Actions".

## Built on

Modules and quality setup are taken from the simple-geolocation 0.5.0
reference: language handling, page header, navigation, language picker,
credits, map setup, the MapLibre test mock, the wording policy test, and
the coverage, bundle-size and accessibility gates.

## Licence

Code: MIT (see `LICENSE`). Data keeps its own licence (see above).
