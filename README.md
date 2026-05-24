<img src="frontend/skypin-frontend/public/logo.png" width="200"/>

# Sky Pin

Lightweight weather lookup and visualization app with an interactive map preview for each searched location.

## Overview

Sky Pin lets users search places (geocoding), view current weather and multi-day forecasts, save and revisit past searches, and open an interactive map centered on the selected location.

Key features:
- View current weather at searched location
- 5-day forecast and date-range forecasting
- Past searches list with update and delete actions
- Interactive map for location (drag & zoom)

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

### Prerequisites

1. Docker Destop must be installed
2. Git must be installed

### Steps

1. Launch Docker Desktop
2. Clone the repository
```bash
git clone <repo-url>
```
3. Navigate into the project folder.
```bash
cd SkyPin
```
4. Create a local environment configuration file from the example template.
```bash
cp .env.example .env
```
5. In the `.env` file, add your Geocoding API Key.
6. Build and start all application containers.
```bash
docker compose up --build
```

### Application Components:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Database: Inside Docker network as postgres:5432 - Can be accessed through Docker Desktop: Containers -> weather-postgres -> Exec

## Running Unit Tests
1. Frontend

```bash
cd frontend\skipin-frontend
npm test
```

2. Backend
```bash
cd backend
npm test
```

## Troubleshooting

- If `docker compose up` fails, check that ports `5173` and `5000` are free or adjust the compose file.
- If the frontend can't reach the backend during dev, ensure `server.js` is running and the API base URL in the frontend matches `http://localhost:5000`.
- To test backend APIs, see `docs/api.md`.
