import EvidenceStoreClient from './EvidenceStoreClient';
const baseUrl = process.env.INTEGRATION_TEST_BASE_URL;
const jwt = process.env.INTEGRATION_TEST_JWT;

if (typeof baseUrl !== 'string') {
  console.info([
    '[!] Using default integration test configuration.',
    'Defaulting to http://localhost:5050, set "INTEGRATION_TEST_BASE_URL".'
  ].join('\n'));
}

if (typeof jwt !== 'string') {
  console.info([
    '[!] There is no JWT set, requests will be sent without authorization.',
    'This is probably fine locally, if you see this in CI set "INTEGRATION_TEST_JWT".'
  ].join('\n'));
}

export default new EvidenceStoreClient({
  baseUrl: baseUrl ?? 'http://localhost:5050',
  authorizationToken: jwt
});
