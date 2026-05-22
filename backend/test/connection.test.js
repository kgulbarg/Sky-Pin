const path = require('path');

describe('db/connection', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.DB_HOST = 'db-host';
    process.env.DB_PORT = '5432';
    process.env.DB_NAME = 'mydb';
    process.env.DB_USER = 'dbuser';
    process.env.DB_PASSWORD = 'dbpass';
  });

  test('constructs Pool with env vars', () => {
    const mockPool = jest.fn();
    jest.doMock('pg', () => ({ Pool: mockPool }));

    const pool = require('../db/connection');

    expect(mockPool).toHaveBeenCalledWith({
      host: 'db-host',
      port: '5432',
      database: 'mydb',
      user: 'dbuser',
      password: 'dbpass',
    });

    expect(pool).toBeDefined();
  });
});
