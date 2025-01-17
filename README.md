# cache-wrap

Cache the result of function calls

```ts
import { createCacheWrap } from "cache-wrap";
import { memoryDriver } from "cache-wrap/driver/memory";
import { jsonSerializer } from "cache-wrap/serializer/json";

const cache = createCacheWrap({
  driver: memoryDriver({}), // Where to store the cache (memory, redis, etc)
  serializer: jsonSerializer(), // How to serialize the cache value (json, superjson, v8, etc)
});

const add = cache(
  // The function to cache
  async (a: number, b: number) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return a + b;
  },
  // The key generator based on the function arguments (typesafe)
  (a, b) => `add:${a}:${b}`,
  {
    ttl: 60, // TTL in seconds
  },
);

// The first call will take 3000 second
console.log(await add(1, 2));

// The second call will be instant
console.log(await add(1, 2));
```

## Installation

```sh
npm i cache-wrap
```

## Serializers

Serializer is used to serialize and deserialize the cache value. cache-wrap has several built-in serializers:

### JSON

```ts
import { jsonSerializer } from "cache-wrap/serializer/json";

const cache = createCacheWrap({
  serializer: jsonSerializer(),
  // ...
});
```

### SuperJSON

```ts
import { superjsonSerializer } from "cache-wrap/serializer/superjson";
import SuperJSON from "superjson";

const cache = createCacheWrap({
  serializer: superjsonSerializer({
    superjson: SuperJSON,
  }),
  // ...
});
```

### V8

```ts
import { v8Serializer } from "cache-wrap/serializer/v8";

const cache = createCacheWrap({
  serializer: v8Serializer(), // Node.js only
  // ...
});
```

### BYO

You can create your own serializer by using the `defineSerializer` function:

```ts
import { defineSerializer } from "cache-wrap/serializer/builder";

const jsonSerializer = defineSerializer(() => {
  return {
    serialize: (data: any) => JSON.stringify(data),
    deserialize: (data: string) => JSON.parse(data),
  };
});

const cache = createCacheWrap({
  serializer: jsonSerializer(),
  // ...
});
```

## Drivers

Driver is used to store and retrieve the cache value. cache-wrap has several built-in drivers:

### Memory

```ts
import { memoryDriver } from "cache-wrap/driver/memory";

const cache = createCacheWrap({
  driver: memoryDriver({}),
  // ...
});
```

### Redis

```ts
import { redisDriver } from "cache-wrap/driver/redis";
import { Redis } from "ioredis";

const cache = createCacheWrap({
  driver: redisDriver({
    redis: new Redis(),
  }),
  // ...
});
```

### unstorage

```ts
import { unstorageDriver } from "cache-wrap/driver/unstorage";
import { createStorage } from "unstorage";
import cloudflareKVBindingDriver from "unstorage/drivers/cloudflare-kv-binding";

const cache = createCacheWrap({
  driver: unstorageDriver({
    storage: createStorage({
      driver: cloudflareKVBindingDriver({ binding: "CACHE" }),
    }),
  }),
  // ...
});
```

### BYO

You can create your own driver by using the `defineDriver` function:

```ts
import { defineDriver } from "cache-wrap/driver/builder";
import { Redis } from "ioredis";

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

const cache = createCacheWrap({
  driver: redisDriver({
    redis: new Redis(),
  }),
  // ...
});
```

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more information.
