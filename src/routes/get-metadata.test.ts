jest.mock('../dependencies');
import fastify from 'fastify';
import { createEndpoint } from './get-metadata';
import { GetIndexedMetadata } from '../use-cases';

describe('GET /documentId', () => {
  const expectedResponse = {
    documentId: '123',
    firstName: 'Andrew',
    dob: '1990-01-01',
  };

  const getIndexedMetadata = ({
    execute: jest.fn(() => expectedResponse),
  } as unknown) as GetIndexedMetadata;

  const app = fastify();
  app.route(createEndpoint({ getIndexedMetadata }));

  it('can get metadata', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/123',
    });

    expect(response.body).toStrictEqual(JSON.stringify(expectedResponse));
    expect(response.statusCode).toBe(200);
  });
});
