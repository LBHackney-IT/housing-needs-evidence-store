import { DocumentMetadata } from '../domain';
import { S3Gateway } from '../gateways';
import { ElasticsearchGateway } from '../gateways';
import { UseCase } from './UseCase';

interface SaveMetadataDependencies {
  s3Gateway: S3Gateway;
  esGateway: ElasticsearchGateway;
  createDocumentId: () => string;
}

interface SaveMetadataCommand {
  metadata: Omit<DocumentMetadata, 'documentId'>;
}

interface SaveMetadataResult {
  documentId: string;
  url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: { [key: string]: any };
}

export default class SaveMetadataUseCase
  implements UseCase<SaveMetadataCommand, SaveMetadataResult> {
  s3Gateway: S3Gateway;
  esGateway: ElasticsearchGateway;
  createDocumentId: () => string;

  constructor({
    s3Gateway,
    createDocumentId,
    esGateway,
  }: SaveMetadataDependencies) {
    this.s3Gateway = s3Gateway;
    this.createDocumentId = createDocumentId;
    this.esGateway = esGateway;
  }

  async execute({
    metadata,
  }: SaveMetadataCommand): Promise<SaveMetadataResult> {
    const documentId = this.createDocumentId();

    const created = await this.s3Gateway.create({
      documentId,
      ...metadata,
    });

    const indexMetadata = Object.assign({}, metadata, { documentId });
    await this.esGateway.index(indexMetadata as DocumentMetadata);

    const { url, fields } = await this.s3Gateway.createUrl(created.documentId);

    return {
      documentId: created.documentId,
      url,
      fields,
    };
  }
}
