import { Field, Model } from 'serialize-ts';

@Model()
export class Master {

  @Field()
  name!: string;

  @Field()
  avatar!: string;

}
