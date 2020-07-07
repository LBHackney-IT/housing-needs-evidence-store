// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Context = { [key: string]: any };

export interface Logger {
  log: (message: string) => Logger;
  error: (error: Error) => Logger;
  mergeContext: (context: Context) => Logger;
}
