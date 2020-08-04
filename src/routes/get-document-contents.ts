import { FastifyRequest, RouteOptions } from 'fastify';
import { GetIndexedMetadata, CreateDownloadUrl } from '../use-cases';
import { Logger } from '../logging';

interface EndpointDependencies {
  logger: Logger;
  getMetadata: GetIndexedMetadata;
  createDownloadUrl: CreateDownloadUrl;
}

type Request = FastifyRequest;

const createEndpoint = ({
  logger,
  getMetadata,
  createDownloadUrl,
}: EndpointDependencies): RouteOptions => ({
  method: 'GET',
  url: '/:documentId/contents',
  handler: async (req: Request, reply) => {
    const { documentId, filename } = await getMetadata.execute({
      documentId: req.params['documentId'],
    });

    logger.mergeContext({ documentId, filename });

    if (filename && filename.length > 0) {
      const { downloadUrl } = await createDownloadUrl.execute({
        filename,
        documentId,
      });

      logger.log('redirecting to download url');
      reply.redirect(302, downloadUrl);
    } else {
      logger.log('no filename set in metadata');
      reply.status(400).send();
    }
  },
});

export { createEndpoint };
