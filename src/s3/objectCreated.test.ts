import { createHandler } from "./objectCreated";
import { S3Event, Context } from "aws-lambda";
import { NoOpLogger } from '../logging/NoOpLogger';

describe('ObjectCreated handler', () => {
  const container = {
    logger: new NoOpLogger(),
    indexDocument: { execute: jest.fn() }
  };

  const handler = createHandler(container);

  const createS3Event = (key: string) => ({ Records: [{ s3: { object: { key } } }] } as S3Event);
  const createMockContext = () => ({ awsRequestId: 'aws:lambda:123' } as Context);

  it('ignores metadata files', async () => {
    await handler(
      createS3Event('some/file/metadata.json'),
      createMockContext(),
      jest.fn()
    );

    expect(container.indexDocument.execute).not.toHaveBeenCalled();
  });

  it('indexes documents that are not metadata files', async () => {
    await handler(
      createS3Event('abcd12345/document.jpg'),
      createMockContext(),
      jest.fn()
    );

    expect(container.indexDocument.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        documentId: 'abcd12345'
      })
    );
  })
});
