import dependencies from '../dependencies';
import { FastifyRequest, RouteOptions, DefaultQuery } from 'fastify';
import { IncomingMessage } from 'http';
import GetIndexedMetadataUseCase from '../use-cases/GetIndexedMetadata';

interface EndpointDependencies {
  getIndexedMetadata: GetIndexedMetadataUseCase;
}

interface Params {
  documentId: string;
}

const createEndpoint = ({ getIndexedMetadata }: EndpointDependencies): RouteOptions => ({
  method: 'GET',
  url: '/:documentId',
  handler: async (req: FastifyRequest<IncomingMessage, DefaultQuery, Params>, reply) => {
    const result = await getIndexedMetadata.execute({
      documentId: req.params.documentId
    });

    reply.status(200).send(result);
  },
});

export default createEndpoint({
  getIndexedMetadata: dependencies.getIndexedMetadata,
});

export { createEndpoint };
