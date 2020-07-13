export interface UseCase<T, TResult> {
  execute: (request: T) => Promise<TResult> | TResult
}
