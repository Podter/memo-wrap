export interface Serializer<SerializedType> {
  serialize(data: object): SerializedType;
  deserialize(serialized: SerializedType): object;
}

export type SerializerFactory<SerializedType, Args extends any[]> = (
  ...args: Args
) => Serializer<SerializedType>;

export function defineSerializer<SerializedType, Args extends any[]>(
  factory: SerializerFactory<SerializedType, Args>,
): SerializerFactory<SerializedType, Args> {
  return factory;
}
