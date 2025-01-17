import { defineSerializer } from "./builder";

export const jsonSerializer = defineSerializer({
  serialize(data) {
    return JSON.stringify({ data });
  },
  deserialize(serialized) {
    const { data } = JSON.parse(serialized);
    return data;
  },
});
