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
    expect(screen.getByLabelText(/State/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Postal Code/i)).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /get weather/i });
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

    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(fakeResponse)
    })));

    render(<App />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Country/i), 'France');

    const postalInput = screen.getByLabelText(/Postal Code/i);
    await user.type(postalInput, '75001');

    const button = screen.getByRole('button', { name: /get weather/i });
    expect(button).toBeEnabled();

    await user.click(button);

    await waitFor(() => expect(screen.getByText(/Current Weather/i)).toBeInTheDocument());

    expect(screen.getByText('Test Place')).toBeInTheDocument();
    expect(screen.getByText(/Temperature/i)).toBeInTheDocument();
    expect(screen.getByText(/Feels like/i)).toBeInTheDocument();
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

    const button = screen.getByRole('button', { name: /get weather/i });
    expect(button).toBeEnabled();

    await user.click(button);

    await waitFor(() => expect(screen.getByText(/Current Weather/i)).toBeInTheDocument());

    expect(screen.getByText('Test Place 2')).toBeInTheDocument();
    expect(screen.getByText(/Temperature/i)).toBeInTheDocument();
  });
});
