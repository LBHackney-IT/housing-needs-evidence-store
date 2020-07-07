import S3Gateway from '../gateways/S3-Gateway';

class GetMetadata {
  s3Gateway: S3Gateway;
  constructor(s3Gateway: S3Gateway) {
    this.s3Gateway = s3Gateway;
  }

  async execute(documentId: string): Promise<{ [key: string]: string }> {
    return this.s3Gateway.get(documentId);
  }
}

export default GetMetadata;
