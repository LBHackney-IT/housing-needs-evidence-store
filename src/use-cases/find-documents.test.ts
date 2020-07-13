import FindDocuments from './find-documents';

describe('Find Documents Use Case', () => {
  const expectedDocuments = {
    documents: [
      { name: '123.jpeg', id: '123' },
      { name: '456.pdf', id: '456' },
    ],
  };

  const usecase = new FindDocuments({
    find: jest.fn(() => Promise.resolve(expectedDocuments)),
  });

  it('gets a document by name', async () => {
    const result = await usecase.execute({
      fistName: 'Tim',
      lastName: 'Jones',
    });
    expect(result).toBe(expectedDocuments);
  });
});
