import client from '../client';

describe('POST /metadata', () => {
  const metadata = {
    firstName: 'Aidan',
    dob: '1999-09-09',
  };

  it('creates metadata and responds with upload details', async () => {
    const {
      statusCode,
      body
    } = await client.saveMetadata(metadata);

    expect(statusCode).toBe(201);
    expect(body).toStrictEqual({
      documentId: expect.any(String),
      url: expect.any(String),
      fields: expect.objectContaining({
        success_action_status: '201',
        bucket: 'hn-evidence-store-test-documents',
      }),
    });
  });
});
