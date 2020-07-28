import { GetMetadata, IndexDocument } from '.';
import UnknownDocumentError from '../domain/UnknownDocumentError';
import { ElasticsearchGateway } from '../gateways/ElasticsearchGateway';
import { NoOpLogger } from '../logging/NoOpLogger';

describe('IndexDocument', () => {
  const expectedMetadata = {
    documentId: 'tewg61a',
    some: 'key',
    another: 'value',
    filename: 'cat.jpg'
  };

  let usecase: IndexDocument;
  let es: ElasticsearchGateway;
  let getMetadata: GetMetadata;

  beforeEach(() => {
    es = { index: jest.fn() };
    getMetadata = { execute: jest.fn(() => Promise.resolve(expectedMetadata)) };
    usecase = new IndexDocument({
      logger: new NoOpLogger(),
      getMetadata,
      elasticsearchGateway: es,
    });
  });

  describe('when called with a valid documentId', () => {
    it('indexes existing metadata', async () => {
      await usecase.execute({
        documentId: 'tewg61a',
        filename: 'cat.jpg'
      });
      expect(es.index).toHaveBeenCalledWith(expectedMetadata);
    });
  });

  describe('when called with an invalid documentId', () => {
    beforeEach(() => {
      (getMetadata.execute as jest.Mock).mockImplementation(
        ({ documentId }) => {
          throw new UnknownDocumentError(documentId);
        }
      );
    });

    it('throws UnknownDocumentError', async () => {
      await expect(usecase.execute({
        documentId: 'UNKNOWN',
        filename: 'UNKNOWN/readme.txt'
      })).rejects.toThrow(
        UnknownDocumentError
      );
    });
  });
});
