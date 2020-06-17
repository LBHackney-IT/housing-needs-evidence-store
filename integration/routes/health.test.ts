import client from '../client';

describe('GET /health', () => {
  it('reports that the service is healthy', async () => {
    const { statusCode } = await client.health();
    expect(statusCode).toBe(200);
  });
});
