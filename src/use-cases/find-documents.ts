import ElasticSearchGateway from '../gateways/ElasticSearchGateway';
import Metadata from '../interfaces/Metadata';

class FindDocuments {
  elasticSearchGateway: ElasticSearchGateway;
  constructor(elasticSearchGateway: ElasticSearchGateway) {
    this.elasticSearchGateway = elasticSearchGateway;
  }

  async execute(metadata: Metadata): Promise<{ [key: string]: string }> {
    return this.elasticSearchGateway.findDocuments(metadata);
  }
}

export default FindDocuments;
