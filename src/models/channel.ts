import { Field } from 'serialize-ts';
import { Member } from 'src/models/member';

export class Channel {
  id!: string;
  owner!: string;
  members!: { [key: string]: Member };
  marks!: { [key: string]: { [key: number]: string | null } };
  polls!: { [key: string]: { [key: number]: number } };
  comments!: { [key: number]: { [key: string]: string } };
  progress!: { [key: string]: number };
  markdown!: string;
  baseUrl!: string;
  imagesUrl!: string;
  locked!: boolean;
}

export class ChannelUpdate {
  @Field()
  owner!: string;

  @Field()
  markdown!: string;

  @Field()
  baseUrl!: string;

  @Field()
  imagesUrl!: string;

  @Field()
  slug!: string;

  @Field()
  locked!: boolean;

  constructor(defs: Partial<ChannelUpdate> = {}) {
    Object.assign(this, defs);
  }
}
