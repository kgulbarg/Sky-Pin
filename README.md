<img src="frontend/skypin-frontend/public/logo.png" width="200"/>

# Sky Pin

Lightweight weather lookup and visualization app with an interactive map preview for each searched location.

## Overview

Sky Pin lets users search places (geocoding), view current weather and multi-day forecasts, save and revisit past searches, and open an interactive map centered on the selected location.

Key features:
- Search locations and view current weather
- 5-day forecast and date-range forecasting
- Past searches list with quick re-open
- "View on map" interactive preview (drag & zoom)

## External Services

1. Geocoding API: https://geocode.maps.co/search  
   (Requires API Key)

2. Weather API: https://api.open-meteo.com/v1/forecast

3. Weather Icons CDN: https://cdn.meteocons.com/

4. Interactive map: OpenStreetMap embed


## Tech Stack

- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: PostgreSQL (optional — persistence used when running with Docker)

## Quick Start

There are two main ways to run the app locally: with Docker (recommended for full stack + database) or running backend/frontend separately for fast frontend development.

### Option A — Full stack (Docker)

```bash
git clone <repo-url>
cd SkyPin
docker compose up --build
```

This brings up the backend, frontend, and a PostgreSQL instance (if configured in the compose file).

Application URLs:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Option B — Run services individually

Backend (API):

```bash
cd backend
npm install
node server.js
```

Frontend (Dev):

```bash
cd frontend/skypin-frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to open the frontend.

## Environment / Configuration

The project reads configuration from environment variables. Common variables:

- `PORT` — backend listen port (default: 5000)
- `DATABASE_URL` — PostgreSQL connection string (when running with persistence)
- `GEOCODE_API_KEY` — optional key for a geocoding provider (if required)

When using Docker compose, environment variables can be provided via a `.env` file or set in your local environment.

## Testing

Frontend tests use Vitest + Testing Library. Run tests from the frontend folder:

```bash
cd frontend/skypin-frontend
npm install
npm test
```

## Build

To create a production build of the frontend:

```bash
cd frontend/skypin-frontend
npm run build
```

## Troubleshooting

- If `docker compose up` fails, check that ports `5173` and `5000` are free or adjust the compose file.
- If the frontend can't reach the backend during dev, ensure `server.js` is running and the API base URL in the frontend matches `http://localhost:5000`.
- To test backend APIs, see `docs/api.md`.
