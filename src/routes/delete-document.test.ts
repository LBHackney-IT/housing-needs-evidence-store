import fastify from 'fastify';
import { DeleteDocument } from '../use-cases';
import { createEndpoint } from './delete-document';
import { NoOpLogger } from '../logging/NoOpLogger';

describe('DELETE /{documentId}', () => {
  const deleteDocument = ({
    execute: jest.fn(() => Promise.resolve()),
  } as unknown) as DeleteDocument;

  const app = fastify();
  app.route(createEndpoint({ deleteDocument, logger: new NoOpLogger() }));

  it('calls delete and returns a 204', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: '/ahw82u',
    });

    expect(deleteDocument.execute)
      .toHaveBeenCalledWith({ documentId: 'ahw82u' });

    expect(response.statusCode).toBe(204);
  });
});
