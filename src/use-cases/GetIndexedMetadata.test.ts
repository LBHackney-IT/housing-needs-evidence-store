import GetIndexedMetadata from './GetIndexedMetadata';
import { ElasticsearchGateway } from '../gateways';

describe('Get Indexed Metadata Use Case', () => {
  const expectedMetadata = {
    documentId: '123',
    firstName: 'Andrew',
    dob: '1999-09-09',
    description: 'This is a description',
    filename: 'passport.jpg'
  };

  const usecase = new GetIndexedMetadata({
    elasticsearchGateway: {
      getByDocumentId: jest.fn(() => Promise.resolve(expectedMetadata)),
    } as unknown as ElasticsearchGateway
  });

  it('retrieves metadata for a given document id', async () => {
    const result = await usecase.execute({
      documentId: expectedMetadata.documentId,
    });

    expect(result).toStrictEqual(expectedMetadata);
  });
});
