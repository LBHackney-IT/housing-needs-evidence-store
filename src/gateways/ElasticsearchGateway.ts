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

    const response = await this.client.delete({
      id: documentId,
      index: this.indexName,
    });

    this.logger
      .mergeContext({ esDeleteResponse: response })
      .log('[elasticsearch] delete completed');
  }

  async findDocuments({
    metadata,
  }: FindDocumentMetadata): Promise<ElasticsearchDocumentMetadata[]> {
    this.logger
      .mergeContext({ indexName: this.indexName })
      .log('[elasticsearch] searching documents');

    const conditionsArray = Object.entries(metadata).map(([key, value]) => {
      const esKey = Array.isArray(value) ? 'terms' : 'match';
      return { [esKey]: { [key]: value } };
    });

    const query = {
      bool: {
        must: conditionsArray,
      },
    };

    const response = await this.client.search({
      index: this.indexName,
      body: {
        query,
      },
    });

    const documentHits = response.body.hits.hits;

    const documents = documentHits.map(doc => {
      return {
        documentId: doc._id,
        index: doc._index,
        metadata: doc._source,
        score: doc._score,
      };
    });

    return documents;
  }
}
