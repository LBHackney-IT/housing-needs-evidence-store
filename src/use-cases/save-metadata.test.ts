import SaveMetadata from './save-metadata';

describe('Save Metadata Use Case', () => {
  const usecase = new SaveMetadata({
    S3Gateway: { save: jest.fn(() => Promise.resolve()) },
  });

  it('Saves metadata to S3', async () => {
    const metadata = {
      firstName: 'Aidan',
      dob: '1999-09-09',
    };

    await usecase.execute({ metadata });

    expect(usecase.S3Gateway.create).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'Aidan',
        dob: '1999-09-09',
      })
    );
  });
});
