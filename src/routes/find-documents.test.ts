import fastify from 'fastify';
import { createEndpoint } from './find-documents';
import { FindDocuments } from '../use-cases';

describe('POST /documents', () => {
  const expectedResponse = {
    documents: [
      { name: '123.jpeg', id: '123' },
      { name: '456.pdf', id: '456' },
    ],
  };

  const findDocuments = ({
    execute: jest.fn(() => expectedResponse),
  } as unknown) as FindDocuments;

  const app = fastify();
  app.route(createEndpoint({ findDocuments }));

  it('can find documents', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/documents',
      payload: {
        firstName: 'Tim',
        lastName: 'Rose',
      },
    });
    expect(response.body).toStrictEqual(JSON.stringify(expectedResponse));
    expect(response.statusCode).toBe(200);
  });
});
