import { UseCase } from './UseCase';
import { DocumentMetadata } from '../domain';
import { S3Gateway } from '../gateways';

interface GetMetadataDependencies {
  s3Gateway: S3Gateway;
}

interface GetMetadataQuery {
  documentId: string;
}

export default class GetMetadataUseCase implements UseCase<GetMetadataQuery, DocumentMetadata> {
  metadata: S3Gateway;

  constructor({ s3Gateway }: GetMetadataDependencies) {
    this.metadata = s3Gateway;
  }

  async execute({ documentId }: GetMetadataQuery): Promise<DocumentMetadata> {
    return await this.metadata.get(documentId);
  }
}
