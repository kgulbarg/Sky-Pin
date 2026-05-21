const BASE_ICON_URL =
  "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/";

const WEATHER_MAP = {

  // Clear

  0: {
    label: "Clear Sky",
    iconDay: "clear-day.svg",
    iconNight: "clear-night.svg",
    theme: "sunny"
  },

  // Clouds

  1: {
    label: "Mainly Clear",
    iconDay: "mostly-clear-day.svg",
    iconNight: "mostly-clear-night.svg",
    theme: "mostly-sunny"
  },

  2: {
    label: "Partly Cloudy",
    iconDay: "partly-cloudy-day.svg",
    iconNight: "partly-cloudy-night.svg",
    theme: "cloudy"
  },

  3: {
    label: "Overcast",
    iconDay: "overcast-day.svg",
    iconNight: "overcast-night.svg",
    theme: "overcast"
  },

  // Fog

  45: {
    label: "Fog",
    iconDay: "fog.svg",
    iconNight: "fog.svg",
    theme: "foggy"
  },

  48: {
    label: "Depositing Rime Fog",
    iconDay: "fog.svg",
    iconNight: "fog.svg",
    theme: "foggy"
  },

  // Drizzle

  51: {
    label: "Light Drizzle",
    iconDay: "drizzle.svg",
    iconNight: "drizzle.svg",
    theme: "drizzle"
  },

  53: {
    label: "Moderate Drizzle",
    iconDay: "drizzle.svg",
    iconNight: "drizzle.svg",
    theme: "drizzle"
  },

  55: {
    label: "Dense Drizzle",
    iconDay: "extreme-drizzle.svg",
    iconNight: "extreme-drizzle.svg",
    theme: "drizzle"
  },

  // Freezing Drizzle

  56: {
    label: "Light Freezing Drizzle",
    iconDay: "sleet.svg",
    iconNight: "sleet.svg",
    theme: "freezing"
  },

  57: {
    label: "Dense Freezing Drizzle",
    iconDay: "sleet.svg",
    iconNight: "sleet.svg",
    theme: "freezing"
  },

  // Rain

  61: {
    label: "Light Rain",
    iconDay: "rain.svg",
    iconNight: "rain.svg",
    theme: "rainy"
  },

  63: {
    label: "Moderate Rain",
    iconDay: "rain.svg",
    iconNight: "rain.svg",
    theme: "rainy"
  },

  65: {
    label: "Heavy Rain",
    iconDay: "extreme-rain.svg",
    iconNight: "extreme-rain.svg",
    theme: "rainy"
  },

  // Freezing Rain

  66: {
    label: "Light Freezing Rain",
    iconDay: "sleet.svg",
    iconNight: "sleet.svg",
    theme: "freezing"
  },

  67: {
    label: "Heavy Freezing Rain",
    iconDay: "sleet.svg",
    iconNight: "sleet.svg",
    theme: "freezing"
  },

  // Snow Fall

  71: {
    label: "Light Snow",
    iconDay: "snow.svg",
    iconNight: "snow.svg",
    theme: "snowy"
  },

  73: {
    label: "Moderate Snow",
    iconDay: "snow.svg",
    iconNight: "snow.svg",
    theme: "snowy"
  },

  75: {
    label: "Heavy Snow",
    iconDay: "extreme-snow.svg",
    iconNight: "extreme-snow.svg",
    theme: "snowy"
  },

  // Snow Grains

  77: {
    label: "Snow Grains",
    iconDay: "snowflake.svg",
    iconNight: "snowflake.svg",
    theme: "snowy"
  },

  // Rain Showers

  80: {
    label: "Light Rain Showers",
    iconDay: "showers.svg",
    iconNight: "showers.svg",
    theme: "rainy"
  },

  81: {
    label: "Moderate Rain Showers",
    iconDay: "showers.svg",
    iconNight: "showers.svg",
    theme: "rainy"
  },

  82: {
    label: "Violent Rain Showers",
    iconDay: "extreme-rain.svg",
    iconNight: "extreme-rain.svg",
    theme: "stormy"
  },

  // Snow Showers

  85: {
    label: "Light Snow Showers",
    iconDay: "snow.svg",
    iconNight: "snow.svg",
    theme: "snowy"
  },

  86: {
    label: "Heavy Snow Showers",
    iconDay: "extreme-snow.svg",
    iconNight: "extreme-snow.svg",
    theme: "snowy"
  },

  // Thunderstorms

  95: {
    label: "Thunderstorm",
    iconDay: "thunderstorms.svg",
    iconNight: "thunderstorms.svg",
    theme: "stormy"
  },

  96: {
    label: "Thunderstorm with Slight Hail",
    iconDay: "thunderstorms-extreme.svg",
    iconNight: "thunderstorms-extreme.svg",
    theme: "stormy"
  },

  99: {
    label: "Thunderstorm with Heavy Hail",
    iconDay: "thunderstorms-extreme.svg",
    iconNight: "thunderstorms-extreme.svg",
    theme: "stormy"
  }
};

export function getWeatherUI(code, isDay) {
  const config = WEATHER_MAP[code] || WEATHER_MAP[0];

  return {
    label: config.label,

    iconUrl: isDay
      ? `${BASE_ICON_URL}${config.iconDay}`
      : `${BASE_ICON_URL}${config.iconNight}`,

    theme: config.theme
  };
}