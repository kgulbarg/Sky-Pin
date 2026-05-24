<img src="frontend/skypin-frontend/public/logo.png" width="200"/>

# Sky Pin

## Design

### External Services

1. Geocoding API: https://geocode.maps.co/search  
   (Requires API Key)

2. Weather API: https://api.open-meteo.com/v1/forecast

3. Weather Icons CDN: https://cdn.meteocons.com/


## Tech Stack

1. Frontend — React.js
2. Backend — Node.js (Express)
3. Database — PostgreSQL


## Running Locally

### Run Full Application (Tech Assessments 1 & 2)

```bash
cd Sky-Pin
docker compose up --build
```

### Run Without Persistence (Only Tech Assessment 1)

#### Backend

```bash
cd Sky-Pin/backend
node server.js
```

#### Frontend

```bash
cd Sky-Pin/frontend/skypin-frontend
npm run dev
```

Application URLs:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
