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

    this.createIndex();
  }

  createIndex() {
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
}
