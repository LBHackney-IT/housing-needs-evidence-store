import CreateDownloadUrl from './CreateDownloadUrl';
import { S3Gateway } from '../gateways';
import { NoOpLogger } from '../logging/NoOpLogger';

describe('Create Download URL', () => {
  const expectedDownloadUrl = 'https://download.url/anw7qk/super.jpg';

  const usecase = new CreateDownloadUrl({
    logger: new NoOpLogger(),
    s3Gateway: ({
      createDownloadUrl: jest.fn(() => Promise.resolve(expectedDownloadUrl)),
    } as unknown) as S3Gateway,
  });

  it('creates a suitable download URL', async () => {
    const result = await usecase.execute({
      filename: 'super.jpg',
      documentId: 'anw7qk',
    });

    expect(result.downloadUrl).toBe(expectedDownloadUrl);
  });
});
