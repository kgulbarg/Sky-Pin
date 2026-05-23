<img src="frontend/skypin-frontend/public/logo.png" width="200"/>

# Sky Pin

## Design

### External Services

1. Geocoding API: https://geocode.maps.co/search  
   (Requires API Key)

2. Weather API: https://api.open-meteo.com/v1/forecast

3. Weather Icons CDN: https://cdn.meteocons.com/

### Tech Stack

1. Frontend - React JS
2. Backend - Node.js (Express)
3. Database - PostgreSQL


### Running Locally
#### To Run (Tech Assessment 1 & 2)

cd \Sky-Pin> docker compose up --build

#### To Run (Ony Tech Assessment 1 - No persistence)
cd \Sky-Pin\backend> node server.js

cd \Sky-Pin\frontend\skypin-frontend> npm run dev
