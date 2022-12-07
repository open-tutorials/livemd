import { Field, Model } from 'serialize-ts';
import { Master } from 'src/models/master';

@Model()
export class Message {

  @Field()
  from!: Master;

  @Field()
  src!: string;

}
