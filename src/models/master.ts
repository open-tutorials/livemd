import { Field, Model } from '@junte/serialize-ts';
import { merge } from 'lodash';

@Model()
export class Master {

  @Field()
  name!: string;

  @Field()
  avatar!: string;

  constructor(defs: Partial<Master>) {
    merge(this, defs);
  }

}
