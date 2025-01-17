export interface Serializer<SerializedType> {
  serialize(data: object): SerializedType;
  deserialize(serialized: SerializedType): object;
}

export function defineSerializer<SerializedType>(
  serializer: Serializer<SerializedType>,
): Serializer<SerializedType> {
  return serializer;
}
