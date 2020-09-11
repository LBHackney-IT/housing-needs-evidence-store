import {
  DocumentMetadata,
  ElasticsearchDocumentMetadata,
  UnknownDocumentError,
} from '../domain';
import * as elasticsearch from '@elastic/elasticsearch';
import { Logger } from '../logging';

interface ElasticsearchGatewayDependencies {
  logger: Logger;
  indexName: string;
  client: elasticsearch.Client;
}

interface FindDocumentsCommand {
  metadata: Omit<DocumentMetadata, 'documentId'>;
  minimumMatchTerms?: Number;
}

export class ElasticsearchGateway {
  logger: Logger;
  indexName: string;
  client: elasticsearch.Client;

  constructor({ logger, indexName, client }: ElasticsearchGatewayDependencies) {
    this.logger = logger;
    this.indexName = indexName;
    this.client = client;

    this.createIndex();
  }

  createIndex(): void {
    this.client.cat.indices({ index: this.indexName }, (err, resp) => {
      if (resp.statusCode !== 200) {
        this.client.indices.create({ index: this.indexName }, (err, resp) => {
          if (err)
            this.logger
              .error(err)
              .log(`[elasticsearch] index "${this.indexName}" was not created`);
          else
            this.logger.log(
              `[elasticsearch] index "${this.indexName}" was created`
            );
        });
      }
    });
  }

  async index(metadata: DocumentMetadata): Promise<void> {
    this.logger
      .mergeContext({ indexName: this.indexName })
      .log('[elasticsearch] indexing document');

    await this.client.index({
      index: this.indexName,
      id: metadata.documentId,
      body: metadata,
    });
  }

  async getByDocumentId(documentId: string): Promise<DocumentMetadata> {
    this.logger
      .mergeContext({
        indexName: this.indexName,
        documentId,
      })
      .log('[elasticsearch] getting document metadata');

    const metadata = await this.client.get({
      id: documentId,
      index: this.indexName,
    });

    this.logger
      .mergeContext({ esGetResponse: metadata })
      .log('elasticsearch returned response');

    if (!metadata.body.found) {
      throw new UnknownDocumentError(documentId);
    }

    return metadata.body._source;
  }

  async deleteByDocumentId(documentId: string): Promise<void> {
    this.logger
      .mergeContext({
        indexName: this.indexName,
        documentId,
      })
      .log('[elasticsearch] deleting document metadata');

    try {
      const response = await this.client.delete({
        id: documentId,
        index: this.indexName,
      });

      this.logger
        .mergeContext({ esDeleteResponse: response })
        .log('[elasticsearch] delete completed');
    } catch (err) {
      this.logger.error(err);

      if (err.meta && err.meta.statusCode === 404) {
        this.logger.log('ignoring 404, already deleted');
      } else {
        throw err;
      }
    }
  }

  async findDocuments({
    metadata,
    minimumMatchTerms,
  }: FindDocumentsCommand): Promise<ElasticsearchDocumentMetadata[]> {
    this.logger
      .mergeContext({ indexName: this.indexName })
      .log('[elasticsearch] find documents');

    const conditionsArray = Object.entries(metadata)
      .map(([key, value]) => {
        return Array.isArray(value)
          ? value.map((v) => ({ match: { [key]: v } }))
          : { match: { [key]: value } };
      })
      .flat();

    const searchParams = {
      index: this.indexName,
      size: 100,
      body: {
        query: {
          bool: {
            should: conditionsArray,
            minimum_should_match: minimumMatchTerms ? minimumMatchTerms : 1,
          },
        },
      },
    };

    const response = await this.client.search(searchParams);

    const documentHits = response.body.hits.hits;

    this.logger
      .mergeContext({ esSearchResult: documentHits })
      .log('[elasticsearch] find documents complete');

    const unfilteredHits = documentHits.map((doc) => {
      return {
        documentId: doc._id,
        index: doc._index,
        metadata: doc._source,
        score: doc._score,
      };
    });

    const checkMatch = (a, b) => {
      if (!Array.isArray(a)) a = [a];
      if (!Array.isArray(b)) b = [b];

      let intersection = a.filter((x) => b.includes(x));

      return intersection.length > 0;
    };
    const filteredHits = unfilteredHits.filter((doc) => {
      let match = false;
      Object.entries(metadata).map(([key, value]) => {
        if (doc.metadata[key] && checkMatch(value, doc.metadata[key])) {
          match = true;
        }
      });
      return match;
    });
    return filteredHits;
  }
}
