import { UseCase } from './UseCase';

interface IndexDocumentCommand {
  documentId: string;
}

export default class IndexDocumentUseCase implements UseCase<IndexDocumentCommand, void> {
  execute: (request: IndexDocumentCommand) => void | Promise<void>;
}
