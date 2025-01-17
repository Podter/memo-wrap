import type { Redis } from "ioredis";

import { defineDriver } from "./builder";

interface RedisDriverOpts {
  redis: Redis;
}

export const redisDriver = defineDriver<string, RedisDriverOpts>(
  ({ redis }) => {
    return {
      async get(key) {
        return await redis.get(key);
      },
      async set(key, value, ttl) {
        await redis.set(key, value);
        if (ttl) {
          await redis.expire(key, ttl);
        }
      },
    };
  },
);

export const redisBufferDriver = defineDriver<Buffer, RedisDriverOpts>(
  ({ redis }) => {
    return {
      async get(key) {
        return await redis.getBuffer(key);
      },
      async set(key, value, ttl) {
        await redis.set(key, value);
        if (ttl) {
          await redis.expire(key, ttl);
        }
      },
    };
  },
);
