import AWS from 'aws-sdk';
import { nanoid } from 'nanoid';
import elasticsearch from '@elastic/elasticsearch';
import { console, Logger } from './logging';
import { S3Gateway, ElasticsearchGateway } from './gateways';
import { IndexDocument, GetMetadata, SaveMetadata } from './use-cases';

export interface Container {
  logger: Logger;
  indexDocument: IndexDocument;
  elasticsearchGateway: ElasticsearchGateway;
  getMetadata: GetMetadata;
}

export interface Configuration {
  esClientEndpoint: string;
  esDocumentsIndex: string;
}

class DefaultContainer implements Container {
  get logger() {
    return console;
  }

  get configuration() {
    return {
      esClientEndpoint: process.env.ES_CLIENT_ENDPOINT,
      esDocumentsIndex: process.env.ES_INDEX_NAME,
    };
  }

  get s3Gateway() {
    return new S3Gateway({
      logger: this.logger,
      client: new AWS.S3()
    });
  }

  get elasticsearchGateway() {
    return new ElasticsearchGateway({
      logger: this.logger,
      client: this.elasticsearch,
      indexName: this.configuration.esDocumentsIndex,
    });
  }

  get saveMetadata() {
    return new SaveMetadata({
      logger: this.logger,
      gateway: this.s3Gateway,
      createDocumentId: () => nanoid(6),
    });
  }

  get getMetadata() {
    return new GetMetadata({
      logger: this.logger,
      gateway: this.s3Gateway,
    })
  }

  get elasticsearch() {
    return new elasticsearch.Client({
      node: this.configuration.esClientEndpoint,
    });
  }

  get indexDocument() {
    return new IndexDocument({
      logger: this.logger,
      getMetadata: this.getMetadata,
      elasticsearchGateway: this.elasticsearchGateway
    });
  }
}

export default new DefaultContainer();
