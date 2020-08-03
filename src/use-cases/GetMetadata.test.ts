import GetMetadata from './GetMetadata';
import { S3Gateway } from '../gateways';

describe('Get Metadata Use Case', () => {
  const objectMetadata = {
    description: 'My passport'
  };

  const predfinedMetadata = {
    firstName: 'Andrew',
    dob: '1999-09-09',
    documentId: '123',
  };

  const expectedDocument = {
    ...objectMetadata,
    ...predfinedMetadata
  };

  const usecase = new GetMetadata({
    s3Gateway: {
      get: jest.fn(() => Promise.resolve(predfinedMetadata)),
      getObjectMetadata: jest.fn(() => Promise.resolve(objectMetadata))
    } as unknown as S3Gateway
  });

  it('retrieves metadata from the S3 object', async () => {
    const result = await usecase.execute({
      documentId: expectedDocument.documentId,
      objectKey: `${expectedDocument.documentId}/passport.jpg`
    });

    expect(result).toStrictEqual(expectedDocument);
  })
});
