import { UseCase } from './UseCase';
import { ElasticsearchGateway, S3Gateway } from '../gateways';
import { Logger } from '../logging';

interface DeleteDocumentDependencies {
  logger: Logger;
  s3Gateway: S3Gateway;
  elasticsearchGateway: ElasticsearchGateway;
}

interface DeleteDocumentCommand {
  documentId: string;
}

export default class DeleteDocumentUseCase
  implements UseCase<DeleteDocumentCommand, void> {
  logger: Logger;
  contents: S3Gateway;
  es: ElasticsearchGateway;

  constructor({
    logger,
    s3Gateway,
    elasticsearchGateway,
  }: DeleteDocumentDependencies) {
    this.logger = logger;
    this.contents = s3Gateway;
    this.es = elasticsearchGateway;
  }

  async execute({ documentId }: DeleteDocumentCommand): Promise<void> {
    this.logger.mergeContext({ documentId }).log('deleting document');

    try {
      await Promise.all([
        this.es.deleteByDocumentId(documentId),
        this.contents.deleteByDocumentId(documentId),
      ]);

      this.logger.log('delete successful');
    } catch (err) {
      this.logger.error(err).log('deleting document failed');
      throw err;
    }
  }
}
