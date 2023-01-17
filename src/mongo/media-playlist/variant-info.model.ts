import * as mongoose from 'mongoose';
import { VmafPooledMetrics } from 'src/types/types';
import { SegmentInfoModel, SegmentInfoSchema } from '../segments/segment.model';

export const VariantInfoSchema = new mongoose.Schema({
  uri: {
    type: String,
  },
  codecs: String,
  resolution: new mongoose.Schema({
    width: Number,
    height: Number,
  }),
  declaredMaxBitrate: Number,
  declaredAvgBitrate: Number,
  measuredMaxBitrate: Number,
  measuredMinBitrate: Number,
  measuredAvgBitrate: Number,
  segmentsCount: Number,
  vmafScore: Object,
  segments: [SegmentInfoSchema],
});

export interface Resolution {
  width: number;
  height: number;
}
export interface VariantInfoModel {
  uri: string;
  codecs: string;
  resolution: Resolution;
  declaredMaxBitrate: number;
  declaredAvgBitrate: number;
  measuredMaxBitrate?: number;
  measuredMinBitrate?: number;
  measuredAvgBitrate?: number;
  segmentsCount: number;
  vmafScore?: VmafPooledMetrics;
  segments: SegmentInfoModel[];
}
