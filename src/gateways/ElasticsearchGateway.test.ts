import elasticsearch from '@elastic/elasticsearch';
import { NoOpLogger } from '../logging/NoOpLogger';
import { ElasticsearchGateway } from './ElasticsearchGateway';

describe('ElasticsearchGateway', () => {
  const indexName = 'documents';
  const metadata = { documentId: 'gs523ad', ey: 'value' };

  let client: elasticsearch.Client;
  let gateway: ElasticsearchGateway;

  beforeEach(() => {
    client = ({
      index: jest.fn(() => Promise.resolve()),
      cat: {
        indices: jest.fn((index, callback) => {
          const statusCode = index.index === 'new_index' ? 404 : 200;
          callback(null, { statusCode });
        }),
      },
      indices: { create: jest.fn(() => {}) },
    } as unknown) as elasticsearch.Client;

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
        body: metadata,
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
    });
  });

  describe('#createIndex', () => {
    it('creates an index if it does not exist', async () => {
      gateway = new ElasticsearchGateway({
        client,
        indexName: 'new_index',
        logger: new NoOpLogger(),
      });

      expect(client.cat.indices).toHaveBeenCalledWith(
        { index: 'new_index' },
        expect.anything()
      );

      expect(client.indices.create).toHaveBeenCalledWith(
        { index: 'new_index' },
        expect.anything()
      );
    });

    it('does not create an index if it already exist', async () => {
      gateway = new ElasticsearchGateway({
        client,
        indexName: 'existing_index',
        logger: new NoOpLogger(),
      });

      expect(client.cat.indices).toHaveBeenCalledWith(
        { index: 'existing_index' },
        expect.anything()
      );

      expect(client.indices.create).not.toHaveBeenCalled();
    });
  });
});
