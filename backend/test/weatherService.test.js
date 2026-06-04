const axios = require('axios');
const { validateCoordinates, getWeatherData, getFiveDayWeatherData, getWeatherDataForDateRange, validateDateRange } = require('../services/weatherService');

jest.mock('axios');

function getDateString(offsetDays = 0) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offsetDays);

  return date.toISOString().slice(0, 10);
}

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
          time: `${getDateString()}T00:00:00Z`,
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

  describe('getFiveDayWeatherData', () => {
    test('returns parsed five day forecast when axios provides daily data', async () => {
      axios.get.mockResolvedValue({
        data: {
          latitude: 1,
          longitude: 2,
          generationtime_ms: 1.1,
          elevation: 10,
          timezone: 'UTC',
          timezone_abbreviation: 'UTC',
          utc_offset_seconds: 0,
          daily_units: { temperature_2m_max: '°C' },
          daily: {
            time: Array.from({ length: 5 }, (_, index) => getDateString(index)),
            weather_code: [0, 1, 2, 3, 45],
            temperature_2m_max: [10, 11, 12, 13, 14],
            temperature_2m_min: [1, 2, 3, 4, 5],
            apparent_temperature_max: [9, 10, 11, 12, 13],
            apparent_temperature_min: [0, 1, 2, 3, 4],
            daylight_duration: [1, 1, 1, 1, 1],
            sunset: ['s', 's', 's', 's', 's'],
            sunrise: ['r', 'r', 'r', 'r', 'r'],
            wind_speed_10m_max: [5, 5, 5, 5, 5],
            precipitation_probability_max: [0, 10, 20, 30, 40],
            sunshine_duration: [1, 1, 1, 1, 1],
            uv_index_max: [1, 1, 1, 1, 1],
            uv_index_clear_sky_max: [1, 1, 1, 1, 1],
            rain_sum: [0, 0, 0, 0, 0],
            showers_sum: [0, 0, 0, 0, 0],
            snowfall_sum: [0, 0, 0, 0, 0],
            precipitation_sum: [0, 0, 0, 0, 0],
            precipitation_hours: [0, 0, 0, 0, 0],
            wind_gusts_10m_max: [10, 10, 10, 10, 10],
            wind_direction_10m_dominant: [90, 91, 92, 93, 94],
            shortwave_radiation_sum: [1, 1, 1, 1, 1],
            et0_fao_evapotranspiration: [1, 1, 1, 1, 1]
          }
        }
      });

      const res = await getFiveDayWeatherData(1, 2);

      expect(res.daily).toHaveLength(5);
      expect(res.daily[0].temperature_2m_max).toBe(10);
    });

    test('throws when no daily present', async () => {
      axios.get.mockResolvedValue({ data: {} });

      await expect(getFiveDayWeatherData(1, 2)).rejects.toThrow('5-day forecast data not found.');
    });
  });

  describe('validateDateRange', () => {
    test('returns errors for invalid ranges', () => {
      expect(validateDateRange()).toMatch(/required/);
      expect(validateDateRange(getDateString(1), getDateString(0))).toMatch(/on or after/);
      expect(validateDateRange('01-02-2026', getDateString(1))).toMatch(/valid YYYY-MM-DD/);
    });

    test('enforces Open-Meteo window (90 days past, 15 days future)', () => {
      expect(validateDateRange(getDateString(-61), getDateString(-57))).toMatch(/too far in the past/);
      expect(validateDateRange(getDateString(16), getDateString(18))).toMatch(/too far in the future/);
    });
  });

  describe('getWeatherDataForDateRange', () => {
    test('sends start_date and end_date to the weather API', async () => {
      axios.get.mockResolvedValue({
        data: {
          latitude: 1,
          longitude: 2,
          generationtime_ms: 1.1,
          elevation: 10,
          timezone: 'UTC',
          timezone_abbreviation: 'UTC',
          utc_offset_seconds: 0,
          daily_units: { temperature_2m_max: '°C' },
          daily: {
            time: [getDateString(-1)],
            weather_code: [0],
            temperature_2m_max: [10],
            temperature_2m_min: [1],
          }
        }
      });

      const startDate = getDateString(-4);
      const endDate = getDateString(-1);

      const res = await getWeatherDataForDateRange(1, 2, startDate, endDate);

      expect(res.daily).toHaveLength(1);
      expect(axios.get).toHaveBeenCalledWith(
        'https://api.open-meteo.com/v1/forecast',
        expect.objectContaining({
          params: expect.objectContaining({
            start_date: startDate,
            end_date: endDate
          })
        })
      );
    });
  });
});
