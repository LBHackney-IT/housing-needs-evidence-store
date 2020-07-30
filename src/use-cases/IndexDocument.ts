import { UseCase } from './UseCase';
import { GetMetadata } from '.';
import { ElasticsearchGateway } from '../gateways';
import { Logger } from '../logging';
import { UnknownDocumentError } from '../domain';

interface IndexDocumentDependencies {
  logger: Logger;
  getMetadata: GetMetadata;
  elasticsearchGateway: ElasticsearchGateway;
}

interface IndexDocumentCommand {
  documentId: string;
  filename: string;
  objectKey: string;
}

export default class IndexDocumentUseCase
  implements UseCase<IndexDocumentCommand, void> {
  logger: Logger;
  getMetadata: GetMetadata;
  es: ElasticsearchGateway;

  constructor({
    logger,
    getMetadata,
    elasticsearchGateway,
  }: IndexDocumentDependencies) {
    this.logger = logger;
    this.getMetadata = getMetadata;
    this.es = elasticsearchGateway;
  }

  async execute({ documentId, filename, objectKey }: IndexDocumentCommand): Promise<void> {
    this.logger
      .mergeContext({ documentId, filename, objectKey })
      .log('indexing document');

    try {
      const metadata = await this.getMetadata.execute({
        documentId,
        objectKey
      });

      await this.es.index({ ...metadata, filename });
    } catch (err) {
      this.logger.error(err).log('indexing failed');
      throw new UnknownDocumentError(documentId);
    }
  }
}
