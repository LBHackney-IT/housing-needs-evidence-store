import dependencies from '../dependencies';
import { createEndpoint as createGetDocumentContents } from './get-document-contents';
import { createEndpoint as createDeleteDocument } from './delete-document';

const getDocumentContents = createGetDocumentContents({
  logger: dependencies.logger,
  createDownloadUrl: dependencies.createDownloadUrl,
  getMetadata: dependencies.getIndexedMetadata,
});

const deleteDocument = createDeleteDocument({
  logger: dependencies.logger,
  deleteDocument: dependencies.deleteDocument,
});

export { deleteDocument };
export { getDocumentContents };
export { default as health } from './health';
export { default as saveMetadata } from './save-metadata';
export { default as getMetadata } from './get-metadata';
export { default as findDocuments } from './find-documents';
export { default as getPresignedUploadUrl } from './get-presigned-upload-url';
