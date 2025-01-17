import { deserialize, serialize } from "node:v8";

import { defineSerializer } from "./builder";

export const v8Serializer = defineSerializer({
  serialize,
  deserialize,
});
