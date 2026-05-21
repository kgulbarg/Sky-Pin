const axios = require('axios');
const { validateCoordinates, getWeatherData } = require('../services/weatherService');

jest.mock('axios');

describe('weatherService', () => {
  describe('validateCoordinates', () => {
    test('returns error when missing', () => {
      expect(validateCoordinates()).toMatch(/required/);
    });

    test('returns error when not numbers', () => {
      expect(validateCoordinates('a', 'b')).toMatch(/must be numbers/);
    });

    test('returns error for out-of-range values', () => {
      expect(validateCoordinates(100, 0)).toMatch(/between -90 and 90/);
      expect(validateCoordinates(0, 200)).toMatch(/between -180 and 180/);
    });

    test('returns null for valid coords', () => {
      expect(validateCoordinates(12.3, 45.6)).toBeNull();
    });
  });

  describe('getWeatherData', () => {
    test('returns parsed weather when axios provides current', async () => {
      const mockData = {
        latitude: 1,
        longitude: 2,
        generationtime_ms: 1.1,
        elevation: 10,
        timezone: 'UTC',
        timezone_abbreviation: 'UTC',
        utc_offset_seconds: 0,
        current_units: { temperature_2m: '°C' },
        current: {
          time: '2026-01-01T00:00:00Z',
          interval: 'hourly',
          temperature_2m: 20,
          apparent_temperature: 19,
          precipitation: 0,
          rain: 0,
          showers: 0,
          snowfall: 0,
          relative_humidity_2m: 50,
          weather_code: 0,
          cloud_cover: 0,
          surface_pressure: 1013,
          pressure_msl: 1013,
          wind_speed_10m: 3,
          wind_direction_10m: 90,
          wind_gusts_10m: 5,
          is_day: 1
        }
      };

      axios.get.mockResolvedValue({ data: mockData });

      const res = await getWeatherData(1, 2);

      expect(res).toHaveProperty('current');
      expect(res.current.temperature_2m).toBe(20);
      expect(res.current_units).toEqual(mockData.current_units);
    });

    test('throws when no current present', async () => {
      axios.get.mockResolvedValue({ data: {} });
      await expect(getWeatherData(1, 2)).rejects.toThrow('Weather data not found.');
    });
  });
});
