import fastify from '../index';

describe('GET /health', () => {
  describe('when everything is healthy', () => {
    it('returns 200', async () => {
      const response = await fastify.inject({
        method: 'GET',
        url: '/health',
      });

      expect(response.statusCode).toBe(200);
    });
  });
});
