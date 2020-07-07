import SaveMetadata from './save-metadata';

describe('Save Metadata Use Case', () => {
  const usecase = new SaveMetadata(
    {
      create: jest.fn(() => Promise.resolve()),
      createUrl: jest.fn(() =>
        Promise.resolve({
          url: 'https://s3.eu-west-2.amazonaws.com/bucketName',
          fields: {
            'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
          },
        })
      ),
    },
    jest.fn(() => '123')
  );

  it('Saves metadata to S3', async () => {
    const metadata = {
      firstName: 'Aidan',
      dob: '1999-09-09',
    };

    await usecase.execute(metadata);

    expect(usecase.s3Gateway.create).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'Aidan',
        dob: '1999-09-09',
        documentId: '123',
      })
    );
  });

  it('creates an upload url', async () => {
    const metadata = {
      firstName: 'Aidan',
      dob: '1999-09-09',
    };

    await usecase.execute(metadata);

    expect(usecase.s3Gateway.createUrl).toHaveBeenCalledWith('123');
  });
});
