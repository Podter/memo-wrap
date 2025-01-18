import type { Driver } from "./driver/builder";
import type { Serializer } from "./serializer/builder";
import type { Callback } from "./types";

export interface MemoWrapOptions<SerializedType> {
  driver: Driver<SerializedType>;
  serializer: Serializer<SerializedType>;
}

export function createMemoWrap<SerializedType>({
  driver,
  serializer,
}: MemoWrapOptions<SerializedType>) {
  return <T extends Callback>(
    callback: T,
    key: string | ((...args: Parameters<T>) => string),
    opts?: {
      ttl?: number; // seconds
    },
  ) => {
    async function cachedCallback(...args: Parameters<typeof callback>) {
      const cacheKey = typeof key === "function" ? key(...args) : key;

      const cached = await driver.get(cacheKey);
      if (cached) {
        const data = serializer.deserialize(cached);
        return data;
      }

      const data = await callback(...args);
      await driver.set(cacheKey, serializer.serialize(data), opts?.ttl);

      return data;
    }

    return cachedCallback as T;
  };
}
