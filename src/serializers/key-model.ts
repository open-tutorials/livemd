import { deserialize, serialize, Serializer } from 'serialize-ts';

export type KeyModel<T> = { [key: string]: T };
type KeyObject = { [key: string]: Object };

export class KeyModelSerializer<T> implements Serializer<KeyModel<T>> {

  constructor(private model: new () => T) {
  }

  serialize(src: KeyModel<T>): KeyObject {
    const dst: KeyObject = {};
    for (const key of Object.keys(src)) {
      dst[key] = serialize(src[key]);
    }
    return dst;
  }

  deserialize(src: KeyObject): KeyModel<T> {
    const dst: KeyModel<T> = {};
    for (const key of Object.keys(src)) {
      dst[key] = deserialize(src[key], this.model);
    }
    return dst;
  }
}
