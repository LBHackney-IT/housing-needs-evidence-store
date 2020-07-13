import { DocumentMetadata } from '../domain';
import { S3Gateway } from '../gateways';
import { UseCase } from './UseCase';

interface SaveMetadataDependencies {
  s3Gateway: S3Gateway;
  createDocumentId: () => string;
}

interface SaveMetadataCommand {
  metadata: Omit<DocumentMetadata, 'documentId'>;
}

interface SaveMetadataResult {
  documentId: string;
  url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: { [key: string]: any }
}

export default class SaveMetadataUseCase implements UseCase<SaveMetadataCommand, SaveMetadataResult> {
  s3Gateway: S3Gateway;
  createDocumentId: () => string;

  constructor({
    s3Gateway,
    createDocumentId
  }: SaveMetadataDependencies) {
    this.s3Gateway = s3Gateway;
    this.createDocumentId = createDocumentId;
  }

  async execute({ metadata }: SaveMetadataCommand): Promise<SaveMetadataResult> {
    const created = await this.s3Gateway.create({
      documentId: this.createDocumentId(),
      ...metadata
    });

    const { url, fields } = await this.s3Gateway.createUrl(created.documentId);

    return {
      documentId: created.documentId,
      url,
      fields,
    };
  }
}
