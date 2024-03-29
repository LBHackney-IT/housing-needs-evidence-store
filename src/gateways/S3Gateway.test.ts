import { S3Gateway } from './S3Gateway';
import { NoOpLogger } from '../logging/NoOpLogger';

describe('S3Gateway', () => {
  let client;
  beforeEach(() => {
    client = {
      putObject: jest.fn(() => ({ promise: jest.fn() })),
      listObjects: jest.fn(() => ({ promise: jest.fn() })),
      deleteObjects: jest.fn(() => ({ promise: jest.fn() })),
      createPresignedPost: jest.fn((options, callback) =>
        callback(null, {
          url: 'https://s3.eu-west-2.amazonaws.com/bucketName',
          fields: {
            'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
          },
        })
      ),
      getSignedUrlPromise: jest.fn(() =>
        Promise.resolve(
          'https://s3.eu-west-2.amazonaws.com/bucket/filename.txt'
        )
      ),
    };
  });

  it('can create metadata document in S3', async () => {
    const metadata = {
      firstName: 'Andrew',
      dob: '1999-09-09',
      documentId: '123',
    };

    const expectedObject = {
      Bucket: 'testBucket',
      Key: `${metadata.documentId}/metadata.json`,
      Body: Buffer.from(JSON.stringify(metadata)),
    };

    const s3Gateway = new S3Gateway({
      logger: new NoOpLogger(),
      client,
      bucketName: 'testBucket',
    });

    const result = await s3Gateway.create(metadata);
    expect(client.putObject).toHaveBeenCalledWith(expectedObject);
    expect(result).toBe(metadata);
  });

  it('can create an upload url', async () => {
    const expectedData = {
      url: 'https://s3.eu-west-2.amazonaws.com/bucketName',
      fields: {
        'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
      },
    };

    const s3Gateway = new S3Gateway({
      logger: new NoOpLogger(),
      client,
      bucketName: 'testBucket',
    });

    const result = await s3Gateway.createUrl('123');
    expect(result).toStrictEqual(expectedData);
  });

  it('sets the correct policy conditions on the upload URL', async () => {
    const documentId = '123';
    const s3Gateway = new S3Gateway({
      logger: new NoOpLogger(),
      client,
      bucketName: 'testBucket',
    });

    await s3Gateway.createUrl(documentId);
    expect(client.createPresignedPost).toHaveBeenCalledWith(
      expect.objectContaining({
        Conditions: expect.arrayContaining([
          ['starts-with', '$key', `${documentId}/`],
          { 'X-Amz-Server-Side-Encryption': 'AES256' },
          ['starts-with', '$X-Amz-Meta-Description', ''],
        ]),
      }),
      expect.any(Function)
    );
  });

  it('can get a document by id', async () => {
    const documentId = '123';
    const expectedDocument = {
      firstName: 'Andrew',
      dob: '1999-09-09',
      documentId,
    };
    client.getObject = jest.fn(() => ({
      promise: () =>
        Promise.resolve({
          Body: Buffer.from(JSON.stringify(expectedDocument)),
        }),
    }));

    const s3Gateway = new S3Gateway({
      logger: new NoOpLogger(),
      client,
      bucketName: 'testBucket',
    });

    const result = await s3Gateway.get(documentId);
    expect(result).toStrictEqual(expectedDocument);
  });

  it('creates a signed download url', async () => {
    const gateway = new S3Gateway({
      logger: new NoOpLogger(),
      client,
      bucketName: 'bucket',
    });

    const signedUrl = await gateway.createDownloadUrl(
      'bucket/filename.txt',
      30
    );

    expect(client.getSignedUrlPromise).toHaveBeenCalledWith('getObject', {
      Bucket: 'bucket',
      Key: 'bucket/filename.txt',
      Expires: 30,
    });

    expect(signedUrl).toBe(
      'https://s3.eu-west-2.amazonaws.com/bucket/filename.txt'
    );
  });

  describe('#deleteByDocumentId', () => {
    describe('when there are no objects in the bucket', () => {
      beforeEach(() => {
        client.listObjects.mockImplementation(() => ({
          promise: jest.fn(() => ({
            Contents: []
          }))
        }));
      });

      it('succeeds but does nothing', async () => {
        const gateway = new S3Gateway({
          client,
          bucketName: 'Bucket',
          logger: new NoOpLogger(),
        });

        await gateway.deleteByDocumentId('aswhd8');
        expect(client.deleteObjects).not.toHaveBeenCalled();
      });
    });
  });

  describe('when there are objects in the bucket', () => {
    beforeEach(() => {
      client.listObjects.mockImplementation(() => ({
        promise: jest.fn(() => ({
          Contents: [
            { Key: 'aswhd8/metadata.json' },
            { Key: 'aswhd8/cat.jpg' }
          ]
        }))
      }));
    })

    it('removes all objects prefixed with the document id', async () => {
      const gateway = new S3Gateway({
        client,
        bucketName: 'Bucket',
        logger: new NoOpLogger(),
      });

      await gateway.deleteByDocumentId('aswhd8');

      expect(client.deleteObjects).toHaveBeenCalledWith({
        Bucket: 'Bucket',
        Delete: {
          Objects: [
            { Key: 'aswhd8/metadata.json' },
            { Key: 'aswhd8/cat.jpg' }
          ]
        },
      });
    });
  });

  it('can get metadata from S3 object', async () => {
    const expectedObject = {
      description: 'My passport',
    };

    client.headObject = jest.fn(() => ({
      promise: () =>
        Promise.resolve({
          Metadata: expectedObject,
        }),
    }));

    const gateway = new S3Gateway({
      logger: new NoOpLogger(),
      client,
      bucketName: 'testBucket',
    });

    const result = await gateway.getObjectMetadata('123/Passport.jpg');
    expect(result).toStrictEqual(expectedObject);
  });
});
