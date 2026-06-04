describe("weatherPersistenceService", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  function getDateString(offsetDays = 0) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + offsetDays);

    return date.toISOString().slice(0, 10);
  }

  function getDateTimeString(offsetDays = 0, hours = 12, minutes = 0) {
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    date.setDate(date.getDate() + offsetDays);

    return date.toISOString();
  }

  test("buildCurrentWeatherDailyRow maps current weather to one daily row", () => {
    const { buildCurrentWeatherDailyRow } = require("../services/weatherPersistenceService");

    const date = getDateString();

    expect(
      buildCurrentWeatherDailyRow({
        current: {
          temperature_2m: 20,
          apparent_temperature: 19,
          rain: 1,
          wind_speed_10m: 7,
          weather_code: 2,
        },
      }, date)
    ).toEqual({
      date,
      temp: 20,
      temp_2m: 19,
      rain: 1,
      wind: 7,
      weatherCode: 2,
    });
  });

  test("buildFiveDayWeatherDailyRows maps each forecast day to a daily row", () => {
    const { buildFiveDayWeatherDailyRows } = require("../services/weatherPersistenceService");

    const firstDate = getDateString();
    const secondDate = getDateString(1);


    expect(
      buildFiveDayWeatherDailyRows({
        daily: [
          {
            date: firstDate,
            temperature_2m_max: 21,
            temperature_2m_min: 12,
            rain_sum: 3,
            wind_speed_10m_max: 11,
            weather_code: 3,
          },
          {
            date: secondDate,
            temperature_2m_max: 22,
            temperature_2m_min: 13,
            rain_sum: 0,
            wind_speed_10m_max: 8,
            weather_code: 1,
          },
        ],
      })
    ).toEqual([
      {
        date: firstDate,
        temp: 21,
        temp_2m: 12,
        rain: 3,
        wind: 11,
        weatherCode: 3,
      },
      {
        date: secondDate,
        temp: 22,
        temp_2m: 13,
        rain: 0,
        wind: 8,
        weatherCode: 1,
      },
    ]);
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
      startDate: getDateString(),
      endDate: getDateString(),
      userNotes: "test note",
    });

    expect(searchId).toBe(42);
    expect(query).toHaveBeenCalledTimes(1);
    expect(query.mock.calls[0][0]).toContain("INSERT INTO weather_searches");
  });

  test("lists past weather searches ordered by search time", async () => {
    const query = jest.fn().mockResolvedValue({
      rows: [
        { id: 2, search_time: getDateTimeString(), updated_at: getDateTimeString(0, 12, 1) },
        { id: 1, search_time: getDateTimeString(-1), updated_at: getDateTimeString(-1, 12, 1) },
      ],
    });

    jest.doMock("../db/connection", () => ({
      query,
    }));

    const { getPastWeatherSearches } = require("../services/weatherPersistenceService");

    const searches = await getPastWeatherSearches();

    expect(searches).toHaveLength(2);
    expect(query).toHaveBeenCalledTimes(1);
    expect(query.mock.calls[0][0]).toContain("FROM weather_searches");
    expect(query.mock.calls[0][0]).toContain("ORDER BY search_time DESC, id DESC");
  });

  test("builds a CSV export for weather data rows", () => {
    const { buildWeatherDataCsv } = require("../services/weatherPersistenceService");

    const csv = buildWeatherDataCsv([
      {
        search_id: 7,
        search_time: getDateTimeString(),
        updated_at: getDateTimeString(0, 12, 1),
        city: "Norristown",
        state: "PA",
        cunty: "Montgomery",
        country: "United States",
        pincode: "19401",
        latitude: 40.1148787,
        longitude: -75.3433705,
        start_date: getDateString(),
        end_date: getDateString(4),
        user_notes: 'Needs "rain" updates',
        daily_id: 99,
        daily_date: getDateString(),
        temp: 19.7,
        temp_2m: 12.7,
        rain: 12,
        wind: 15.5,
        weather_code: 65,
      },
    ]);

    expect(csv).toContain("search_id,search_time,updated_at,city,state,cunty,country,pincode,latitude,longitude,start_date,end_date,user_notes,daily_id,daily_date,temp,temp_2m,rain,wind,weather_code");
    expect(csv).toContain(`7,${getDateTimeString()},${getDateTimeString(0, 12, 1)},Norristown,PA,Montgomery,United States,19401,40.1148787,-75.3433705,${getDateString()},${getDateString(4)},"Needs ""rain"" updates",99,${getDateString()},19.7,12.7,12,15.5,65`);
  });

  test("updates past search notes and returns the updated row", async () => {
    const query = jest.fn().mockResolvedValue({
      rows: [
        {
          id: 7,
          search_time: getDateTimeString(),
          updated_at: getDateTimeString(1),
          user_notes: "updated note",
        },
      ],
    });

    jest.doMock("../db/connection", () => ({
      query,
    }));

    const { saveWeatherSearchNotes } = require("../services/weatherPersistenceService");

    const savedSearch = await saveWeatherSearchNotes(7, "updated note");

    expect(savedSearch).toMatchObject({
      id: 7,
      user_notes: "updated note",
    });
    expect(query).toHaveBeenCalledTimes(1);
    expect(query.mock.calls[0][0]).toContain("UPDATE weather_searches");
    expect(query.mock.calls[0][0]).toContain("updated_at = NOW()");
  });

  test("deletes a past weather search", async () => {
    const query = jest.fn().mockResolvedValue({
      rows: [{ id: 7 }],
    });

    jest.doMock("../db/connection", () => ({
      query,
    }));

    const { removeWeatherSearch } = require("../services/weatherPersistenceService");

    const deletedSearch = await removeWeatherSearch(7);

    expect(deletedSearch).toEqual({ id: 7 });
    expect(query).toHaveBeenCalledTimes(1);
    expect(query.mock.calls[0][0]).toContain("DELETE FROM weather_searches");
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
        startDate: getDateString(),
        endDate: getDateString(4),
      },
      [
        {
          date: getDateString(),
          temp: 19.7,
          temp_2m: 12.7,
          rain: 12,
          wind: 15.5,
          weatherCode: 65,
        },
        {
          date: getDateString(1),
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