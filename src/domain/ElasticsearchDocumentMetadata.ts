import { DocumentMetadata } from './DocumentMetadata';

export interface ElasticsearchDocumentMetadata {
  documentId: string;
  index: string;
  score: number;
  metadata: DocumentMetadata;
}
