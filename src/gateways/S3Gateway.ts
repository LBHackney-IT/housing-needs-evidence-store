import * as AWS from 'aws-sdk';
import { DocumentMetadata } from '../domain';
import { Logger } from '../logging';

interface S3GatewayDependencies {
  logger: Logger;
  client: AWS.S3;
  bucketName: string;
}

export class S3Gateway {
  logger: Logger;
  client: AWS.S3;
  bucketName: string;

  constructor({ logger, client, bucketName }: S3GatewayDependencies) {
    this.logger = logger;
    this.client = client;
    this.bucketName = bucketName;
  }

  async create(metadata: DocumentMetadata): Promise<DocumentMetadata> {
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
            { 'X-Amz-Server-Side-Encryption': 'AES256' },
            ['starts-with', '$X-Amz-Meta-Description', ''],
          ],
        },
        (err, data) => {
          if (err) {
            this.logger
              .error(err)
              .log('Failed generating pre-signed upload url');
            return reject(err);
          }

          return resolve(data);
        }
      );
    });
  }

  async get(documentId: string): Promise<DocumentMetadata> {
    const object = await this.client
      .getObject({
        Bucket: this.bucketName,
        Key: `${documentId}/metadata.json`,
      })
      .promise();

    return JSON.parse(object.Body.toString());
  }

  async deleteByDocumentId(documentId: string): Promise<void> {
    this.logger
      .mergeContext({ documentId })
      .log('[s3] removing all objects associated with id');

    const listing = await this.client.listObjects({
      Bucket: this.bucketName,
      Prefix: `${documentId}/`,
      MaxKeys: 2, // safeguard against bad prefixes
    }).promise();

    this.logger
      .mergeContext({
        bucketPrefix: listing.Prefix,
        matchesFoundInBucket: (listing.Contents || []).length,
      }).log('[s3] found objects in bucket with prefix');

    const keys = listing.Contents.map(object => object.Key);

    if (keys.length > 0) {
      await this.client.deleteObjects({
        Bucket: this.bucketName,
        Delete: {
          Objects: keys.map(key => ({ Key: key }))
        }
      }).promise();
    }

    this.logger.log('[s3] deleted objects in bucket');
  }

  async createDownloadUrl(key: string, expiresIn: number): Promise<string> {
    this.logger
      .mergeContext({
        key,
        expiresIn,
      })
      .log('creating S3 signed url');

    return await this.client.getSignedUrlPromise('getObject', {
      Bucket: this.bucketName,
      Key: key,
      Expires: expiresIn,
    });
  }

  async getObjectMetadata(key: string): Promise<Record<string, string>> {
    const metadata = await this.client
      .headObject({
        Bucket: this.bucketName,
        Key: key,
      })
      .promise();

    return metadata.Metadata || {};
  }
}
