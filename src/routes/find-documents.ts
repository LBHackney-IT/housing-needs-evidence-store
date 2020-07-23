import dependencies from '../dependencies';
import { RouteOptions } from 'fastify';
import { FindDocuments } from '../use-cases';

interface EndpointDependencies {
  findDocuments: FindDocuments;
}

const createEndpoint = ({
  findDocuments,
}: EndpointDependencies): RouteOptions => ({
  method: 'POST',
  url: '/search',
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

    const result = await findDocuments.execute({ metadata: req.body });
    reply.status(200).send(result);
  },
});

export default createEndpoint({
  findDocuments: dependencies.findDocuments,
});

export { createEndpoint };
