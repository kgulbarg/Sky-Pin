describe("db/initSchema", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("creates weather_searches and weather_daily tables", async () => {
    const query = jest.fn().mockResolvedValue();

    jest.doMock("../db/connection", () => ({
      query,
    }));

    const { initializeDatabaseSchema } = require("../db/initSchema");

    await initializeDatabaseSchema();

    expect(query).toHaveBeenCalledTimes(2);
    expect(query.mock.calls[0][0]).toContain("CREATE TABLE IF NOT EXISTS weather_searches");
    expect(query.mock.calls[1][0]).toContain("CREATE TABLE IF NOT EXISTS weather_daily");
    expect(query.mock.calls[1][0]).toContain('"weather code" INTEGER');
    expect(query.mock.calls[1][0]).toContain("REFERENCES weather_searches(id) ON DELETE CASCADE");
  });
});