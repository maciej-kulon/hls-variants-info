import { Prop, Schema } from '@nestjs/mongoose';
import { VmafPooledMetrics } from 'src/types/types';
import { Segment } from '../segments/segment.schema';

export interface Resolution {
  width: number;
  height: number;
}

@Schema()
export class Variant {

  @Prop({ required: true })
  public uri: string;

  @Prop()
  codecs: string;

  @Prop()
  resolution: Resolution;

  @Prop()
  declaredMaxBitrate: number;

  @Prop()
  declaredAvgBitrate: number;

  @Prop()
  measuredMaxBitrate?: number;

  @Prop()
  measuredMinBitrate?: number;

  @Prop()
  measuredAvgBitrate?: number;

  @Prop()
  segmentsCount: number;

  @Prop()
  vmafScore?: VmafPooledMetrics;

  @Prop()
  segments: Segment[];
}
