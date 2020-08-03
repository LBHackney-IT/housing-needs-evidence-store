jest.mock('../dependencies');
import { createHandler } from './objectCreated';
import { S3Event, Context } from 'aws-lambda';
import { NoOpLogger } from '../logging/NoOpLogger';

describe('ObjectCreated handler', () => {
  const dependencies = {
    logger: new NoOpLogger(),
    indexDocument: { execute: jest.fn() },
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handler = createHandler(dependencies);

  const createS3Event = (key: string) =>
    ({ Records: [{ s3: { object: { key } } }] } as S3Event);
  const createMockContext = () =>
    ({ awsRequestId: 'aws:lambda:123' } as Context);

  it('ignores metadata files', async () => {
    await handler(
      createS3Event('some/file/metadata.json'),
      createMockContext(),
      jest.fn()
    );

    expect(dependencies.indexDocument.execute).not.toHaveBeenCalled();
  });

  it('indexes documents that are not metadata files', async () => {
    await handler(
      createS3Event('abcd12345/document.jpg'),
      createMockContext(),
      jest.fn()
    );

    expect(dependencies.indexDocument.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        documentId: 'abcd12345',
        filename: 'document.jpg',
        objectKey: 'abcd12345/document.jpg',
      })
    );
  });

  it('decodes URI encoded keys', async () => {
    await handler(
      createS3Event('abcd12345/my+document+with+spaces.jpg'),
      createMockContext(),
      jest.fn()
    );

    expect(dependencies.indexDocument.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        documentId: 'abcd12345',
        filename: 'my document with spaces.jpg',
        objectKey: 'abcd12345/my document with spaces.jpg'
      })
    );
  });
});
