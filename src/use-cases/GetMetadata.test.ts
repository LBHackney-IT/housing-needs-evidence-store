import GetMetadata from './GetMetadata';
import { S3Gateway } from '../gateways';

describe('Get Metadata Use Case', () => {
  const expectedDocument = {
    firstName: 'Andrew',
    dob: '1999-09-09',
    documentId: '123',
  };

  const usecase = new GetMetadata({
    s3Gateway: ({
      get: jest.fn(() => Promise.resolve(expectedDocument)),
    } as unknown) as S3Gateway,
  });

  it('gets a document by id', async () => {
    const result = await usecase.execute({
      documentId: expectedDocument.documentId,
    });

    expect(result).toBe(expectedDocument);
  });
});
