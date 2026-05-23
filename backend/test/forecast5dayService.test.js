jest.mock('../services/geocoordService');
jest.mock('../services/weatherService');

const geo = require('../services/geocoordService');
const weather = require('../services/weatherService');
const { getForecast5Day } = require('../services/forecast5dayService');

describe('forecast5dayService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('throws when address input invalid', async () => {
    geo.validateLocationInput.mockReturnValue(false);

    await expect(getForecast5Day({})).rejects.toThrow(/Country is required with postal code or city and state or county/);
  });

  test('throws when coordinates are not finite numbers', async () => {
    geo.validateLocationInput.mockReturnValue(true);
    geo.getCoordinates.mockResolvedValue({ latitude: 'abc', longitude: 'def', display_name: 'X' });

    await expect(getForecast5Day({ city: 'X', state: 'Y', country: 'Z' })).rejects.toThrow(/must be finite numbers/);
  });

  test('throws when validateCoordinates returns error', async () => {
    geo.validateLocationInput.mockReturnValue(true);
    geo.getCoordinates.mockResolvedValue({ latitude: '12.34', longitude: '56.78', display_name: 'X' });
    weather.validateCoordinates.mockReturnValue('bad coords');

    await expect(getForecast5Day({ city: 'X', state: 'Y', country: 'Z' })).rejects.toThrow(/bad coords/);
  });

  test('returns forecast on success', async () => {
    geo.validateLocationInput.mockReturnValue(true);
    geo.getCoordinates.mockResolvedValue({ latitude: '12.34', longitude: '56.78', display_name: 'X' });
    weather.validateCoordinates.mockReturnValue(null);
    weather.getFiveDayWeatherData.mockResolvedValue({ daily: [{ date: '2026-01-01' }] });

    const res = await getForecast5Day({ city: 'X', state: 'Y', country: 'Z' });

    expect(res).toHaveProperty('location');
    expect(res.location.latitude).toBeCloseTo(12.34);
    expect(res).toHaveProperty('forecast');
    expect(weather.getFiveDayWeatherData).toHaveBeenCalledWith(12.34, 56.78);
  });

  test('accepts numeric coordinate payload (numbers) and returns 5-day forecast', async () => {
    weather.validateCoordinates.mockReturnValue(null);
    weather.getFiveDayWeatherData.mockResolvedValue({ daily: [{ date: '2026-01-01' }] });

    const res = await getForecast5Day({ latitude: 12.34, longitude: 56.78 });

    expect(res).toHaveProperty('location');
    expect(res.location.display_name).toMatch(/Your current location/);
    expect(res.location.latitude).toBeCloseTo(12.34);
    expect(res).toHaveProperty('forecast');
    expect(weather.getFiveDayWeatherData).toHaveBeenCalledWith(12.34, 56.78);
  });

  test('accepts numeric-string coordinate payload and coerces to numbers for 5-day', async () => {
    weather.validateCoordinates.mockReturnValue(null);
    weather.getFiveDayWeatherData.mockResolvedValue({ daily: [{ date: '2026-01-02' }] });

    const res = await getForecast5Day({ latitude: '12.34', longitude: '56.78' });

    expect(res.location.latitude).toBeCloseTo(12.34);
    expect(res.forecast.daily[0].date).toBe('2026-01-02');
  });
});