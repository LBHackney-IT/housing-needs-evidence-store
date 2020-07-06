import { getMetadata } from '../dependencies';
import { RouteOptions } from 'fastify';

const createEndpoint = ({ getMetadata }): RouteOptions => ({
  method: 'GET',
  url: '/:documentId',
  handler: async (_req, reply) => {
    const result = await getMetadata.execute(_req.params.documentId);
    reply.status(200).send(result);
  }
});

export default createEndpoint({ getMetadata });
export { createEndpoint }