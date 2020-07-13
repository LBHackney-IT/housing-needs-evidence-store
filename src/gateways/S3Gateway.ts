import AWS from 'aws-sdk';
import Metadata from '../interfaces/Metadata';
import { Logger } from "../logging";

interface S3GatewayDependencies {
  logger: Logger;
  client: AWS.S3;
  bucketName: string;
}

export class S3Gateway {
  logger: Logger;
  client: AWS.S3;
  bucketName: string;

  constructor({
    logger,
    client,
    bucketName
  }: S3GatewayDependencies) {
    this.logger = logger;
    this.client = client;
    this.bucketName = bucketName;
  }

  async create(metadata: Metadata): Promise<Metadata> {
    await this.client
      .putObject({
        Bucket: this.bucketName,
        Key: `${metadata.documentId}/metadata.json`,
        Body: Buffer.from(JSON.stringify(metadata)),
      })
      .promise();

    return metadata;
  }

  async createUrl(
    documentId: string
  ): Promise<{ url: string; fields: { [key: string]: any } }> {
    return new Promise((resolve, reject) => {
      this.client.createPresignedPost(
        {
          Bucket: this.bucketName,
          Expires: 3600,
          Fields: {
            success_action_status: '201',
          },
          Conditions: [
            { bucket: this.bucketName },
            ['starts-with', '$key', `${documentId}/`],
            { 'X-Amz-Server-Side-Encryption': 'AES256' }
          ],
        },
        (err, data) => {
          if (err) {
            this.logger.error(err).log('Failed generating pre-signed upload url');
            return reject(err);
          }

          return resolve(data);
        }
      );
    });
  }

  async get(documentId: string): Promise<Metadata> {
    const object = await this.client
      .getObject({
        Bucket: this.bucketName,
        Key: `${documentId}/metadata.json`,
      })
      .promise();

    return JSON.parse(object.Body.toString());
  }
}
