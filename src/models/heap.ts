import { Field, Model } from 'serialize-ts';
import { KeyValueSerializer } from 'src/serializers/key-value';

@Model()
export class Heap {

  @Field({serializer: new KeyValueSerializer()})
  placeholders: { [key: string]: string } = {};

  @Field({serializer: new KeyValueSerializer()})
  timers: { [key: string]: string } = {};

}
