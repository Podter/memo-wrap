import type { Awaitable } from "~/types";

export interface Driver<CacheValue> {
  get: (key: string) => Awaitable<CacheValue | null>;
  set: (key: string, value: CacheValue, ttl?: number) => Awaitable<void>;
}

export type DriverFactory<
  CacheValue,
  Opts extends object | undefined = undefined,
> = Opts extends object
  ? (opts: Opts) => Driver<CacheValue>
  : () => Driver<CacheValue>;

export function defineDriver<
  CacheValue,
  Opts extends object | undefined = undefined,
>(factory: DriverFactory<CacheValue, Opts>): DriverFactory<CacheValue, Opts> {
  return factory;
}
