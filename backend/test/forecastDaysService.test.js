jest.mock('../services/geocoordService');
jest.mock('../services/weatherService');

const geo = require('../services/geocoordService');
const weather = require('../services/weatherService');
const { getForecastDays } = require('../services/forecastDaysService');
const { getTodayDateString } = require('../services/weatherPersistenceService');

function getDateString(offsetDays = 0) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offsetDays);

  return date.toISOString().slice(0, 10);
}

function getDefaultFiveDayDateRange() {
  const startDate = getTodayDateString();
  const endDate = getTodayDateString(new Date(Date.now() + 4 * 24 * 60 * 60 * 1000));

  return {
    startDate,
    endDate
  };
}

describe('forecastDaysService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('throws when address input invalid', async () => {
    geo.validateLocationInput.mockReturnValue(false);

    await expect(getForecastDays({})).rejects.toThrow(/Country is required with postal code or city and state or county/);
  });

  test('throws when coordinates are not finite numbers', async () => {
    geo.validateLocationInput.mockReturnValue(true);
    geo.getCoordinates.mockResolvedValue({ latitude: 'abc', longitude: 'def', display_name: 'X' });

    await expect(getForecastDays({ city: 'X', state: 'Y', country: 'Z' })).rejects.toThrow(/must be finite numbers/);
  });

  test('throws when validateCoordinates returns error', async () => {
    geo.validateLocationInput.mockReturnValue(true);
    geo.getCoordinates.mockResolvedValue({ latitude: '12.34', longitude: '56.78', display_name: 'X' });
    weather.validateCoordinates.mockReturnValue('bad coords');

    await expect(getForecastDays({ city: 'X', state: 'Y', country: 'Z' })).rejects.toThrow(/bad coords/);
  });

  test('returns forecast on success', async () => {
    geo.validateLocationInput.mockReturnValue(true);
    geo.getCoordinates.mockResolvedValue({ latitude: '12.34', longitude: '56.78', display_name: 'X' });
    weather.validateCoordinates.mockReturnValue(null);
    weather.getFiveDayWeatherData.mockResolvedValue({ daily: [{ date: getDateString() }] });

    const res = await getForecastDays({ city: 'X', state: 'Y', country: 'Z' });

    expect(res).toHaveProperty('location');
    expect(res.location.latitude).toBeCloseTo(12.34);
    expect(res).toHaveProperty('forecast');
    expect(weather.getFiveDayWeatherData).toHaveBeenCalledWith(12.34, 56.78);
    expect(res.dateRange).toEqual(getDefaultFiveDayDateRange());
  });

  test('accepts numeric coordinate payload (numbers) and returns 5-day forecast', async () => {
    weather.validateCoordinates.mockReturnValue(null);
    weather.getFiveDayWeatherData.mockResolvedValue({ daily: [{ date: getDateString() }] });

    const res = await getForecastDays({ latitude: 12.34, longitude: 56.78 });

    expect(res).toHaveProperty('location');
    expect(res.location.display_name).toMatch(/Your current location/);
    expect(res.location.latitude).toBeCloseTo(12.34);
    expect(res).toHaveProperty('forecast');
    expect(weather.getFiveDayWeatherData).toHaveBeenCalledWith(12.34, 56.78);
    expect(res.dateRange).toEqual(getDefaultFiveDayDateRange());
  });

  test('accepts numeric-string coordinate payload and coerces to numbers for 5-day', async () => {
    weather.validateCoordinates.mockReturnValue(null);
    weather.getFiveDayWeatherData.mockResolvedValue({ daily: [{ date: getDateString(1) }] });

    const res = await getForecastDays({ latitude: '12.34', longitude: '56.78' });

    expect(res.location.latitude).toBeCloseTo(12.34);
    expect(res.forecast.daily[0].date).toBe(getDateString(1));
    expect(res.dateRange).toEqual(getDefaultFiveDayDateRange());
  });

  test('uses custom date range when start and end dates are provided', async () => {
    geo.validateLocationInput.mockReturnValue(true);
    geo.getCoordinates.mockResolvedValue({ latitude: '12.34', longitude: '56.78', display_name: 'X' });
    weather.validateCoordinates.mockReturnValue(null);
    weather.validateDateRange.mockReturnValue(null);
    weather.getWeatherDataForDateRange.mockResolvedValue({ daily: [{ date: getDateString() }] });

    const res = await getForecastDays({
      city: 'X',
      state: 'Y',
      country: 'Z',
      startDate: getDateString(),
      endDate: getDateString(2)
    });

    expect(weather.getWeatherDataForDateRange).toHaveBeenCalledWith(12.34, 56.78, getDateString(), getDateString(2));
    expect(res.dateRange).toEqual({ startDate: getDateString(), endDate: getDateString(2) });
  });

  test('throws when provided date range is invalid', async () => {
    geo.validateLocationInput.mockReturnValue(true);
    geo.getCoordinates.mockResolvedValue({ latitude: '12.34', longitude: '56.78', display_name: 'X' });
    weather.validateCoordinates.mockReturnValue(null);
    weather.validateDateRange.mockReturnValue('Date out of allowed window');

    await expect(getForecastDays({ city: 'X', state: 'Y', country: 'Z', startDate: getDateString(-61), endDate: getDateString(-57) })).rejects.toThrow(/allowed window/);
  });
});