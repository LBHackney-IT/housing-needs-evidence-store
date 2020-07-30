import dependencies from '../dependencies';
import { FastifyRequest, RouteOptions } from 'fastify';
import { GetIndexedMetadata } from '../use-cases';

interface EndpointDependencies {
  getIndexedMetadata: GetIndexedMetadata;
}

const createEndpoint = ({
  getIndexedMetadata,
}: EndpointDependencies): RouteOptions => ({
  method: 'GET',
  url: '/:documentId',
  handler: async (req: FastifyRequest, reply) => {
    const result = await getIndexedMetadata.execute({
      documentId: req.params['documentId'],
    });

    reply.status(200).send(result);
  },
});

export default createEndpoint({
  getIndexedMetadata: dependencies.getIndexedMetadata,
});

export { createEndpoint };
