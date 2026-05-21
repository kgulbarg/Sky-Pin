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

    const postalInput = screen.getByLabelText(/Postal Code/i);
    await userEvent.type(postalInput, '12345');

    const button = screen.getByRole('button', { name: /get weather/i });
    expect(button).toBeEnabled();

    await userEvent.click(button);

    await waitFor(() => expect(screen.getByText(/Current Weather/i)).toBeInTheDocument());

    expect(screen.getByText('Test Place')).toBeInTheDocument();
    expect(screen.getByText(/Temperature/i)).toBeInTheDocument();
    expect(screen.getByText(/Feels like/i)).toBeInTheDocument();
  });
});
