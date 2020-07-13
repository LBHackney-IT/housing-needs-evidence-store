import { DocumentMetadata } from '../domain';
import { ElasticSearchGateway } from '../gateways';
import { UseCase } from './UseCase';

interface SaveFindDocumentsDependencies {
  elasticSearchGateway: ElasticSearchGateway;
}

interface FindDocumentsCommand {
  metadata: DocumentMetadata;
}

interface FindDocumentsResult {
  documents: [string];
}

export default class FindDocumentsUseCase
  implements UseCase<FindDocumentsCommand, FindDocumentsResult> {
  elasticSearchGateway: ElasticSearchGateway;

  constructor({ elasticSearchGateway }: SaveFindDocumentsDependencies) {
    this.elasticSearchGateway = elasticSearchGateway;
  }

  async execute({
    metadata,
  }: FindDocumentsCommand): Promise<FindDocumentsResult> {
    const documents = await this.elasticSearchGateway.findDocuments(metadata);

    return documents;
  }
}
