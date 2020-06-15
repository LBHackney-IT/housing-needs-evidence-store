import { handler } from './handler';

describe('handler', () => {
  it('exports a handler function', () => {
    expect(handler).toBeInstanceOf(Function);
  });
});
