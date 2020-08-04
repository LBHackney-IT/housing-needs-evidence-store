import FindDocuments from './FindDocuments';
import { ElasticsearchGateway } from '../gateways';

describe('Find Documents Use Case', () => {
  const documents = [
    { name: '123.jpeg', id: '123' },
    { name: '456.pdf', id: '456' },
  ];

  const usecase = new FindDocuments({
    elasticsearchGateway: ({
      findDocuments: jest.fn(() => Promise.resolve(documents)),
    } as unknown) as ElasticsearchGateway,
  });

  it('gets a document by name', async () => {
    const expectedResult = { documents };
    const metadata = {
      firstName: 'Tim',
      lastName: 'Jones',
    };
    const result = await usecase.execute({ metadata });
    expect(result).toEqual(expectedResult);
  });
});
