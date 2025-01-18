import type superjson from "superjson";

import { defineSerializer } from "./builder";

export interface SuperJSONSerializerOpts {
  superjson: superjson;
}

export const superjsonSerializer = defineSerializer<
  string,
  SuperJSONSerializerOpts
>(({ superjson }) => ({
  serialize(data) {
    return superjson.stringify({ data });
  },
  deserialize(serialized) {
    const { data } = superjson.parse<{ data: object }>(serialized);
    return data;
  },
}));
