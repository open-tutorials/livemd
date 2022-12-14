import { Field, Model } from 'serialize-ts';

@Model()
export class RobotAnswer {

  @Field()
  message!: string;

  @Field()
  scope!: any;
}
