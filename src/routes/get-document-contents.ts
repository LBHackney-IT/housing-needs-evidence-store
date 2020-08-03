import dependencies from '../dependencies';
import { RouteOptions } from 'fastify';
import { GetIndexedMetadata, CreateDownloadUrl } from '../use-cases';
import { Logger } from '../logging';

interface EndpointDependencies {
  logger: Logger;
  getMetadata: GetIndexedMetadata;
  createDownloadUrl: CreateDownloadUrl;
}

const createEndpoint = ({
  logger,
  getMetadata,
  createDownloadUrl,
}: EndpointDependencies): RouteOptions => ({
  method: 'GET',
  url: '/:documentId/contents',
  handler: async (req, reply) => {
    const { documentId, filename } = await getMetadata.execute({
      documentId: req.params['documentId'],
    });

    logger.mergeContext({ documentId, filename });

    if (filename && filename.length > 0) {
      const { downloadUrl } = await createDownloadUrl.execute({
        filename,
        documentId
      });

      logger.log('redirecting to download url');
      reply.redirect(302, downloadUrl);
    } else {
      logger.log('no filename set in metadata');
      reply.status(400).send();
    }
  },
});

export default createEndpoint({
  logger: dependencies.logger,
  getMetadata: dependencies.getIndexedMetadata,
  createDownloadUrl: dependencies.createDownloadUrl,
});

export { createEndpoint };
