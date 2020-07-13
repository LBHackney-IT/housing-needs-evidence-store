import { Logger, Context } from "./Logger";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WriteFn = (message: any) => void;

class ConsoleLogger implements Logger {
  write: WriteFn;
  context: Context;

  constructor(write: WriteFn = console.log) {
    this.context = {};
    this.write = write;
  }

  log(message: string): Logger {
    this.write(JSON.stringify({
      datetime: new Date(Date.now()).toISOString(),
      message,
      ...this.context,
    }, undefined, 2));

    return this;
  }

  error(error: Error): Logger {
    return this.mergeContext({
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...error
      }
    }).log(`[error] ${error.message}`);
  }

  mergeContext(context: Context): Logger {
    this.context = { ...this.context, ...context };
    return this;
  }
}

export default new ConsoleLogger();
export { ConsoleLogger };
