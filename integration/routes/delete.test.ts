import client from '../client';

describe('POST /{documentId}', () => {
  it('responds with a 204', async () => {
    const { statusCode } = await client.deleteByDocumentId('j72hkk');
    expect(statusCode).toBe(204);
  });
});
