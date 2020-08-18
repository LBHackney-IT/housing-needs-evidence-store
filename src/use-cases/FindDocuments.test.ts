import FindDocuments from './FindDocuments';
import { ElasticsearchGateway } from '../gateways';

describe('Find Documents Use Case', () => {
  const documents = [
    { name: '123.jpeg', id: '123' },
    { name: '456.pdf', id: '456' },
  ];
  const findDocuments = jest.fn(() => Promise.resolve(documents));

  const usecase = new FindDocuments({
    elasticsearchGateway: ({
      findDocuments,
    } as unknown) as ElasticsearchGateway,
  });

  it('gets a document by name', async () => {
    const expectedResult = { documents };
    const metadata = {
      firstName: 'Tim',
      lastName: 'Jones',
    };
    const result = await usecase.execute({ metadata });
    expect(findDocuments).toHaveBeenCalledWith({ metadata });
    expect(result).toEqual(expectedResult);
  });

  it('can request minimum matching terms', async () => {
    const metadata = {
      firstName: 'Tim',
      lastName: 'Jones',
    };
    await usecase.execute({ metadata, minimumMatchTerms: 2 });
    expect(findDocuments).toHaveBeenCalledWith({
      metadata,
      minimumMatchTerms: 2,
    });
  });
});
