import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import WeatherCard from '../components/weatherCard.jsx';

describe('WeatherCard', () => {
  globalThis.React = React;

  test('renders the mapped weather icon URL', () => {
    render(
      <WeatherCard
        location="Test Place"
        weather={{
          current_units: {
            temperature_2m: '°C',
            apparent_temperature: '°C',
            wind_speed_10m: 'm/s',
            precipitation: 'mm',
          },
          current: {
            temperature_2m: 21,
            apparent_temperature: 20,
            wind_speed_10m: 3,
            precipitation: 0,
            weather_code: 0,
            is_day: 1,
          },
        }}
        onSearchAgain={vi.fn()}
      />
    );

    const icon = screen.getByAltText('Clear Sky');

    expect(icon).toHaveAttribute(
      'src',
      expect.stringContaining('clear-day.svg')
    );
  });
});