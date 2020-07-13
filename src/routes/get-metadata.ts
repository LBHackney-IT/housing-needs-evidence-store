import dependencies from '../dependencies';
import { FastifyRequest, RouteOptions, DefaultQuery } from 'fastify';
import { IncomingMessage } from 'http';
import { GetMetadata } from '../use-cases';

interface EndpointDependencies {
  getMetadata: GetMetadata;
}

interface Params {
  documentId: string;
}

const createEndpoint = ({ getMetadata }: EndpointDependencies): RouteOptions => ({
  method: 'GET',
  url: '/:documentId',
  handler: async (req: FastifyRequest<IncomingMessage, DefaultQuery, Params>, reply) => {
    const result = await getMetadata.execute({ documentId: req.params.documentId });
    reply.status(200).send(result);
  },
});

export default createEndpoint({
  getMetadata: dependencies.getMetadata,
});

export { createEndpoint };
