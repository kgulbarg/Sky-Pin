jest.mock('../services/geocoordService');
jest.mock('../services/weatherService');

const geo = require('../services/geocoordService');
const weather = require('../services/weatherService');
const { getForecast } = require('../services/forecastService');

describe('forecastService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('throws when address input invalid', async () => {
    geo.validateLocationInput.mockReturnValue(false);

      await expect(getForecast({})).rejects.toThrow(
        /Country is required with postal code or city and state or county/
      );
  });

  test('throws when coordinates are not finite numbers', async () => {
    geo.validateLocationInput.mockReturnValue(true);
    geo.getCoordinates.mockResolvedValue({ latitude: 'abc', longitude: 'def', display_name: 'X' });

    await expect(getForecast({ city: 'X' })).rejects.toThrow(/must be finite numbers/);
  });

  test('throws when validateCoordinates returns error', async () => {
    geo.validateLocationInput.mockReturnValue(true);
    geo.getCoordinates.mockResolvedValue({ latitude: '12.34', longitude: '56.78', display_name: 'X' });
    weather.validateCoordinates.mockReturnValue('bad coords');

    await expect(getForecast({ city: 'X' })).rejects.toThrow(/bad coords/);
  });

  test('returns forecast on success', async () => {
    geo.validateLocationInput.mockReturnValue(true);
    geo.getCoordinates.mockResolvedValue({ latitude: '12.34', longitude: '56.78', display_name: 'X' });
    weather.validateCoordinates.mockReturnValue(null);
    weather.getWeatherData.mockResolvedValue({ current: { temperature_2m: 10 } });

    const res = await getForecast({ country: 'France', postalcode: '75001' });

    expect(res).toHaveProperty('location');
    expect(res.location.latitude).toBeCloseTo(12.34);
    expect(res).toHaveProperty('weather');
    expect(res.weather.current.temperature_2m).toBe(10);
  });
});
