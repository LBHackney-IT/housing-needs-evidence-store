import { DocumentMetadata } from './DocumentMetadata';

export interface ElasticsearchDocumentsMetadata {
  documentId: string;
  index: string;
  score: number;
  metadata: DocumentMetadata;
}
