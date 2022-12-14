import { Field, Model } from 'serialize-ts';
import { KeyValueSerializer } from 'src/serializers/key-value';
import { KeyValue } from 'src/types/key-value';

@Model()
export class Robots {

  @Field({serializer: new KeyValueSerializer()})
  messages!: { [key: string]: string };

  @Field({serializer: new KeyValueSerializer()})
  scope!: { [key: string]: { [key: string]: KeyValue } };
}

@Model()
export class Heap {

  @Field({serializer: new KeyValueSerializer()})
  placeholders!: { [key: string]: string };

  @Field({serializer: new KeyValueSerializer()})
  timers!: { [key: string]: string };

  @Field({serializer: new KeyValueSerializer()})
  messages!: { [key: string]: boolean };

  @Field()
  robots: Robots = new Robots();

}
