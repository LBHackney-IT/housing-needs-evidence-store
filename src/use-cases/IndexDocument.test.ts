import { GetMetadata, IndexDocument } from '.';
import { UnknownDocumentError } from '../domain';
import { ElasticsearchGateway } from '../gateways';
import { NoOpLogger } from '../logging/NoOpLogger';

describe('IndexDocument', () => {
  const expectedDate = new Date(1597744712808);

  const expectedMetadata = {
    documentId: 'tewg61a',
    some: 'key',
    another: 'value',
    filename: 'cat.jpg',
    uploadedDate: expectedDate.toISOString(),
  };

  let usecase: IndexDocument;
  let es: ElasticsearchGateway;
  let getMetadata: GetMetadata;

  beforeEach(() => {
    es = ({ index: jest.fn() } as unknown) as ElasticsearchGateway;
    getMetadata = ({
      execute: jest.fn(() => Promise.resolve(expectedMetadata)),
    } as unknown) as GetMetadata;
    usecase = new IndexDocument({
      logger: new NoOpLogger(),
      getMetadata,
      elasticsearchGateway: es,
    });
  });

  describe('when called with a valid documentId', () => {
    it('passes through the object key to fetch metadata', async () => {
      await usecase.execute({
        documentId: 'tewg61a',
        filename: 'passport.jpg',
        objectKey: 'tewg61a/passport.jpg',
        uploadedDate: expectedDate,
      });

      expect(getMetadata.execute).toHaveBeenLastCalledWith({
        documentId: 'tewg61a',
        objectKey: 'tewg61a/passport.jpg',
      });
    });

    it('indexes existing metadata', async () => {
      await usecase.execute({
        documentId: 'tewg61a',
        filename: 'cat.jpg',
        objectKey: 'tewg61a/cat.jpg',
        uploadedDate: expectedDate,
      });

      expect(es.index).toHaveBeenCalledWith(expectedMetadata);
    });
  });

  describe('when called with an invalid documentId', () => {
    beforeEach(() => {
      (getMetadata.execute as jest.Mock).mockImplementation(() => {
        throw new Error();
      });
    });

    it('throws UnknownDocumentError', async () => {
      await expect(
        usecase.execute({
          documentId: 'UNKNOWN',
          filename: 'passport.jpg',
          objectKey: 'tewg61a/passport.jpg',
          uploadedDate: expectedDate,
        })
      ).rejects.toThrow(UnknownDocumentError);
    });
  });
});
