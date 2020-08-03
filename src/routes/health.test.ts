import fastify from 'fastify';
import { createEndpoint } from './health';

describe('GET /health', () => {
  describe('when everything is healthy', () => {
    it('returns 200', async () => {
      const app = fastify();
      app.route(createEndpoint());

      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      expect(response.statusCode).toBe(200);
    });
  });
});
