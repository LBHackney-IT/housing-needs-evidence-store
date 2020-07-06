import GetMetadata from './get-metadata';

describe('Get Metadata Use Case', () => {

  const expectedDocument = {
    firstName: 'Andrew',
    dob: '1999-09-09',
    documentId: '123'
  }

  const usecase = new GetMetadata(
    {
      get: jest.fn(() => Promise.resolve(expectedDocument))
    })

  it('gets a document by id', async () => {

    const result = await usecase.execute(expectedDocument.documentId);
    expect(result).toBe(expectedDocument);
  })
})