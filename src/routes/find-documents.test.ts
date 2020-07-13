import fastify from 'fastify';
import { createEndpoint } from './find-documents';

describe('POST /documents', () => {
  const expectedResponse = {
    documents: [
      { name: '123.jpeg', id: '123' },
      { name: '456.pdf', id: '456' },
    ],
  };

  const findDocuments = {
    execute: jest.fn(() => expectedResponse),
  };

  const app = fastify();
  app.route(createEndpoint({ findDocuments }));

  it('can find documents', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/documents',
      body: {
        firstName: 'Tim',
        lastName: 'Rose',
      },
    });
    expect(response.body).toStrictEqual(JSON.stringify(expectedResponse));
    expect(response.statusCode).toBe(200);
  });
});
