import dependencies from '../dependencies';
import { RouteOptions } from 'fastify';
import { SaveMetadata } from '../use-cases';

interface EndpointDependencies {
  saveMetadata: SaveMetadata;
}

const createEndpoint = ({
  saveMetadata,
}: EndpointDependencies): RouteOptions => ({
  method: 'POST',
  url: '/metadata',
  handler: async (req, reply) => {
    const result = await saveMetadata.execute({ metadata: req.body });
    reply.status(201).send(result);
  },
});

export default createEndpoint({
  saveMetadata: dependencies.saveMetadata,
});

export { createEndpoint };
