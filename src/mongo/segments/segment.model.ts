import * as mongoose from 'mongoose';

export const SegmentInfoSchema = new mongoose.Schema({
  uri: {
    type: String,
    required: true,
  },
  bitrate: Number,
  variantUri: String,
});

export interface SegmentInfoModel {
  uri: string;
  bitrate: number;
}
