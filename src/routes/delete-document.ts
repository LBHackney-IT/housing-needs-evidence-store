import { RouteOptions } from 'fastify';
import { DeleteDocument } from '../use-cases';
import { Logger } from '../logging';

interface EndpointDependencies {
  logger: Logger;
  deleteDocument: DeleteDocument;
}

const createEndpoint = ({
  logger,
  deleteDocument
}: EndpointDependencies): RouteOptions => ({
  method: 'DELETE',
  url: '/:documentId',
  handler: async (req, reply) => {
    const documentId = req.params['documentId'];
    logger.mergeContext({ documentId });

    try {
      await deleteDocument.execute({ documentId });
      logger.log('successfully deleted');
      reply.status(204).send();
    } catch (err) {
      logger.error(err).log('failed to delete');
      throw err;
    }
  },
});

export { createEndpoint };
