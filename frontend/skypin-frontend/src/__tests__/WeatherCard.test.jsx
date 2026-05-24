import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import WeatherCard from '../components/weatherCard.jsx';

describe('WeatherCard', () => {
  globalThis.React = React;

  test('renders the mapped weather icon URL', () => {
    render(
      <WeatherCard
        location={{ display_name: 'Test Place', latitude: 12.34, longitude: 56.78 }}
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
        onSeeForecast={vi.fn()}
        onViewMap={vi.fn()}
      />
    );

    const icon = screen.getByAltText('Clear Sky');

    expect(icon).toHaveAttribute(
      'src',
      expect.stringContaining('clear-day.svg')
    );
  });

  test('shows a map button when coordinates are available', () => {
    const onViewMap = vi.fn();

    render(
      <WeatherCard
        location={{ display_name: 'Test Place', latitude: 12.34, longitude: 56.78 }}
        weather={{
          current_units: {},
          current: { weather_code: 0, is_day: 1 },
        }}
        onSearchAgain={vi.fn()}
        onSeeForecast={vi.fn()}
        onViewMap={onViewMap}
      />
    );

    screen.getByRole('button', { name: /view on map/i }).click();

    expect(onViewMap).toHaveBeenCalledWith({
      display_name: 'Test Place',
      latitude: 12.34,
      longitude: 56.78,
    });
  });
});
