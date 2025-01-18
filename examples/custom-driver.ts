import { Redis } from "ioredis";
import { createMemoWrap } from "memo-wrap";
import { defineDriver } from "memo-wrap/driver/builder";
import { jsonSerializer } from "memo-wrap/serializer/json";

interface CustomDriverOpts {
  redis: Redis;
}

const customDriver = defineDriver<string, CustomDriverOpts>(({ redis }) => {
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
});

// ...

const redis = new Redis();

export const memo = createMemoWrap({
  driver: customDriver({
    redis,
  }),
  serializer: jsonSerializer(),
});
