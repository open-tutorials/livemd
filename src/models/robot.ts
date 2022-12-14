import { ArraySerializer, Field, Model } from 'serialize-ts';
import { ModelMetadataSerializer } from 'serialize-ts/dist/serializers/model-metadata.serializer';

@Model()
export class ScopeField {

  @Field()
  type!: string;

  @Field()
  name!: string;

  @Field()
  placeholder!: string;
}

@Model()
export class Robot {

  @Field()
  endpoint!: string;

  @Field()
  submit!: string;

  @Field({serializer: new ArraySerializer(new ModelMetadataSerializer(ScopeField))})
  fields!: ScopeField[];
}
