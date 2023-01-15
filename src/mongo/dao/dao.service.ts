import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { MasterPlaylistModel } from '../master-playlist/master-playlist.model';
import {
  BitrateAggregation,
  SegmentInfo,
  VariantInfo,
} from '../../types/types';

@Injectable()
export class Dao {
  public constructor(
    @InjectModel('MasterPlaylist')
    private readonly masterPlaylistModel: Model<MasterPlaylistModel>,
  ) {}
  public async saveMasterPlaylist(uri: string) {
    try {
      let masterPlaylist = await this.getMasterPlaylistByUri(uri);
      if (!masterPlaylist) {
        masterPlaylist = new this.masterPlaylistModel({
          uri,
          variants: [],
        });
      } else {
        masterPlaylist.variants = [];
      }
      await masterPlaylist.save();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async addVariant(variantInfo: VariantInfo) {
    const masterPlaylist = await this.getMasterPlaylistByUri(
      variantInfo.masterPlaylistUri,
    );
    masterPlaylist.variants.push({
      uri: variantInfo.playlist.uri,
      codecs: variantInfo.codecs,
      declaredMaxBitrate: variantInfo.declaredMaxBitrate,
      declaredAvgBitrate: variantInfo.declaredAvgBitrate,
      measuredMaxBitrate: undefined,
      measuredMinBitrate: undefined,
      measuredAvgBitrate: undefined,
      segmentsCount: variantInfo.playlist.segments.length,
      vmafScore: undefined,
      segments: [],
    });
    await masterPlaylist.save();
  }

  public async addSegment(variantUri: string, segment: SegmentInfo) {
    await this.masterPlaylistModel.findOneAndUpdate(
      {
        'variants.uri': variantUri,
      },
      { $push: { 'variants.$.segments': segment } },
      { new: true, upsert: true },
    );
  }

  public async getVariantDesiredSegmentsCount(variantUri: string) {
    const masterPlaylist = await this.getMasterPlaylistByVariantUri(variantUri);
    return masterPlaylist.variants.find((item) => item.uri === variantUri)
      .segmentsCount;
  }

  public async updateBitrateValues(
    variantUri: string,
    data: BitrateAggregation,
  ) {
    const masterPlaylist = await this.getMasterPlaylistByVariantUri(variantUri);
    const variant = masterPlaylist.variants.find(
      (item) => item.uri === variantUri,
    );
    variant.measuredMaxBitrate = data.max;
    variant.measuredMinBitrate = data.min;
    variant.measuredAvgBitrate = data.average;
    await masterPlaylist.save();
  }

  public async getAllVariantSegments(
    variantUri: string,
  ): Promise<SegmentInfo[]> {
    const masterPlaylist = await this.getMasterPlaylistByVariantUri(variantUri);
    const variant = masterPlaylist.variants.find(
      (item) => item.uri === variantUri,
    );
    return variant.segments;
  }

  public async getMasterPlaylistByUri(masterPlaylistUri: string) {
    return await this.masterPlaylistModel.findOne({
      uri: masterPlaylistUri,
    });
  }

  public async getMasterPlaylistByVariantUri(variantUri: string) {
    return await this.masterPlaylistModel.findOne({
      'variants.uri': variantUri,
    });
  }
}
