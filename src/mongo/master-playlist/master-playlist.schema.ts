import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  Variant,
} from '../media-playlist/variant-info.schema';

@Schema({
  collection: "masterplaylists",
  timestamps: true,
})
export class MasterPlaylist extends Document {
  public _id: Types.ObjectId;

  @Prop({ required: true })
  public uri: string;

  @Prop()
  public tag: string;

  @Prop()
  public vmafModelPath: string;

  @Prop()
  public originalVideoFile: string;

  @Prop()
  public variants?: Variant[];
}

export const MasterPlaylistSchema: any = SchemaFactory.createForClass(MasterPlaylist);