import dependencies from '../dependencies';
import { RouteOptions } from 'fastify';
import { GetPresignedUploadUrl } from '../use-cases';

interface EndpointDependencies {
  getPresignedUploadUrl: GetPresignedUploadUrl;
}

const createEndpoint = ({
  getPresignedUploadUrl,
}: EndpointDependencies): RouteOptions => ({
  method: 'GET',
  url: '/:documentId/upload-url',
  handler: async (req, reply) => {
    const result = await getPresignedUploadUrl.execute({
      documentId: req.params['documentId'],
    });
    reply.status(200).send(result);
  },
});

export default createEndpoint({
  getPresignedUploadUrl: dependencies.getPresignedUploadUrl,
});

export { createEndpoint };
