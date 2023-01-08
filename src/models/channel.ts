import { Field, Model } from 'serialize-ts';
import { Member } from 'src/models/member';
import { KeyValueSerializer } from 'src/serializers/key-value';

@Model()
export class Channel {

  @Field()
  id!: string;

  @Field({serializer: new KeyValueSerializer()})
  members: { [key: string]: Member } = {};

  @Field({serializer: new KeyValueSerializer()})
  polls: { [key: string]: { [key: number]: number } } = {};

  constructor(props = {}) {
    Object.assign(this, props);
  }

}
