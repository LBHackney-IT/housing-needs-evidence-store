export class UnknownDocumentError extends Error {
  constructor(documentId: string) {
    super(`No document with id "${documentId}"`);
    this.name = 'UnknownDocumentError';
    Object.setPrototypeOf(this, UnknownDocumentError.prototype);
  }
}
