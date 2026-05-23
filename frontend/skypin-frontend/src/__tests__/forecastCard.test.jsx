import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ForecastCard from '../components/forecastCard.jsx';
import { describe, expect, test, vi } from 'vitest';

describe('ForecastCard', () => {
  globalThis.React = React;

  test('renders forecast strip, icons, and calls action callbacks', async () => {
    const sampleForecast = {
      daily_units: {
        temperature_2m_max: '°C',
        temperature_2m_min: '°C',
        rain_sum: 'mm',
        wind_speed_10m_max: 'm/s'
      },
      daily: [
        { date: '2026-01-01', weather_code: 0, temperature_2m_max: 21, temperature_2m_min: 14, rain_sum: 0, wind_speed_10m_max: 5 },
        { date: '2026-01-02', weather_code: 1, temperature_2m_max: 20, temperature_2m_min: 13, rain_sum: 1, wind_speed_10m_max: 6 }
      ]
    };

    const onBackToCurrent = vi.fn();
    const onSearchAgain = vi.fn();

    render(
      <ForecastCard
        location="Test Location"
        forecast={sampleForecast}
        onBackToCurrent={onBackToCurrent}
        onSearchAgain={onSearchAgain}
      />
    );

    expect(screen.getByText(/5-Day Forecast/i)).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();

    // weather icon and label from mapping (code 0 -> Clear Sky)
    expect(screen.getByAltText('Clear Sky')).toBeInTheDocument();

    // Rain and Wind labels and values
    expect(screen.getAllByText(/Rain/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Wind/i).length).toBeGreaterThan(0);

    const user = userEvent.setup();

    await user.click(screen.getByLabelText(/Back to current weather/i));
    expect(onBackToCurrent).toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /New search/i }));
    expect(onSearchAgain).toHaveBeenCalled();
  });
});
