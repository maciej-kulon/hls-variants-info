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
  variants: [VariantInfoSchema],
});

export interface MasterPlaylistModel {
  uri: string;
  variants: VariantInfoModel[];
}
