import SaveMetadata from './SaveMetadata';
import { S3Gateway } from '../gateways';
import { ElasticsearchGateway } from '../gateways';

describe('Save Metadata Use Case', () => {
  const usecase = new SaveMetadata({
    s3Gateway: ({
      create: jest.fn((metadata) =>
        Promise.resolve({ ...metadata, documentId: '123' })
      ),
      createUrl: jest.fn(() =>
        Promise.resolve({
          url: 'https://s3.eu-west-2.amazonaws.com/bucketName',
          fields: {
            'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
          },
        })
      ),
    } as unknown) as S3Gateway,
    createDocumentId: jest.fn(() => '123'),
    esGateway: ({
      index: jest.fn(),
    } as unknown) as ElasticsearchGateway,
  });

  const metadata = {
    firstName: 'Aidan',
    dob: '1999-09-09',
  };

  it('Saves metadata to S3', async () => {
    await usecase.execute({ metadata });

    expect(usecase.s3Gateway.create).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'Aidan',
        dob: '1999-09-09',
        documentId: '123',
      })
    );
  });

  it('creates an upload url', async () => {
    await usecase.execute({ metadata });
    expect(usecase.s3Gateway.createUrl).toHaveBeenCalledWith('123');
  });

  it('indexes metadata files', async () => {
    await usecase.execute({ metadata });

    expect(usecase.esGateway.index).toHaveBeenCalledWith(
      expect.objectContaining({
        dob: '1999-09-09',
        documentId: '123',
        firstName: 'Aidan',
      })
    );
  });
});
