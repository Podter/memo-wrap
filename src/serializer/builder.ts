export interface Serializer<SerializedType> {
  serialize(data: object): SerializedType;
  deserialize(serialized: SerializedType): object;
}

export type SerializerFactory<
  SerializedType,
  Opts extends object | undefined,
> = Opts extends object
  ? (opts: Opts) => Serializer<SerializedType>
  : () => Serializer<SerializedType>;

export function defineSerializer<
  SerializedType,
  Opts extends object | undefined = undefined,
>(
  factory: SerializerFactory<SerializedType, Opts>,
): SerializerFactory<SerializedType, Opts> {
  return factory;
}
