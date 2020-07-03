import S3Gateway from '../gateways/S3Gateway'

class SaveMetadata {
  S3Gateway: S3Gateway
  constructor({ S3Gateway }) {
    this.S3Gateway = S3Gateway;
  }

  async execute({metadata}) {
    await this.S3Gateway.create(metadata);
  }
}

export default SaveMetadata;