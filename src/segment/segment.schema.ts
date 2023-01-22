import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class Segment {

  @Prop({ required: true })
  public uri: string;

  @Prop()
  public bitrate: number;
}