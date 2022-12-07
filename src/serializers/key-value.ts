import { clone } from 'lodash';
import { Serializer } from 'serialize-ts';
import { KeyValue } from 'src/types/key-value';

export class KeyValueSerializer implements Serializer<KeyValue> {
  serialize(obj: KeyValue): KeyValue {
    return clone(obj);
  }

  deserialize(src: KeyValue): KeyValue {
    return clone(src);
  }
}
