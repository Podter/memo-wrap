import type { Awaitable } from "~/types";

export interface Driver<SerializedType> {
  get: (key: string) => Awaitable<SerializedType | null>;
  set: (key: string, value: SerializedType, ttl?: number) => Awaitable<void>;
}

export type DriverFactory<
  SerializedType,
  Opts extends object | undefined,
> = Opts extends object
  ? (opts: Opts) => Driver<SerializedType>
  : Opts extends object & undefined
    ? (opts?: Opts) => Driver<SerializedType>
    : () => Driver<SerializedType>;

export function defineDriver<
  SerializedType,
  Opts extends object | undefined = undefined,
>(
  factory: DriverFactory<SerializedType, Opts>,
): DriverFactory<SerializedType, Opts> {
  return factory;
}
