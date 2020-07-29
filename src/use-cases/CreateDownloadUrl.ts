import { UseCase } from './UseCase';
import { S3Gateway } from '../gateways';
import { Logger } from '../logging';

interface CreateDownloadUrlDependencies {
  logger: Logger;
  s3Gateway: S3Gateway;
}

interface CreateDownloadUrlCommand {
  filename: string;
  documentId: string;
}

interface CreateDownloadUrlResponse {
  downloadUrl: string;
}

export default class CreateDownloadUrlUseCase
  implements UseCase<CreateDownloadUrlCommand, CreateDownloadUrlResponse> {
  metadata: S3Gateway;

  constructor({ s3Gateway }: CreateDownloadUrlDependencies) {
    this.metadata = s3Gateway;
  }

  async execute({
    filename,
    documentId
  }: CreateDownloadUrlCommand): Promise<CreateDownloadUrlResponse> {
    return { downloadUrl: '' }; // todo!
  }
}
