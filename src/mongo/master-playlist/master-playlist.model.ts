import * as mongoose from 'mongoose';
import {
  VariantInfoModel,
  VariantInfoSchema,
} from '../media-playlist/variant-info.model';

export const MasterPlaylistSchema = new mongoose.Schema({
  uri: {
    type: String,
    index: true,
    unique: true,
  },
  tag: String,
  originalVideoFile: String,
  vmafModelPath: String,
  variants: [VariantInfoSchema],
});

export interface MasterPlaylistModel {
  uri: string;
  tag?: string;
  originalVideoFile?: string;
  vmafModelPath?: string;
  variants: VariantInfoModel[];
}
