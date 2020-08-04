import { DeleteDocument } from '.';
import { ElasticsearchGateway, S3Gateway } from '../gateways';
import { NoOpLogger } from '../logging/NoOpLogger';

describe('DeleteDocument', () => {
  const expectedMetadata = {
    documentId: 'tewg61a',
    some: 'key',
    another: 'value',
    filename: 'cat.jpg',
  };

  let usecase: DeleteDocument;
  let es: ElasticsearchGateway;
  let s3: S3Gateway;

  beforeEach(() => {
    es = ({
      deleteByDocumentId: jest.fn(() => Promise.resolve())
    } as unknown) as ElasticsearchGateway;

    s3 = ({
      deleteByDocumentId: jest.fn(() => Promise.resolve())
    } as unknown) as S3Gateway;

    usecase = new DeleteDocument({
      logger: new NoOpLogger(),
      s3Gateway: s3,
      elasticsearchGateway: es,
    });
  });

  describe('when called with a valid documentId', () => {
    it('deletes the document from S3 and Elasticsearch', async () => {
      await usecase.execute({ documentId: 'tewg61a' });
      expect(es.deleteByDocumentId).toHaveBeenLastCalledWith('tewg61a');
      expect(s3.deleteByDocumentId).toHaveBeenLastCalledWith('tewg61a');
    });
  });

  describe('when deleting fails', () => {
    const error = new Error('Failed to delete');

    beforeEach(() => {
      (es.deleteByDocumentId as jest.Mock).mockImplementation(() => {
        throw error;
      });
    });

    it('throws bubbles up the error', async () => {
      await expect(
        usecase.execute({ documentId: 'UNKNOWN' })
      ).rejects.toThrow(error);
    });
  });
});
