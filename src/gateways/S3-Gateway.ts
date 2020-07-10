import AWS from 'aws-sdk';
import Metadata from '../interfaces/Metadata';

class S3Gateway {
  client: AWS.S3;
  bucketName: string;
  constructor(client: AWS.S3, bucketName: string) {
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
            ['starts-with', '$key', `${documentId}/metadata`],
            { 'X-Amz-Server-Side-Encryption': 'AES256' },
            ['starts-with', '$X-Amz-Meta-Description', ''],
            ['content-length-range', 1, 1024],
          ],
        },
        (err, data) => {
          if (err) {
            console.log('Failed generating pre-signed upload url', {
              error: err,
            });

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

export default S3Gateway;
