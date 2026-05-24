### Forecast API - For current weather

- Endpoint: `POST http://localhost:5000/api/forecast`
- Request bodies can include either address fields or coordinates.
- The API returns the current weather for the resolved location.

Examples returning 200 with weather data in response body:
{
"latitude": 12.34,
"longitude": 56.78
}

{
"city": "Norristown",
"state": "PA",
"country": "United States"
}

{
"country": "United States",
"postalcode":"19403"
}

### ForecastDays API - For weather forecast (day-wise)

- Endpoint: `POST http://localhost:5000/api/forecastDays`
- Request bodies can include either address fields or coordinates.
- If `startDate` and `endDate` are omitted, the API returns the next 5 days and includes a `dateRange` for today through 4 days ahead.
- Custom ranges must stay within Open-Meteo's window: 90 days in the past and 15 days in the future.

Examples returning 200 with weather data in response body:
{
"latitude": 12.34,
"longitude": 56.78,
"startDate": "2026-03-25",
"endDate": "2026-05-27"
}

{
"latitude": 12.34,
"longitude": 56.78
}

{
"city": "Norristown",
"state": "PA",
"country": "United States",
"startDate": "2026-05-20",
"endDate": "2026-05-23"
}

{
"city": "Norristown",
"state": "PA",
"country": "United States",
}
