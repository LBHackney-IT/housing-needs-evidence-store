import { RouteOptions } from 'fastify';

const health: RouteOptions = {
  method: 'GET',
  url: '/health',
  handler: (_req, reply) => {
    reply.status(200).send();
  },
};

export default health;
