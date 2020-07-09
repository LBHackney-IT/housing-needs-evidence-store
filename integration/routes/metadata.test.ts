import client from '../client';

describe('POST /metadata', () => {

  const metadata = {
    "firstName": "Aidan",
    "dob": "1999-09-09"
  }

  const expectedSaveResponse = {documentId: expect.any(String), url: expect.any(String), fields: expect.objectContaining({success_action_status: "201",
    "bucket": 'hn-evidence-store-testbucket'})};

  it('Saves and gets metadata', async () => {
    const saveResponse = await client.saveMetadata(metadata);
    const docId = saveResponse.body.documentId;
    const getResponse = await client.getMetadata(docId);

    expect(saveResponse.statusCode).toBe(201);
    expect(saveResponse.body).toStrictEqual(expectedSaveResponse);
    const expectedGetResponse = {
      "firstName": "Aidan",
      "dob": "1999-09-09",
      "documentId": docId
    }

    expect(getResponse.statusCode).toBe(200);
    expect(getResponse.body).toStrictEqual(expectedGetResponse);


  });
});