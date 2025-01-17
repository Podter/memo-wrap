import type superjson from "superjson";

import { defineSerializer } from "./builder";

export const superjsonSerializer = defineSerializer((SuperJSON: superjson) => ({
  serialize(data) {
    return SuperJSON.stringify({ data });
  },
  deserialize(serialized) {
    const { data } = SuperJSON.parse<{ data: object }>(serialized);
    return data;
  },
}));
