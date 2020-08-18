import dependencies from '../dependencies';
import { RouteOptions } from 'fastify';
import { FindDocuments } from '../use-cases';

interface EndpointDependencies {
  findDocuments: FindDocuments;
}

const isStringOrArray = (obj) => {
  return (
    typeof obj === 'string' ||
    (Array.isArray(obj) && obj.every((i) => typeof i === 'string'))
  );
};

const createEndpoint = ({
  findDocuments,
}: EndpointDependencies): RouteOptions => ({
  method: 'POST',
  url: '/search',
  handler: async (req, reply) => {
    const metadata = req.body['metadata'];

    for (const value of Object.values(metadata)) {
      if (!isStringOrArray(value)) {
        throw {
          status: 400,
          message:
            'Each metadata value must be a string or an array of strings',
        };
      }
    }

    const result = await findDocuments.execute({
      metadata,
      minimumMatchTerms: req.body['minimumMatchTerms'],
    });
    reply.status(200).send(result);
  },
});

export default createEndpoint({
  findDocuments: dependencies.findDocuments,
});

export { createEndpoint };
