import { UseCase } from './UseCase';
import { DocumentMetadata } from '../domain';
import { ElasticsearchGateway } from '../gateways';

interface GetMetadataDependencies {
  elasticsearchGateway: ElasticsearchGateway;
}

interface GetIndexedMetadataQuery {
  documentId: string;
}

export default class GetIndexedMetadataUseCase implements UseCase<GetIndexedMetadataQuery, DocumentMetadata> {
  es: ElasticsearchGateway;

  constructor({ elasticsearchGateway }: GetMetadataDependencies) {
    this.es = elasticsearchGateway;
  }

  async execute({ documentId }: GetIndexedMetadataQuery): Promise<DocumentMetadata> {
    const metadata = await this.es.getByDocumentId(documentId);
    return metadata;
  }
}
