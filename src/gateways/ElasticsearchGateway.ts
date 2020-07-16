import { DocumentMetadata } from '../domain';
import elasticsearch from '@elastic/elasticsearch';
import { Logger } from '../logging';
import { ElasticsearchDocumentsMetadata } from '../domain/ElasticsearchDocumentsMetadata';

interface ElasticsearchGatewayDependencies {
  logger: Logger;
  indexName: string;
  client: elasticsearch.Client;
}

interface FindDocumentMetadata {
  metadata: Omit<DocumentMetadata, 'documentId'>;
}

export class ElasticsearchGateway {
  logger: Logger;
  indexName: string;
  client: elasticsearch.Client;

  constructor({ logger, indexName, client }: ElasticsearchGatewayDependencies) {
    this.logger = logger;
    this.indexName = indexName;
    this.client = client;
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

  async findDocuments({
    metadata,
  }: FindDocumentMetadata): Promise<ElasticsearchDocumentsMetadata[]> {
    this.logger
      .mergeContext({ indexName: this.indexName })
      .log('[elasticsearch] searching documents');

    const conditionsArray = Object.entries(metadata).map(([key, value]) => ({
      match: { [key]: value },
    }));

    const response = await this.client.search({
      index: this.indexName,
      body: {
        query: {
          bool: {
            must: conditionsArray,
          },
        },
      },
    });

    const documentHits = response.body.hits.hits;

    const documents = documentHits.map((doc) => {
      return {
        documentId: doc._id,
        index: doc._index,
        metadata: doc._source,
        score: doc._score,
      };
    });

    return { documents };
  }
}
