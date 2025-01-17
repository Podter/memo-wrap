import type { Storage, StorageValue } from "unstorage";

import { defineDriver } from "./builder";

export interface UnstorageDriverOpts<T extends StorageValue> {
  storage: Storage<T>;
  doCleanup?: boolean;
}

async function cleanup<T extends StorageValue>(storage: Storage<T>) {
  const keys = await storage.getKeys();
  const now = Date.now();
  await Promise.allSettled(
    keys.map(async (key) => {
      const { ttl } = await storage.getMeta(key);
      if (ttl && ttl < now) {
        await storage.removeItem(key, { removeMeta: true });
      }
    }),
  );
}

export const unstorageDriver = defineDriver(
  ({ storage, doCleanup }: UnstorageDriverOpts<string>) => {
    return {
      async get(key) {
        if (doCleanup) {
          await cleanup(storage);
        }

        return await storage.getItem(key);
      },
      async set(key, value, ttl) {
        if (doCleanup) {
          await cleanup(storage);
        }

        await storage.setItem(key, value);
        if (ttl) {
          await storage.setMeta(key, { ttl: Date.now() + ttl * 1000 });
        }
      },
    };
  },
);

export const unstorageBufferDriver = defineDriver(
  ({ storage, doCleanup }: UnstorageDriverOpts<Buffer>) => {
    return {
      async get(key) {
        if (doCleanup) {
          await cleanup(storage);
        }

        return await storage.getItemRaw<Buffer>(key);
      },
      async set(key, value, ttl) {
        if (doCleanup) {
          await cleanup(storage);
        }

        await storage.setItemRaw<Buffer>(key, value);
        if (ttl) {
          await storage.setMeta(key, { ttl: Date.now() + ttl * 1000 });
        }
      },
    };
  },
);
