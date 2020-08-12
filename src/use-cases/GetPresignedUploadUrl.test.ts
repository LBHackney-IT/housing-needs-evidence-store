import GetPresignedUploadUrl from './GetPresignedUploadUrl';
import { S3Gateway } from '../gateways';

describe('Get Presigned Upload Url Use Case', () => {
  const usecase = new GetPresignedUploadUrl({
    s3Gateway: ({
      createUrl: jest.fn(() =>
        Promise.resolve({
          url: 'https://s3.eu-west-2.amazonaws.com/bucketName',
          fields: {
            'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
          },
        })
      ),
    } as unknown) as S3Gateway,
  });

  it('gets a presigned upload url from S3', async () => {
    const documentId = '123';
    await usecase.execute({ documentId });

    expect(usecase.s3Gateway.createUrl).toHaveBeenCalledWith(documentId);
  });
});
