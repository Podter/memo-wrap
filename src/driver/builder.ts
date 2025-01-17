export type Awaitable<T> = PromiseLike<T> | T;

export interface Driver<CacheValue> {
  get: (key: string) => Awaitable<CacheValue | null>;
  // ttl in seconds
  set: (key: string, value: CacheValue, ttl?: number) => Awaitable<void>;
}

export type DriverFactory<CacheValue, Args extends any[]> = (
  ...args: Args
) => Driver<CacheValue>;

export function defineDriver<CacheValue, Args extends any[]>(
  factory: DriverFactory<CacheValue, Args>,
): DriverFactory<CacheValue, Args> {
  return factory;
}
