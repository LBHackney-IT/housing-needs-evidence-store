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
    const metadata = req.body;

    for (const [key, value] of Object.entries(metadata)) {
      if (typeof value === 'string' || value instanceof String) {
      } else if (value.constructor === Array) {
        if (
          value.every((i) => value instanceof String || typeof i === 'string')
        ) {
        } else {
          throw new Error(
            'Metadata has to consist of strings or arrays of strings'
          );
        }
      } else {
        throw new Error(
          'Metadata has to consist of strings or arrays of strings'
        );
      }
    }

    const result = await saveMetadata.execute({ metadata: req.body });
    reply.status(201).send(result);
  },
});

export default createEndpoint({
  saveMetadata: dependencies.saveMetadata,
});

export { createEndpoint };
