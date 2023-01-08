import { Field, Model } from 'serialize-ts';

@Model()
export class Tutorial {

  @Field()
  title!: string;

  @Field()
  source!: string;

  @Field()
  markdown?: string;

  @Field()
  baseUrl!: string;

  @Field()
  assetsUrl!: string;

  constructor(props = {}) {
    Object.assign(this, props);
  }

}
