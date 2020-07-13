import { findDocuments } from '../dependencies';
import { RouteOptions } from 'fastify';

const createEndpoint = ({ findDocuments }): RouteOptions => ({
  method: 'POST',
  url: '/documents',
  handler: async (req, reply) => {
    const result = await findDocuments.execute(req.body);
    reply.status(200).send(result);
  },
});

export default createEndpoint({ findDocuments });
export { createEndpoint };
