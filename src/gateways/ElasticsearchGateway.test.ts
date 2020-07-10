import elasticsearch from '@elastic/elasticsearch';
import { NoOpLogger } from '../logging/NoOpLogger';
import { ElasticsearchGateway } from "./ElasticsearchGateway";

describe('ElasticsearchGateway', () => {
  const indexName = 'documents';
  const metadata = { documentId: 'gs523ad', ey: 'value' };

  let client: elasticsearch.Client;
  let gateway: ElasticsearchGateway;

  beforeEach(() => {
    client = {
      index: jest.fn(() => Promise.resolve())
    } as unknown as elasticsearch.Client;

    gateway = new ElasticsearchGateway({
      client,
      indexName,
      logger: new NoOpLogger(),
    });
  });

  describe('#index', () => {
    it('indexes the specified metadata in Elasticsearch', async () => {
      await gateway.index(metadata);

      expect(client.index).toHaveBeenCalledWith({
        index: indexName,
        id: metadata.documentId,
        body: metadata
      });
    });

    describe('when there is an error', () => {
      const error = new Error('Something bad happened');

      it('bubbles up errors', async () => {
        (client.index as jest.Mock).mockImplementation(() => {
          throw error;
        });

        await expect(gateway.index(metadata)).rejects.toThrow(error);
      });
    })
  });
});
