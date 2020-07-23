import fastify from 'fastify';
import { createEndpoint } from './save-metadata';
import { SaveMetadata } from '../use-cases';

describe('POST /metadata', () => {
  const expectedResponse = {
    documentId: '123',
    url: 'https://s3.eu-west-2.amazonaws.com/bucketName',
    fields: {
      'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
    },
  };

  const saveMetadata = ({
    execute: jest.fn(() => expectedResponse),
  } as unknown) as SaveMetadata;

  const app = fastify();
  app.route(createEndpoint({ saveMetadata }));

  it('can save metadata', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/metadata',
      payload: {
        firstName: 'Andrew',
        dob: '1999-01-01',
      },
    });
    expect(response.body).toStrictEqual(JSON.stringify(expectedResponse));
    expect(response.statusCode).toBe(201);
  });

  it('Throws an error if metadata is not strings', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/metadata',
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
      url: '/metadata',
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
