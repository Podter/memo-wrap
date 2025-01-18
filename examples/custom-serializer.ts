import { createMemoWrap } from "memo-wrap";
import { memoryDriver } from "memo-wrap/driver/memory";
import { defineSerializer } from "memo-wrap/serializer/builder";

const customSerializer = defineSerializer<string>(() => {
  return {
    serialize: (data: object) => JSON.stringify(data),
    deserialize: (data: string) => JSON.parse(data),
  };
});

// ...

export const memo = createMemoWrap({
  driver: memoryDriver({}),
  serializer: customSerializer(),
});
