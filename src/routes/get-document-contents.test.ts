import fastify from 'fastify';
import { createEndpoint } from './get-document-contents';
import { GetIndexedMetadata, CreateDownloadUrl } from '../use-cases';
import { NoOpLogger } from '../logging/NoOpLogger';

describe('GET /{documentId}/contents', () => {
  const expectedMetadataResponse = {
    documentId: 'ahw82u',
    filename: 'jam.png',
  };

  const expectedDownloadRepsonse = {
    downloadUrl: 'https://s3.download.url/jam.png',
  };

  const getMetadata = ({
    execute: jest.fn(() => expectedMetadataResponse),
  } as unknown) as GetIndexedMetadata;

  const createDownloadUrl = ({
    execute: jest.fn(() => expectedDownloadRepsonse),
  } as unknown) as CreateDownloadUrl;

  const app = fastify();
  app.route(
    createEndpoint({
      logger: new NoOpLogger(),
      getMetadata,
      createDownloadUrl,
    })
  );

  it('redirects to the expected download URL', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/ahw82u/contents',
    });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe(
      expectedDownloadRepsonse.downloadUrl
    );
  });
});
