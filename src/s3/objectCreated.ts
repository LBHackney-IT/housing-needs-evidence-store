import { S3CreateEvent, S3Handler } from 'aws-lambda';
import dependencies, { Container } from '../dependencies';

const isMetadataFile = (key: string) => key.endsWith('.json');
const getDocumentIdFromKey = (key: string) => key.split('/')[0];

const createHandler: (container: Container) => S3Handler = (container: Container) => {
  const {
    logger,
    indexDocument: indexer,
  } = container;

  return async (event: S3CreateEvent, context) => {
    logger.mergeContext({
      records: event.Records.length,
      awsRequestId: context.awsRequestId,
    }).log('handling S3 trigger');

    const { Records: records } = event;

    for (const record of records) {
      const { s3: { object: { key } } } = record;
      logger.mergeContext({ key, bucket: record.s3.bucket });

      if (!isMetadataFile(key)) {
        try {
          logger.log('indexing');
          await indexer.execute({ documentId: getDocumentIdFromKey(key) });
          logger.log('successfully indexed');
        } catch (err) {
          logger.error(err);
        }
      } else {
        logger.log('stopped, looks like a metadata file');
      }
    }
  };
}

const handler = createHandler(dependencies);
export { handler, createHandler };
