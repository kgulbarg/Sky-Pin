const axios = require('axios');
const {
  LOCATION_INPUT_ERROR_MESSAGE,
  validateLocationInput,
  getCoordinates
} = require('../services/geocoordService');

jest.mock('axios');

describe('geocoordService', () => {
  describe('validateLocationInput', () => {
    test('returns false when fields are non-strings', () => {
      expect(validateLocationInput({ city: 123 })).toBe(false);
      expect(validateLocationInput({ postalcode: {} })).toBe(false);
    });

    test('returns false when all fields empty or missing', () => {
      expect(validateLocationInput({})).toBe(false);
      expect(validateLocationInput({ city: '' , country: '   '})).toBe(false);
      expect(validateLocationInput({ postalcode: '12345' })).toBe(false);
      expect(validateLocationInput({ city: 'Paris', country: 'France' })).toBe(
        false
      );
    });

    test('returns true for country plus postal code or city and state', () => {
      expect(
        validateLocationInput({ country: 'France', postalcode: '75001' })
      ).toBe(true);
      expect(
        validateLocationInput({ country: 'France', city: 'Paris', state: 'IDF' })
      ).toBe(true);
      expect(LOCATION_INPUT_ERROR_MESSAGE).toMatch(/Country is required/);
    });
  });

  describe('getCoordinates', () => {
    test('returns coordinates for valid axios response', async () => {
      axios.get.mockResolvedValue({ data: [{ lat: '12.34', lon: '56.78', display_name: 'Test Place' }] });

      const res = await getCoordinates({ city: 'Test' });

      expect(res).toEqual({ latitude: '12.34', longitude: '56.78', display_name: 'Test Place' });
    });

    test('throws when no results', async () => {
      axios.get.mockResolvedValue({ data: [] });

      await expect(getCoordinates({ city: 'Nowhere' })).rejects.toThrow('Location not found.');
    });
  });
});
