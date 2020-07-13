import { DocumentMetadata } from '../domain';
import elasticsearch from '@elastic/elasticsearch';
import { Logger } from '../logging';

interface ElasticsearchGatewayDependencies {
  logger: Logger;
  indexName: string;
  client: elasticsearch.Client;
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

  async findDocuments(metadata: DocumentMetadata): Promise<[string]> {
    this.logger
      .mergeContext({ indexName: this.indexName })
      .log('[elasticsearch] searching documents');

    const conditionsArray = Object.entries(metadata).map((condition) => {
      return { match: Object.fromEntries([[condition[0], condition[1]]]) };
    });

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
    return response.hits.hits;
  }
}
