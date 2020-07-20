/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger, Context } from './Logger';

export class NoOpLogger implements Logger {
  log(_message: string): Logger {
    return this;
  }

  error(_error: Error): Logger {
    return this;
  }

  mergeContext(_context: Context): Logger {
    return this;
  }
}

export default new NoOpLogger();
