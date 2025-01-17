import type superjson from "superjson";

import { defineSerializer } from "./builder";

export const superjsonSerializer = defineSerializer<
  string,
  { superjson: superjson }
>(({ superjson }) => ({
  serialize(data) {
    return superjson.stringify({ data });
  },
  deserialize(serialized) {
    const { data } = superjson.parse<{ data: object }>(serialized);
    return data;
  },
}));
