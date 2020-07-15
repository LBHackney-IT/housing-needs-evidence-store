import { DocumentMetadata } from '../domain';
import { ElasticsearchGateway } from '../gateways';
import { UseCase } from './UseCase';

interface FindDocumentsDependencies {
  elasticsearchGateway: ElasticsearchGateway;
}

interface FindDocumentsCommand {
  metadata: DocumentMetadata;
}

interface FindDocumentsResult {
  documents: string[];
}

export default class FindDocumentsUseCase
  implements UseCase<FindDocumentsCommand, FindDocumentsResult> {
  elasticsearchGateway: ElasticsearchGateway;

  constructor({ elasticsearchGateway }: FindDocumentsDependencies) {
    this.elasticsearchGateway = elasticsearchGateway;
  }

  async execute({
    metadata,
  }: FindDocumentsCommand): Promise<FindDocumentsResult> {
    const documents = await this.elasticsearchGateway.findDocuments(metadata);

    return documents;
  }
}
