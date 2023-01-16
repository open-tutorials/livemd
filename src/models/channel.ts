import { ArraySerializer, Field, Model, PrimitiveSerializer } from 'serialize-ts';
import { Member } from 'src/models/member';
import { KeyModelSerializer } from 'src/serializers/key-model';
import { KeyValueSerializer } from 'src/serializers/key-value';

@Model()
export class Poll {

  @Field({serializer: new KeyValueSerializer()})
  voted: { [key: string]: number } = {};

  @Field({serializer: new KeyValueSerializer()})
  answers: { [key: number]: number } = {};

}

@Model()
export class Channel {

  @Field()
  id!: string;

  @Field({serializer: new KeyValueSerializer()})
  members: { [key: string]: Member } = {};

  @Field({serializer: new KeyModelSerializer(Poll)})
  polls: { [key: string]: Poll } = {};

  constructor(props = {}) {
    Object.assign(this, props);
  }

}
