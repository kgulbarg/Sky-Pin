import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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
    expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Postal Code/i)).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /get weather/i });
    expect(button).toBeDisabled();
  });

  test('submits postal code and shows results', async () => {
    const fakeWeatherResponse = {
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
        json: () => Promise.resolve(fakeWeatherResponse)
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(fakeForecastResponse)
      });

    vi.stubGlobal('fetch', fetchMock);

    render(<App />);

    const postalInput = screen.getByLabelText(/Postal Code/i);
    await userEvent.type(postalInput, '12345');

    const button = screen.getByRole('button', { name: /get weather/i });
    expect(button).toBeEnabled();

    await userEvent.click(button);

    await waitFor(() => expect(screen.getByText(/Current Weather/i)).toBeInTheDocument());

    expect(screen.getByText('Test Place')).toBeInTheDocument();
    expect(screen.getByText(/Temperature/i)).toBeInTheDocument();
    expect(screen.getByText(/Feels like/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /see 5-day forecast/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /see 5-day forecast/i }));

    await waitFor(() => expect(screen.getByText(/5-Day Forecast/i)).toBeInTheDocument());
    expect(screen.getAllByText(/Rain/i).length).toBeGreaterThan(0);
  });
});
