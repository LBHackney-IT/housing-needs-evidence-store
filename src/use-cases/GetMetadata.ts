import { UseCase } from './UseCase';
import { DocumentMetadata } from '../domain';

interface GetMetadataQuery {
  documentId: string;
}

export default class GetMetadataUseCase implements UseCase<GetMetadataQuery, void> {
  async execute({ documentId }: GetMetadataQuery): Promise<DocumentMetadata> {
    // this is a placeholder for the use case from another PR...
    return Promise.resolve(null);
  }
}
