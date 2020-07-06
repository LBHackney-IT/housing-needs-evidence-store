import S3Gateway from './S3-Gateway';

describe('S3Gateway', () => {
  let client;
  beforeEach(() => {
    client = {
      putObject: jest.fn(() => ({ promise: jest.fn() })),
      createPresignedPost: jest.fn((options, callback) => callback(null,
        {
          url: "https://s3.eu-west-2.amazonaws.com/bucketName",
          fields: {
            'X-Amz-Algorithm': 'AWS4-HMAC-SHA256'
          }
        }))
    }
  })

  it('can create metadata document in S3', async () => {
    const metadata = {
      firstName: "Andrew",
      dob: "1999-09-09",
      documentId: "123"
    }

    const expectedObject =
    {
      Bucket: "testBucket",
      Key: `${metadata.documentId}/${metadata.documentId}.json`,
      Body: Buffer.from(JSON.stringify(metadata)),
    }


    const s3Gateway = new S3Gateway(client, "testBucket");
    const result = await s3Gateway.create(metadata);

    expect(client.putObject).toHaveBeenCalledWith(expectedObject, expect.any(Function))
    expect(result).toBe(metadata);
  })

  it('can create an upload url', async () => {


    const metadata = {
      firstName: "Andrew",
      dob: "1999-09-09",
      documentId: "123"
    }

    const expectedData = {
      url: "https://s3.eu-west-2.amazonaws.com/bucketName",
      fields: {
        'X-Amz-Algorithm': 'AWS4-HMAC-SHA256'
      }
    }

    const s3Gateway = new S3Gateway(client, "testBucket");
    const result = await s3Gateway.createUrl("123");

    expect(result).toStrictEqual(expectedData);
  })
})