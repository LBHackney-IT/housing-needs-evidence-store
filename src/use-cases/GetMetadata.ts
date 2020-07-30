import { UseCase } from './UseCase';
import { DocumentMetadata } from '../domain';
import { S3Gateway } from '../gateways';

interface GetMetadataDependencies {
  s3Gateway: S3Gateway;
}

interface GetMetadataQuery {
  documentId: string;
  objectKey: string;
}

export default class GetMetadataUseCase
  implements UseCase<GetMetadataQuery, DocumentMetadata> {
  metadata: S3Gateway;

  constructor({ s3Gateway }: GetMetadataDependencies) {
    this.metadata = s3Gateway;
  }

  async execute({
    documentId,
    objectKey,
  }: GetMetadataQuery): Promise<DocumentMetadata> {
    const [objectMetadata, predefinedMetadata] = await Promise.all([
      this.metadata.getObjectMetadata(objectKey),
      this.metadata.get(documentId),
    ]);

    return {
      ...objectMetadata,
      ...predefinedMetadata,
    };
  }
}
