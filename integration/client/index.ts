import EvidenceStoreClient from './EvidenceStoreClient';
const baseUrl = process.env.INTEGRATION_TEST_BASE_URL;

if (typeof baseUrl !== 'string') {
  console.info([
    '[!] Using default integration test configuration.',
    'Defaulting to http://localhost:5050, set "INTEGRATION_TEST_BASE_URL".'
  ].join('\n'));
}

export default new EvidenceStoreClient({
  baseUrl: baseUrl ?? 'http://localhost:5050',
});
