import S3Gateway from '../gateways/S3-Gateway'

class SaveMetadata {
  s3Gateway: S3Gateway
  createDocumentId: () => string
  constructor(s3Gateway, createDocumentId) {
    this.s3Gateway = s3Gateway;
    this.createDocumentId = createDocumentId;
  }

  async execute(metadata) {
    metadata.documentId = this.createDocumentId();
    await this.s3Gateway.create(metadata);

    const { url, fields } = await this.s3Gateway.createUrl(metadata.documentId);

    return {
      documentId: metadata.documentId,
      url,
      fields,
    };
  }
}

export default SaveMetadata;