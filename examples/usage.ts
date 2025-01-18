import { createMemoWrap } from "memo-wrap";
import { memoryDriver } from "memo-wrap/driver/memory";
import { jsonSerializer } from "memo-wrap/serializer/json";

const memo = createMemoWrap({
  driver: memoryDriver({}), // Where to store the cache (memory, redis, etc)
  serializer: jsonSerializer(), // How to serialize the cache value (json, superjson, v8, etc)
});

const add = memo(
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

// The first call will take 3 second
console.log(await add(1, 2));

// The second call will be instant
console.log(await add(1, 2));
