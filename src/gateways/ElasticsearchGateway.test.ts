import * as elasticsearch from '@elastic/elasticsearch';
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
      delete: jest.fn(() =>
        Promise.resolve({
          body: {
            result: 'deleted',
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

  describe('#deleteByDocumentId', () => {
    it('deletes from the Elasticsearch index', async () => {
      await gateway.deleteByDocumentId(metadata.documentId);

      expect(client.delete).toHaveBeenCalledWith(
        expect.objectContaining({
          index: indexName,
          id: metadata.documentId,
        })
      );
    });

    describe('when there is an error', () => {
      const error = new Error('Failed to delete');

      it('bubbles up errors', async () => {
        (client.delete as jest.Mock).mockImplementation(() => {
          throw error;
        });

        await expect(
          gateway.deleteByDocumentId(metadata.documentId)
        ).rejects.toThrow(error);
      });
    });
  });

  describe('#findDocument', () => {
    it('searches for document in elasticSearch using metadata', async () => {
      const expectedRequest = {
        index: indexName,
        size: 100,
        body: {
          query: {
            bool: {
              should: [
                { match: { documentId: 'gs523ad' } },
                { match: { ey: 'value' } },
              ],
              minimum_should_match: 1,
            },
          },
        },
      };

      await gateway.findDocuments({ metadata });

      expect(client.search).toHaveBeenCalledWith(expectedRequest);
    });

    it('flattens metadata arrays into multiple match terms', async () => {
      const expectedRequest = {
        index: indexName,
        size: 100,
        body: {
          query: {
            bool: {
              should: [
                { match: { documentId: 'doc1' } },
                { match: { data: 'data1' } },
                { match: { data: 'data2' } },
              ],
              minimum_should_match: 1,
            },
          },
        },
      };

      await gateway.findDocuments({
        metadata: { documentId: 'doc1', data: ['data1', 'data2'] },
      });

      expect(client.search).toHaveBeenCalledWith(expectedRequest);
    });

    it('can set a minumum number of match terms', async () => {
      const expectedRequest = expect.objectContaining({
        body: {
          query: { bool: expect.objectContaining({ minimum_should_match: 2 }) },
        },
      });

      await gateway.findDocuments({
        metadata: { data: ['data1', 'data2'] },
        minimumMatchTerms: 2,
      });

      expect(client.search).toHaveBeenCalledWith(expectedRequest);
    });

    it('filters out bad matches', async () => {
      const result = await gateway.findDocuments({
        metadata: { name: '123' },
      });

      expect(result).toEqual([
        {
          documentId: '1',
          index: 'documents',
          metadata: { name: '123' },
          score: 0.5,
        },
      ]);
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
