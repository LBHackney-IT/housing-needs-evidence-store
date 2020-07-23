import dependencies from '../dependencies';
import { RouteOptions } from 'fastify';
import { SaveMetadata } from '../use-cases';

interface EndpointDependencies {
  saveMetadata: SaveMetadata;
}

const isStringOrArray = (obj) => {
  return (
    typeof obj === 'string' ||
    (obj.constructor === Array && obj.every((i) => typeof i === 'string'))
  );
};

const createEndpoint = ({
  saveMetadata,
}: EndpointDependencies): RouteOptions => ({
  method: 'POST',
  url: '/metadata',
  handler: async (req, reply) => {
    const metadata = req.body;

    for (const [key, value] of Object.entries(metadata)) {
      if (!isStringOrArray(value)) {
        throw new Error(
          'Metadata object values have to consist of strings or arrays of strings'
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
