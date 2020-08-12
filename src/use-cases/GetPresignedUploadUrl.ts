import { S3Gateway } from '../gateways';
import { UseCase } from './UseCase';

interface GetPresignedUploadUrlDependencies {
  s3Gateway: S3Gateway;
}

interface GetPresignedUploadUrlResult {
  documentId: string;
  url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: { [key: string]: any };
}

interface GetPresignedUploadUrlParams {
  documentId: string;
}

export default class GetPresignedUploadUrlUseCase
  implements UseCase<GetPresignedUploadUrlParams, GetPresignedUploadUrlResult> {
  s3Gateway: S3Gateway;

  constructor({ s3Gateway }: GetPresignedUploadUrlDependencies) {
    this.s3Gateway = s3Gateway;
  }

  async execute({
    documentId,
  }: GetPresignedUploadUrlParams): Promise<GetPresignedUploadUrlResult> {
    const { url, fields } = await this.s3Gateway.createUrl(documentId);

    return {
      documentId,
      url,
      fields,
    };
  }
}
