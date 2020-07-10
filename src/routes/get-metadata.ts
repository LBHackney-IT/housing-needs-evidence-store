import { getMetadata } from '../dependencies';
import { FastifyReply, RouteOptions, DefaultQuery, FastifyRequest } from 'fastify';
import { IncomingMessage } from 'http';

interface Params {
  documentId: string;
}

const createEndpoint = ({ getMetadata }): RouteOptions => ({
  method: 'GET',
  url: '/:documentId',
  handler: async (req: FastifyRequest<IncomingMessage, DefaultQuery, Params>, reply: FastifyReply) => {
    const result = await getMetadata.execute(req.params.documentId);
    reply.status(200).send(result);
  },
});

export default createEndpoint({ getMetadata });
export { createEndpoint };
