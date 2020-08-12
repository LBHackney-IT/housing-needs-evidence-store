jest.mock('../dependencies');
import fastify from 'fastify';
import { createEndpoint } from './get-presigned-upload-url';
import { GetPresignedUploadUrl } from '../use-cases';

describe('GET /:documentId/upload-url', () => {
  const expectedResponse = {
    documentId: '123',
    url: 'https://s3.eu-west-2.amazonaws.com/bucketName',
    fields: {
      'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
    },
  };

  const getPresignedUploadUrl = ({
    execute: jest.fn(() => expectedResponse),
  } as unknown) as GetPresignedUploadUrl;

  const app = fastify();
  app.route(createEndpoint({ getPresignedUploadUrl }));

  it('can get a url', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/123/upload-url',
    });
    expect(response.body).toStrictEqual(JSON.stringify(expectedResponse));
    expect(response.statusCode).toBe(200);
  });
});
