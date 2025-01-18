# memo-wrap

Cache the result of function calls

```ts
import { createMemoWrap } from "memo-wrap";
import { memoryDriver } from "memo-wrap/driver/memory";
import { jsonSerializer } from "memo-wrap/serializer/json";

const memo = createMemoWrap({
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
npm i memo-wrap
```

## Serializers

Serializer is used to serialize and deserialize the cache value. memo-wrap has several built-in serializers:

### JSON

```ts
import { jsonSerializer } from "memo-wrap/serializer/json";

const memo = createMemoWrap({
  serializer: jsonSerializer(),
  // ...
});
```

### SuperJSON

```ts
import { superjsonSerializer } from "memo-wrap/serializer/superjson";
import SuperJSON from "superjson";

const memo = createMemoWrap({
  serializer: superjsonSerializer({
    superjson: SuperJSON,
  }),
  // ...
});
```

### V8

```ts
import { v8Serializer } from "memo-wrap/serializer/v8";

const memo = createMemoWrap({
  serializer: v8Serializer(), // Node.js only
  // ...
});
```

### BYO

You can create your own serializer by using the `defineSerializer` function:

```ts
import { defineSerializer } from "memo-wrap/serializer/builder";

const jsonSerializer = defineSerializer(() => {
  return {
    serialize: (data: any) => JSON.stringify(data),
    deserialize: (data: string) => JSON.parse(data),
  };
});

const memo = createMemoWrap({
  serializer: jsonSerializer(),
  // ...
});
```

## Drivers

Driver is used to store and retrieve the cache value. memo-wrap has several built-in drivers:

### Memory

```ts
import { memoryDriver } from "memo-wrap/driver/memory";

const memo = createMemoWrap({
  driver: memoryDriver({}),
  // ...
});
```

### Redis

```ts
import { Redis } from "ioredis";
import { redisDriver } from "memo-wrap/driver/redis";

const memo = createMemoWrap({
  driver: redisDriver({
    redis: new Redis(),
  }),
  // ...
});
```

### unstorage

```ts
import { unstorageDriver } from "memo-wrap/driver/unstorage";
import { createStorage } from "unstorage";
import cloudflareKVBindingDriver from "unstorage/drivers/cloudflare-kv-binding";

const memo = createMemoWrap({
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
import { Redis } from "ioredis";
import { defineDriver } from "memo-wrap/driver/builder";

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

const memo = createMemoWrap({
  driver: redisDriver({
    redis: new Redis(),
  }),
  // ...
});
```

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more information.
