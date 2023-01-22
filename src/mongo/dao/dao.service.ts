import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MasterPlaylist } from '../master-playlist/master-playlist.schema';
import {
  BitrateAggregation,
  InputDTO,
  VariantInfo,
  VmafResult,
} from '../../types/types';
import { SegmentInfo } from 'src/segments-handler/segments.dto';

@Injectable()
export class Dao {
  public constructor(
    @InjectModel(MasterPlaylist.name)
    private readonly model: Model<MasterPlaylist>,
  ) { }
  public async saveMasterPlaylist(inputData: InputDTO) {
    await this.model.findOneAndReplace(
      { uri: inputData.hlsManifestUrl },
      {
        uri: inputData.hlsManifestUrl,
        variants: [],
        vmafModelPath: inputData.vmafModel,
        tag: inputData.tag,
        originalVideoFile: inputData.originalVideoUrl,
      },
      { new: true, upsert: true },
    );
  }

  public async addVariant(variantInfo: VariantInfo) {
    await this.model.findOneAndUpdate(
      { uri: variantInfo.masterPlaylistUri },
      {
        $push: {
          'variants': {
            uri: variantInfo.playlist.uri,
            codecs: variantInfo.codecs,
            resolution: variantInfo.resolution,
            declaredMaxBitrate: variantInfo.declaredMaxBitrate,
            declaredAvgBitrate: variantInfo.declaredAvgBitrate,
            segmentsCount: variantInfo.playlist.segments.length,
            segments: [],
          }
        },
      },
    );
  }

  public async addSegment(variantUri: string, segment: SegmentInfo) {
    await this.model.findOneAndUpdate(
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
    await this.model.findOneAndUpdate(
      { 'variants.uri': variantUri },
      {
        $set: {
          'variants.$.measuredMaxBitrate': data.max,
          'variants.$.measuredMinBitrate': data.min,
          'variants.$.measuredAvgBitrate': data.average,
        }
      }
    );
  }

  public async updateVmafResult(vmaf: VmafResult) {
    await this.model.findOneAndUpdate(
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

  public async getMasterPlaylistByVariantUri(variantUri: string) {
    return await this.model.findOne({
      'variants.uri': variantUri,
    });
  }
}
