import { DocumentMetadata, ElasticsearchDocumentMetadata } from '../domain';
import { ElasticsearchGateway } from '../gateways';
import { UseCase } from './UseCase';

interface FindDocumentsDependencies {
  elasticsearchGateway: ElasticsearchGateway;
}

interface FindDocumentsCommand {
  metadata: Omit<DocumentMetadata, 'documentId'>;
  minimumMatchTerms?: Number;
}

interface FindDocumentsResult {
  documents: ElasticsearchDocumentMetadata[];
}

export default class FindDocumentsUseCase
  implements UseCase<FindDocumentsCommand, FindDocumentsResult> {
  elasticsearchGateway: ElasticsearchGateway;

  constructor({ elasticsearchGateway }: FindDocumentsDependencies) {
    this.elasticsearchGateway = elasticsearchGateway;
  }

  async execute({
    metadata,
    minimumMatchTerms,
  }: FindDocumentsCommand): Promise<FindDocumentsResult> {
    return {
      documents: await this.elasticsearchGateway.findDocuments({
        metadata,
        minimumMatchTerms,
      }),
    };
  }
}
