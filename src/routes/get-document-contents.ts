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
    const redirect = (req.query['redirect'] || 'true') === 'true';
    logger.mergeContext({ query: req.query, redirect });

    const { documentId, filename } = await getMetadata.execute({
      documentId: req.params['documentId']
    });

    logger.mergeContext({ documentId, filename });

    if (filename && filename.length > 0) {
      const { downloadUrl } = await createDownloadUrl.execute({
        filename,
        documentId,
      });

      if (redirect) {
        logger.log('redirecting to download url');
        return reply.redirect(302, downloadUrl);
      }

      logger.log('redirect not requested, returning download url');
      reply.status(200).send({ downloadUrl });
    } else {
      logger.log('no filename set in metadata');
      reply.status(400).send();
    }
  },
});

export { createEndpoint };
