import { DocumentMetadata } from "../domain";

export class ElasticsearchGateway {
  index: (metadata: DocumentMetadata) => Promise<void>;
}
