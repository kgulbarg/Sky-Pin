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

    await expect(getForecast5Day({})).rejects.toThrow(/Provide at least one valid location field/);
  });

  test('throws when coordinates are not finite numbers', async () => {
    geo.validateLocationInput.mockReturnValue(true);
    geo.getCoordinates.mockResolvedValue({ latitude: 'abc', longitude: 'def', display_name: 'X' });

    await expect(getForecast5Day({ city: 'X' })).rejects.toThrow(/must be finite numbers/);
  });

  test('throws when validateCoordinates returns error', async () => {
    geo.validateLocationInput.mockReturnValue(true);
    geo.getCoordinates.mockResolvedValue({ latitude: '12.34', longitude: '56.78', display_name: 'X' });
    weather.validateCoordinates.mockReturnValue('bad coords');

    await expect(getForecast5Day({ city: 'X' })).rejects.toThrow(/bad coords/);
  });

  test('returns forecast on success', async () => {
    geo.validateLocationInput.mockReturnValue(true);
    geo.getCoordinates.mockResolvedValue({ latitude: '12.34', longitude: '56.78', display_name: 'X' });
    weather.validateCoordinates.mockReturnValue(null);
    weather.getFiveDayWeatherData.mockResolvedValue({ daily: [{ date: '2026-01-01' }] });

    const res = await getForecast5Day({ city: 'X' });

    expect(res).toHaveProperty('location');
    expect(res.location.latitude).toBeCloseTo(12.34);
    expect(res).toHaveProperty('forecast');
    expect(weather.getFiveDayWeatherData).toHaveBeenCalledWith(12.34, 56.78);
  });
});