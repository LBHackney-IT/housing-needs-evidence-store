import dependencies from '../dependencies';
import { createEndpoint as createGetDocumentContents } from './get-document-contents';

const getDocumentContents = createGetDocumentContents({
  logger: dependencies.logger,
  createDownloadUrl: dependencies.createDownloadUrl,
  getMetadata: dependencies.getIndexedMetadata,
});

export { getDocumentContents };
export { default as health } from './health';
export { default as saveMetadata } from './save-metadata';
export { default as getMetadata } from './get-metadata';
export { default as findDocuments } from './find-documents';
