import { saveMetadata } from '../dependencies';
import { RouteOptions } from 'fastify';

const createEndpoint = ({ saveMetadata }): RouteOptions => ({
  method: 'POST',
  url: '/metadata',
  handler: async (req, reply) => {
    const result = await saveMetadata.execute(req.body);
    reply.status(201).send(result);
  },
});

export default createEndpoint({ saveMetadata });
export { createEndpoint };
