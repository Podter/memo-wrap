import { defineDriver } from "./builder";

interface DataType {
  data: any;
  expiresAt?: number;
}

export interface MemoryDriverOpts {
  doCleanup?: boolean;
}

export const memoryDriver = defineDriver(
  ({ doCleanup = true }: MemoryDriverOpts) => {
    const data = new Map<string, DataType>();

    function cleanup() {
      const now = Date.now();
      for (const [key, { expiresAt }] of data.entries()) {
        if (expiresAt && expiresAt < now) {
          data.delete(key);
        }
      }
    }

    return {
      get(key) {
        if (doCleanup) {
          cleanup();
        }

        return data.get(key)?.data ?? null;
      },
      set(key, value, ttl) {
        if (doCleanup) {
          cleanup();
        }

        data.set(key, {
          data: value,
          expiresAt: ttl ? Date.now() + ttl * 1000 : undefined,
        });
      },
    };
  },
);
