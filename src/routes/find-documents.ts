import dependencies from '../dependencies';
import { RouteOptions } from 'fastify';
import { FindDocuments } from '../use-cases';

interface EndpointDependencies {
  findDocuments: FindDocuments;
}

const createEndpoint = ({
  findDocuments,
}: EndpointDependencies): RouteOptions => ({
  method: 'POST',
  url: '/documents',
  handler: async (req, reply) => {
    const result = await findDocuments.execute({ metadata: req.body });
    reply.status(200).send(result);
  },
});

export default createEndpoint({
  findDocuments: dependencies.findDocuments,
});

export { createEndpoint };
