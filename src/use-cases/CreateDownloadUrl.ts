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
  logger: Logger;
  storage: S3Gateway;

  constructor({ logger, s3Gateway }: CreateDownloadUrlDependencies) {
    this.logger = logger;
    this.storage = s3Gateway;
  }

  async execute({
    filename,
    documentId,
  }: CreateDownloadUrlCommand): Promise<CreateDownloadUrlResponse> {
    this.logger
      .mergeContext({
        filename,
        documentId,
      })
      .log('creating temporary download url');

    const downloadUrl = await this.storage.createDownloadUrl(
      `${documentId}/${filename}`,
      900
    );

    return { downloadUrl };
  }
}
