import { RouteOptions } from 'fastify';

const createEndpoint = (): RouteOptions => ({
  method: 'GET',
  url: '/health',
  handler: (_req, reply) => {
    reply.status(200).send();
  },
});

export default createEndpoint();
export { createEndpoint };
