import dependencies from '../dependencies';
import { RouteOptions } from 'fastify';
import { FindDocuments } from '../use-cases';

interface EndpointDependencies {
  findDocuments: FindDocuments;
}

const isStringOrArray = (obj) => {
  return (
    typeof obj === 'string' ||
    (obj.constructor === Array && obj.every((i) => typeof i === 'string'))
  );
};

const createEndpoint = ({
  findDocuments,
}: EndpointDependencies): RouteOptions => ({
  method: 'POST',
  url: '/search',
  handler: async (req, reply) => {
    const metadata = req.body;

    for (const [key, value] of Object.entries(metadata)) {
      if (isStringOrArray(value)) {
      } else {
        throw new Error(
          'Metadata object values have to consist of strings or arrays of strings'
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
