import AWS from 'aws-sdk';

interface Metadata {
  [key: string]: any
}

class S3Gateway {
  client: AWS.S3;
  bucketName: string;
  constructor(client: AWS.S3, bucketName: string) {
    this.client = client;
    this.bucketName = bucketName;
  }

  async create(metadata: Metadata): Promise<Metadata> {
    this.client.putObject(
      {
        Bucket: this.bucketName,
        Key: `${metadata.documentId}/${metadata.documentId}.json`,
        Body: Buffer.from(JSON.stringify(metadata)),
      },
      (err) => {
        console.log(err);
      }
    );
    return metadata;
  }

  async createUrl(documentId: string): Promise<{url: string, fields: {[key: string]: any}}> {
    return new Promise((resolve, reject) => {
      this.client.createPresignedPost(
        {
          Bucket: this.bucketName,
          Expires: 3600,
          Fields: {
            // success_action_redirect: `http://localhost:3000/${documentId}`,
            success_action_status: '201',
          },
          Conditions: [
            { bucket: this.bucketName },
            ['starts-with', '$key', `${documentId}/${documentId}`],
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
}

export default S3Gateway;