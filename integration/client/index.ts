import EvidenceStoreClient from './EvidenceStoreClient';
const baseUrl = process.env.INTEGRATION_TEST_BASE_URL;

if (typeof baseUrl !== 'string') {
  console.error([
    '[!] Missing integration test configuration!',
    'You must set "INTEGRATION_TEST_BASE_URL" in your environment.'
  ].join('\n'));
}

export default new EvidenceStoreClient({ baseUrl });
