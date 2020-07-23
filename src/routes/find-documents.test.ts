import fastify from 'fastify';
import { createEndpoint } from './find-documents';
import { FindDocuments } from '../use-cases';

describe('POST /search', () => {
  const expectedResponse = {
    documents: [
      { name: '123.jpeg', id: '123' },
      { name: '456.pdf', id: '456' },
    ],
  };

  const findDocuments = ({
    execute: jest.fn((x) => {
      if (x.metadata) {
        return expectedResponse;
      }
      throw new Error();
    }),
  } as unknown) as FindDocuments;

  const app = fastify();
  app.route(createEndpoint({ findDocuments }));

  it('can find documents', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/search',
      payload: {
        firstName: 'Tim',
        lastName: 'Rose',
      },
    });
    expect(response.body).toStrictEqual(JSON.stringify(expectedResponse));
    expect(response.statusCode).toBe(200);
  });

  it('passes through error code if error is thrown', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/search',
      payload: '',
    });

    expect(response.statusCode).toBe(500);
  });

  it('Throws an error if metadata is not strings', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/search',
      payload: {
        firstName: 5,
        lastName: 'Rose',
      },
    });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).message).toBe(
      'Metadata object values have to consist of strings or arrays of strings'
    );
  });

  it('Throws an error if metadata is not array of strings', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/search',
      payload: {
        lastName: ['Rose', 'Blue', { sneaky: 'object' }],
      },
    });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).message).toBe(
      'Metadata object values have to consist of strings or arrays of strings'
    );
  });
});
