import SaveMetadata from './use-cases/save-metadata';
import GetMetadata from './use-cases/get-metadata';
import S3Gateway from './gateways/S3-Gateway';
import { nanoid } from 'nanoid';
import AWS from 'aws-sdk';
import FindDocuments from './use-cases/find-documents';
import ElasticSearchGateway from './gateways/elasticSearchGateway';

const s3Client = new AWS.S3();

const s3Gateway = new S3Gateway(s3Client, process.env.BUCKET_NAME);
const saveMetadata = new SaveMetadata(s3Gateway, () => nanoid(6));

const getMetadata = new GetMetadata(s3Gateway);

const findDocuments = new FindDocuments(ElasticSearchGateway);

export { saveMetadata, getMetadata, findDocuments };
