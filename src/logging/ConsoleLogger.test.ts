import { ConsoleLogger } from './ConsoleLogger';

describe('ConsoleLogger', () => {
  const writer = jest.fn();
  const logger = new ConsoleLogger(writer);

  describe('#log', () => {
    it('logs a message', () => {
      logger.log('hello world');

      expect(writer).toHaveBeenCalledWith(
        expect.stringContaining('hello world')
      );
    });

    it('includes any supplied context values', () => {
      const context = { key: 'value' };
      logger.mergeContext(context).log('hello world');

      expect(writer).toHaveBeenCalledWith(
        expect.stringContaining("value")
      );
    });
  });

  describe('#error', () => {
    it('updates context to include error details', () => {
      const error = new Error('Something failed');
      logger.error(error);

      expect(logger.context).toStrictEqual(
        expect.objectContaining({
          error: expect.objectContaining({
            name: error.name,
            message: error.message,
            stack: error.stack
          })
        })
      );
    });
  });

  describe('#mergeContext', () => {
    it('updates the context with new keys', () => {
      logger
        .mergeContext({ abc: '123' })
        .mergeContext({ def: '456' });

      expect(logger.context).toStrictEqual(
        expect.objectContaining({
          abc: '123',
          def: '456'
        })
      );
    });
  })
});
