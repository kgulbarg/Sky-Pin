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

### Past Searches API - Manage and view saved searches

- Endpoint: `GET http://localhost:5000/api/weather/searches`
	- Returns a JSON object with a `searches` array. If there are no saved searches the array will be empty (`{ "searches": [] }`).

	Example successful response (200):
	{
		"searches": [
			{
				"id": 123,
				"search_time": "2026-05-24T08:12:34Z",
				"city": "Norristown",
				"state": "PA",
				"country": "United States",
				"latitude": 40.123,
				"longitude": -75.345,
				"start_date": "2026-05-24",
				"end_date": "2026-05-24",
				"user_notes": null,
				"updated_at": "2026-05-24T08:12:34Z"
			}
		]
	}

- Endpoint: `PATCH http://localhost:5000/api/weather/searches/:searchId/notes`
	- Body: `{ "userNotes": "Your notes here" }` (use `null` to clear).
	- Returns the updated search record on success (200).

	Example request body:
	{
		"userNotes": "Checked conditions while traveling"
	}

	Example successful response (200):
	{
		"search": {
			"id": 123,
			"user_notes": "Checked conditions while traveling",
			"updated_at": "2026-05-24T09:00:00Z"
		}
	}

- Endpoint: `DELETE http://localhost:5000/api/weather/searches/:searchId`
	- Deletes a past search from `weather_searches` and all weather rows referenced by that search in `weather_daily`.
	- Returns `{ "deletedSearchId": <id> }` on success (200).

	Example successful response (200):
	{
		"deletedSearchId": 123
	}

Notes:
- All past-searches endpoints are rooted at `/api/weather` in the server.
- Standard HTTP status codes are used: `200` for success, `400` for bad requests (e.g. invalid id), `404` for not found, and `500` for server errors.

### Export API - Download weather data (CSV)

- Endpoint: `GET http://localhost:5000/api/weather/export`
	- Returns a CSV file attachment named `weather-data.csv`.
	- Response headers:
		- `Content-Type: text/csv; charset=utf-8`
		- `Content-Disposition: attachment; filename="weather-data.csv"`
	- CSV columns (in order):
		`search_id`, `search_time`, `updated_at`, `city`, `state`, `cunty`, `country`, `pincode`, `latitude`, `longitude`, `start_date`, `end_date`, `user_notes`, `daily_id`, `daily_date`, `temp`, `temp_2m`, `rain`, `wind`, `weather_code`.
	- Notes:
		- The CSV is generated from saved searches in `weather_searches` joined to their daily rows in `weather_daily`. There will be one output row for each joined row.
		- The number of rows in the CSV is same as the number of records in `weather_daily` table.

	Example (download via curl):

	```bash
	curl -fSL -o weather-data.csv "http://localhost:5000/api/weather/export"
	```
