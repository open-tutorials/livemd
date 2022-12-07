import { Field, Model } from '@junte/serialize-ts';
import { Master } from 'src/models/master';
import { merge } from "lodash";

@Model()
export class Message {

  @Field()
  from!: Master;

  @Field()
  src!: string;

  constructor(defs: Partial<Message>) {
    merge(this, defs);
  }
}
