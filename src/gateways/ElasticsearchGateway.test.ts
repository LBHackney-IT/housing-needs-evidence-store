import elasticsearch from '@elastic/elasticsearch';
import { NoOpLogger } from '../logging/NoOpLogger';
import { ElasticsearchGateway } from './ElasticsearchGateway';

describe('ElasticsearchGateway', () => {
  const indexName = 'documents';
  const metadata = { documentId: 'gs523ad', ey: 'value' };

  let client: elasticsearch.Client;
  let gateway: ElasticsearchGateway;

  beforeEach(() => {
    const elasticSearchResponse = {
      body: {
        hits: {
          hits: [
            {
              _index: 'documents',
              _id: '1',
              _score: 0.5,
              _source: { name: '123' },
            },
            {
              _index: 'documents',
              _id: '2',
              _score: 0.9,
              _source: { name: 'abc' },
            },
          ],
        },
      },
    };

    client = ({
      index: jest.fn(() => Promise.resolve()),
      get: jest.fn(() =>
        Promise.resolve({
          body: {
            found: true,
            _source: metadata,
          },
        })
      ),
      search: jest.fn(() => Promise.resolve(elasticSearchResponse)),
      cat: {
        indices: jest.fn((index, callback) => {
          const statusCode = index.index === 'new_index' ? 404 : 200;
          callback(null, { statusCode });
        }),
      },
      indices: { create: jest.fn() },
    } as unknown) as elasticsearch.Client;

    gateway = new ElasticsearchGateway({
      client,
      indexName,
      logger: new NoOpLogger(),
    });
  });

  describe('#getByDocumentId', () => {
    it('retrieves the metadata from Elasticsearch using the document id', async () => {
      const document = await gateway.getByDocumentId(metadata.documentId);
      expect(document).toStrictEqual(metadata);
    });

    it('returns an error if the requested document could not be found', async () => {
      (client.get as jest.Mock).mockImplementation(
        jest.fn(() =>
          Promise.resolve({
            body: {
              found: false,
            },
          })
        )
      );

      await expect(
        gateway.getByDocumentId(metadata.documentId)
      ).rejects.toThrow();
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
  describe('#findDocument', () => {
    it('searches for document in elasticSearch using metadata', async () => {
      const result = await gateway.findDocuments({ metadata });

      const expectedRequest = {
        index: indexName,
        body: {
          query: {
            bool: {
              must: [
                { match: { documentId: 'gs523ad' } },
                { match: { ey: 'value' } },
              ],
            },
          },
        },
      };

      const expectedResponse = {
        documents: [
          {
            documentId: '1',
            index: 'documents',
            score: 0.5,
            metadata: {
              name: '123',
            },
          },
          {
            documentId: '2',
            index: 'documents',
            score: 0.9,
            metadata: {
              name: 'abc',
            },
          },
        ],
      };

      expect(client.search).toHaveBeenCalledWith(expectedRequest);
      expect(result).toStrictEqual(expectedResponse);
    });

    describe('when there is an error', () => {
      const error = new Error('Something bad happened');

      it('bubbles up errors', async () => {
        (client.search as jest.Mock).mockImplementation(() => {
          throw error;
        });

        await expect(gateway.findDocuments({ metadata })).rejects.toThrow(
          error
        );
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
  });
});
