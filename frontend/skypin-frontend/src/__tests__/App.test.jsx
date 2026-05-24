import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { afterEach, describe, test, expect, vi } from 'vitest';

describe('App', () => {
  globalThis.React = React;

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('renders form fields and disabled submit when invalid', () => {
    render(<App />);

    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/County/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/State/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Postal Code/i)).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /^Get Weather$/i });
    expect(button).toBeDisabled();
  });

  test('submits country and postal code and shows results', async () => {
    const fakeResponse = {
      location: { display_name: 'Test Place', latitude: 12.34, longitude: 56.78 },
      weather: {
        current_units: { temperature_2m: '°C', apparent_temperature: '°C', wind_speed_10m: 'm/s' },
        current: { temperature_2m: 21, apparent_temperature: 20, wind_speed_10m: 3, weather_code: 0 }
      }
    };

    const fakeForecastResponse = {
      location: { display_name: 'Test Place', latitude: 12.34, longitude: 56.78 },
      forecast: {
        daily_units: { temperature_2m_max: '°C', temperature_2m_min: '°C' },
        daily: [
          { date: '2026-01-01', weather_code: 0, temperature_2m_max: 21, temperature_2m_min: 14, rain_sum: 0, wind_speed_10m_max: 5 },
          { date: '2026-01-02', weather_code: 1, temperature_2m_max: 20, temperature_2m_min: 13, rain_sum: 1, wind_speed_10m_max: 6 },
          { date: '2026-01-03', weather_code: 2, temperature_2m_max: 19, temperature_2m_min: 12, rain_sum: 2, wind_speed_10m_max: 7 },
          { date: '2026-01-04', weather_code: 3, temperature_2m_max: 18, temperature_2m_min: 11, rain_sum: 3, wind_speed_10m_max: 8 },
          { date: '2026-01-05', weather_code: 45, temperature_2m_max: 17, temperature_2m_min: 10, rain_sum: 4, wind_speed_10m_max: 9 }
        ]
      }
    };

    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(fakeResponse)
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(fakeForecastResponse)
      });

    vi.stubGlobal('fetch', fetchMock);

    render(<App />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Country/i), 'France');

    const postalInput = screen.getByLabelText(/Postal Code/i);
    await user.type(postalInput, '75001');

    const button = screen.getByRole('button', { name: /^Get Weather$/i });
    expect(button).toBeEnabled();

    await user.click(button);

    await waitFor(() => expect(screen.getByText(/Current Weather/i)).toBeInTheDocument());

    expect(screen.getByText('Test Place')).toBeInTheDocument();
    expect(screen.getByText(/Temperature/i)).toBeInTheDocument();
    expect(screen.getByText(/Feels like/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /see 5-day forecast/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /see 5-day forecast/i }));

    await waitFor(() => expect(screen.getByText(/5-Day Forecast/i)).toBeInTheDocument());
    expect(screen.getAllByText(/Rain/i).length).toBeGreaterThan(0);
  });

  test('submits country with city and state and shows results', async () => {
    const fakeResponse = {
      location: { display_name: 'Test Place 2', latitude: 12.34, longitude: 56.78 },
      weather: {
        current_units: { temperature_2m: '°C', apparent_temperature: '°C', wind_speed_10m: 'm/s' },
        current: { temperature_2m: 22, apparent_temperature: 21, wind_speed_10m: 4, weather_code: 1 }
      }
    };

    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(fakeResponse)
    })));

    render(<App />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/City/i), 'Paris');
    await user.type(screen.getByLabelText(/State/i), 'Ile-de-France');
    await user.type(screen.getByLabelText(/Country/i), 'France');

    const button = screen.getByRole('button', { name: /^Get Weather$/i });
    expect(button).toBeEnabled();

    await user.click(button);

    await waitFor(() => expect(screen.getByText(/Current Weather/i)).toBeInTheDocument());

    expect(screen.getByText('Test Place 2')).toBeInTheDocument();
    expect(screen.getByText(/Temperature/i)).toBeInTheDocument();
  });

  test('submits country with city and county and shows results', async () => {
    const fakeResponse = {
      location: { display_name: 'Test Place 3', latitude: 12.34, longitude: 56.78 },
      weather: {
        current_units: { temperature_2m: '°C', apparent_temperature: '°C', wind_speed_10m: 'm/s' },
        current: { temperature_2m: 19, apparent_temperature: 18, wind_speed_10m: 2, weather_code: 2 }
      }
    };

    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(fakeResponse)
    })));

    render(<App />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/City/i), 'Paris');
    await user.type(screen.getByLabelText(/County/i), 'Paris');
    await user.type(screen.getByLabelText(/Country/i), 'France');

    const button = screen.getByRole('button', { name: /^Get Weather$/i });
    expect(button).toBeEnabled();

    await user.click(button);

    await waitFor(() => expect(screen.getByText(/Current Weather/i)).toBeInTheDocument());

    expect(screen.getByText('Test Place 3')).toBeInTheDocument();
    expect(screen.getByText(/Temperature/i)).toBeInTheDocument();
  });

  test('uses current location button and reuses coordinates for 5-day forecast', async () => {
    const fakeWeatherResponse = {
      coordinates: { latitude: 12.34, longitude: 56.78 },
      current_units: { temperature_2m: '°C', apparent_temperature: '°C', wind_speed_10m: 'm/s' },
      current: { temperature_2m: 25, apparent_temperature: 24, wind_speed_10m: 5, weather_code: 2, is_day: 1 }
    };

    const fakeForecastResponse = {
      location: { display_name: 'Your current location', latitude: 12.34, longitude: 56.78 },
      forecast: {
        daily_units: { temperature_2m_max: '°C', temperature_2m_min: '°C' },
        daily: [{ date: '2026-06-01', weather_code: 2, temperature_2m_max: 25, temperature_2m_min: 15 }]
      }
    };

    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(fakeWeatherResponse) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(fakeForecastResponse) });

    vi.stubGlobal('fetch', fetchMock);

    // mock geolocation
    vi.stubGlobal('navigator', {
      geolocation: {
        getCurrentPosition: (success) => success({ coords: { latitude: 12.34, longitude: 56.78 } })
      }
    });

    render(<App />);

    const user = userEvent.setup();

    const locButton = screen.getByRole('button', { name: /get weather at your location/i });
    await user.click(locButton);

    await waitFor(() => expect(screen.getByText(/Current Weather/i)).toBeInTheDocument());

    // first fetch should be /api/weather with coordinate body
    expect(fetchMock).toHaveBeenCalled();
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/api\/weather$/);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ latitude: 12.34, longitude: 56.78 });

    // click 5-day forecast
    await user.click(screen.getByRole('button', { name: /see 5-day forecast/i }));

    await waitFor(() => expect(screen.getByText(/5-Day Forecast/i)).toBeInTheDocument());

    // second fetch should be /api/forecastDays with same coordinate body
    expect(fetchMock.mock.calls[1][0]).toMatch(/\/api\/forecastDays$/);
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({ latitude: 12.34, longitude: 56.78 });
  });

  test('toggles date range form and submits a custom range from the results card', async () => {
    const fakeResponse = {
      location: { display_name: 'Range Place', latitude: 12.34, longitude: 56.78 },
      weather: {
        current_units: { temperature_2m: '°C', apparent_temperature: '°C', wind_speed_10m: 'm/s' },
        current: { temperature_2m: 23, apparent_temperature: 22, wind_speed_10m: 4, weather_code: 1 }
      }
    };

    const fakeForecastResponse = {
      location: { display_name: 'Range Place', latitude: 12.34, longitude: 56.78 },
      forecast: {
        daily_units: { temperature_2m_max: '°C', temperature_2m_min: '°C' },
        daily: [
          { date: '2026-05-20', weather_code: 0, temperature_2m_max: 21, temperature_2m_min: 14 },
          { date: '2026-05-21', weather_code: 1, temperature_2m_max: 20, temperature_2m_min: 13 },
          { date: '2026-05-22', weather_code: 2, temperature_2m_max: 19, temperature_2m_min: 12 }
        ]
      }
    };

    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(fakeResponse) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(fakeForecastResponse) });

    vi.stubGlobal('fetch', fetchMock);

    render(<App />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Country/i), 'France');
    await user.type(screen.getByLabelText(/Postal Code/i), '75001');
    await user.click(screen.getByRole('button', { name: /^Get Weather$/i }));

    await waitFor(() => expect(screen.getByText(/Current Weather/i)).toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: /View Date Range Search/i }));

    const startInput = screen.getByLabelText(/Start date/i);
    const endInput = screen.getByLabelText(/End date/i);
    const startDate = startInput.value;
    const endDate = endInput.value;

    const dateRangeForm = startInput.closest('form');
    fireEvent.submit(dateRangeForm);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

    await waitFor(() => expect(screen.queryByText(/Current Weather/i)).not.toBeInTheDocument());
    expect(screen.queryByLabelText(/Start date/i)).not.toBeInTheDocument();
    expect(screen.getAllByRole('article').length).toBe(3);
    expect(screen.getAllByText(/Rain/i).length).toBe(3);
    expect(fetchMock.mock.calls[1][0]).toMatch(/\/api\/forecastDays$/);
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({
      city: '',
      county: '',
      state: '',
      country: 'France',
      postalcode: '75001',
      startDate,
      endDate
    });
  });

  test('shows backend date range validation errors above the submit button', async () => {
    const fakeResponse = {
      location: { display_name: 'Range Place', latitude: 12.34, longitude: 56.78 },
      weather: {
        current_units: { temperature_2m: '°C', apparent_temperature: '°C', wind_speed_10m: 'm/s' },
        current: { temperature_2m: 23, apparent_temperature: 22, wind_speed_10m: 4, weather_code: 1 }
      }
    };

    const validationError = 'Start date is too far in the past. Earliest allowed is 2026-03-24.';

    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(fakeResponse) })
      .mockResolvedValueOnce({ ok: false, json: () => Promise.resolve({ error: validationError }) });

    vi.stubGlobal('fetch', fetchMock);

    render(<App />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Country/i), 'France');
    await user.type(screen.getByLabelText(/Postal Code/i), '75001');
    await user.click(screen.getByRole('button', { name: /^Get Weather$/i }));

    await waitFor(() => expect(screen.getByText(/Current Weather/i)).toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: /View Date Range Search/i }));

    const dateRangeForm = screen.getByLabelText(/Start date/i).closest('form');
    fireEvent.submit(dateRangeForm);

    await waitFor(() => expect(screen.getByText(validationError)).toBeInTheDocument());
  });
});
