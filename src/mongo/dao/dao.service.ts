import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { MasterPlaylistModel } from '../master-playlist/master-playlist.model';
import {
  BitrateAggregation,
  InputDataTransport,
  SegmentInfo,
  VariantInfo,
  VmafResult,
} from '../../types/types';

@Injectable()
export class Dao {
  public constructor(
    @InjectModel('MasterPlaylist')
    private readonly masterPlaylistModel: Model<MasterPlaylistModel>,
  ) {}
  public async saveMasterPlaylist(inputData: InputDataTransport) {
    try {
      let masterPlaylist = await this.getMasterPlaylistByUri(
        inputData.hlsManifestUrl,
      );

      if (!masterPlaylist) {
        masterPlaylist = new this.masterPlaylistModel({
          uri: inputData.hlsManifestUrl,
          tag: inputData.tag,
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
      resolution: variantInfo.resolution,
      declaredMaxBitrate: variantInfo.declaredMaxBitrate,
      declaredAvgBitrate: variantInfo.declaredAvgBitrate,
      segmentsCount: variantInfo.playlist.segments.length,
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

  public async updateVmafResult(vmaf: VmafResult) {
    await this.masterPlaylistModel.findOneAndUpdate(
      {
        'variants.uri': vmaf.identifier,
      },
      {
        $set: {
          'variants.$.vmafScore': vmaf.log.pooled_metrics.vmaf,
          originalVideoFile: vmaf.originalVideoFile,
          vmafModelPath: vmaf.usedVmafModel,
        },
      },
      { new: true, upsert: true },
    );
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
