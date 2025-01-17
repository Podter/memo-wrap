import { createCacheWrap } from "../dist";
import { memoryDriver } from "../dist/driver/memory";
import { jsonSerializer } from "../dist/serializer/json";

const cache = createCacheWrap({
  driver: memoryDriver({}),
  serializer: jsonSerializer(),
});

const add = cache(async (a: number, b: number) => {
  console.log("calculate");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return a + b;
}, "add");

console.log(await add(1, 2)); // calculate, 3
console.log(await add(1, 2)); // 3
