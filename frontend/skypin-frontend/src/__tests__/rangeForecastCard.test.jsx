import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import RangeForecastCard from '../components/rangeForecastCard.jsx';

function getDateString(offsetDays = 0) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offsetDays);

  return date.toISOString().slice(0, 10);
}

function formatForecastDate(dateValue) {
  const date = new Date(`${dateValue}T12:00:00`);

  return new Intl.DateTimeFormat('en', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

describe('RangeForecastCard', () => {
  globalThis.React = React;

  test('renders a date range forecast card list', () => {
    render(
      <RangeForecastCard
        title="Custom date range"
        rangeForecast={{
          daily: [
            {
                date: getDateString(),
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
    expect(screen.getByText(formatForecastDate(getDateString()))).toBeInTheDocument();
  });
});