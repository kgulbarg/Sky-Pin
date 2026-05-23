describe("weatherPersistenceService", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("buildCurrentWeatherDailyRow maps current weather to one daily row", () => {
    const { buildCurrentWeatherDailyRow } = require("../services/weatherPersistenceService");

    expect(
      buildCurrentWeatherDailyRow({
        current: {
          temperature_2m: 20,
          apparent_temperature: 19,
          rain: 1,
          wind_speed_10m: 7,
          weather_code: 2,
        },
      }, "2026-05-23")
    ).toEqual({
      date: "2026-05-23",
      temp: 20,
      temp_2m: 19,
      rain: 1,
      wind: 7,
      weatherCode: 2,
    });
  });

  test("creates a search row and returns the id", async () => {
    const query = jest.fn().mockResolvedValue({ rows: [{ id: 42 }] });

    jest.doMock("../db/connection", () => ({
      query,
    }));

    const { createWeatherSearch } = require("../db/weatherSearchRepository");

    const searchId = await createWeatherSearch({
      city: "Berlin",
      state: "Berlin",
      cunty: "Berlin",
      country: "Germany",
      pincode: "10115",
      latitude: 52.52,
      longitude: 13.405,
      startDate: "2026-05-23",
      endDate: "2026-05-23",
      userNotes: "test note",
    });

    expect(searchId).toBe(42);
    expect(query).toHaveBeenCalledTimes(1);
    expect(query.mock.calls[0][0]).toContain("INSERT INTO weather_searches");
  });

  test("recordWeatherSearchWithDailyRows commits search and daily rows together", async () => {
    const client = {
      query: jest
        .fn()
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce({ rows: [{ id: 7 }] })
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined),
      release: jest.fn(),
    };

    const connect = jest.fn().mockResolvedValue(client);

    jest.doMock("../db/connection", () => ({
      connect,
    }));

    const { recordWeatherSearchWithDailyRows } = require("../services/weatherPersistenceService");

    await recordWeatherSearchWithDailyRows(
      {
        city: "Norristown",
        state: "PA",
        cunty: "Montgomery",
        country: "United States",
        pincode: "19401",
        latitude: 40.1148787,
        longitude: -75.3433705,
        startDate: "2026-05-23",
        endDate: "2026-05-27",
      },
      [
        {
          date: "2026-05-23",
          temp: 19.7,
          temp_2m: 12.7,
          rain: 12,
          wind: 15.5,
          weatherCode: 65,
        },
        {
          date: "2026-05-24",
          temp: 20.4,
          temp_2m: 12.6,
          rain: 0,
          wind: 18.9,
          weatherCode: 3,
        },
      ]
    );

    expect(connect).toHaveBeenCalledTimes(1);
    expect(client.query).toHaveBeenNthCalledWith(1, "BEGIN");
    expect(client.query.mock.calls[1][0]).toContain("INSERT INTO weather_searches");
    expect(client.query.mock.calls[2][0]).toContain("INSERT INTO weather_daily");
    expect(client.query).toHaveBeenLastCalledWith("COMMIT");
    expect(client.release).toHaveBeenCalledTimes(1);
  });
});