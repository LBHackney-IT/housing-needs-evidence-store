import FindDocuments from './FindDocuments';
import ElasticsearchGateway from '../gateways/ElasticsearchGateway';

describe('Find Documents Use Case', () => {
  const expectedDocuments = {
    documents: [
      { name: '123.jpeg', id: '123' },
      { name: '456.pdf', id: '456' },
    ],
  };

  const usecase = new FindDocuments({
    elasticsearchGateway: ({
      findDocuments: jest.fn(() => Promise.resolve(expectedDocuments)),
    } as unknown) as ElasticsearchGateway,
    createDocumentId: jest.fn(() => '123'),
  });

  it('gets a document by name', async () => {
    const result = await usecase.execute({
      fistName: 'Tim',
      lastName: 'Jones',
    });
    expect(result).toBe(expectedDocuments);
  });
});
