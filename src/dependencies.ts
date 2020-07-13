import AWS from 'aws-sdk';
import { nanoid } from 'nanoid';
import { console, Logger } from './logging';
import { S3Gateway, ElasticsearchGateway } from './gateways';
import { IndexDocument, GetMetadata, SaveMetadata } from './use-cases';

export interface Container {
  logger: Logger;
  indexDocument: IndexDocument;
  elasticsearchGateway: ElasticsearchGateway;
  getMetadata: GetMetadata;
}

class DefaultContainer implements Container {
  get logger() {
    return console;
  }

  get s3Gateway() {
    return new S3Gateway({
      logger: this.logger,
      client: new AWS.S3()
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
    });
  }

  get indexDocument() {
    return new IndexDocument({
      logger: this.logger,
      getMetadata: this.getMetadata,
      elasticsearchGateway: this.elasticsearchGateway
    });
  }

  get getMetadata() {
    return new GetMetadata();
  }

  get elasticsearchGateway() {
    return new ElasticsearchGateway();
  }
}

export default new DefaultContainer();
