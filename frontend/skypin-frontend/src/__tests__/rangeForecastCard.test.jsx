import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import RangeForecastCard from '../components/rangeForecastCard.jsx';

describe('RangeForecastCard', () => {
  globalThis.React = React;

  test('renders a date range forecast card list', () => {
    render(
      <RangeForecastCard
        title="Custom date range"
        rangeForecast={{
          daily: [
            {
              date: '2026-01-01',
              weather_code: 0,
              temperature_2m_max: 21,
              temperature_2m_min: 14,
              rain_sum: 0,
              wind_speed_10m_max: 5,
            },
          ],
        }}
      />
    );

    expect(screen.getByText('Date range results')).toBeInTheDocument();
    expect(screen.getByText('Custom date range')).toBeInTheDocument();
    expect(screen.getByAltText('Clear Sky')).toBeInTheDocument();
    expect(screen.getByText(/Jan/i)).toBeInTheDocument();
  });
});