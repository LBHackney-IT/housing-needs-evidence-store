import AWS from 'aws-sdk';
import { nanoid } from 'nanoid';
import elasticsearch from '@elastic/elasticsearch';
import { console, Logger } from './logging';
import { S3Gateway, ElasticsearchGateway } from './gateways';
import {
  IndexDocument,
  GetMetadata,
  SaveMetadata,
  FindDocuments,
  CreateDownloadUrl,
} from './use-cases';
import GetIndexedMetadataUseCase from './use-cases/GetIndexedMetadata';

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
      bucketName: process.env.BUCKET_NAME,
    };
  }

  get s3Gateway() {
    return new S3Gateway({
      logger: this.logger,
      client: new AWS.S3(),
      bucketName: this.configuration.bucketName,
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
      s3Gateway: this.s3Gateway,
      createDocumentId: () => nanoid(6),
    });
  }

  get getMetadata() {
    return new GetMetadata({
      s3Gateway: this.s3Gateway,
    });
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
      elasticsearchGateway: this.elasticsearchGateway,
    });
  }

  get findDocuments() {
    return new FindDocuments({
      elasticsearchGateway: this.elasticsearchGateway,
    });
  }

  get getIndexedMetadata() {
    return new GetIndexedMetadataUseCase({
      elasticsearchGateway: this.elasticsearchGateway,
    });
  }

  get createDownloadUrl() {
    return new CreateDownloadUrl({
      logger: this.logger,
      s3Gateway: this.s3Gateway,
    });
  }
}

export default new DefaultContainer();
