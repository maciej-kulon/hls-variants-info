import * as mongoose from 'mongoose';
import { SegmentInfoModel, SegmentInfoSchema } from '../segments/segment.model';

export const VariantInfoSchema = new mongoose.Schema({
  uri: {
    type: String,
    index: true,
    unique: true,
  },
  codecs: String,
  declaredMaxBitrate: Number,
  declaredAvgBitrate: Number,
  measuredMaxBitrate: Number,
  measuredMinBitrate: Number,
  measuredAvgBitrate: Number,
  segmentsCount: Number,
  vmafScore: Number,
  segments: [SegmentInfoSchema],
});

export interface VariantInfoModel {
  uri: string;
  codecs: string;
  declaredMaxBitrate: number;
  declaredAvgBitrate: number;
  measuredMaxBitrate: number;
  measuredMinBitrate: number;
  measuredAvgBitrate: number;
  segmentsCount: number;
  vmafScore: number;
  segments: SegmentInfoModel[];
}
