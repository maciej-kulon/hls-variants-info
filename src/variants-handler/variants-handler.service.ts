import { Injectable } from '@nestjs/common';
import { parse, types } from 'hls-parser';
import { BitrateAggregation, SegmentInfo, VariantInfo } from '../types/types';
import { HttpClientService } from '../http-client/http-client.service';
import { StringUtils } from '../utils/string-utils';

@Injectable()
export class VariantsHandlerService {
  public constructor(private readonly httpClient: HttpClientService) {}

  public async createVariantInfo(
    variant: types.Variant,
    masterPlaylistUri: string,
  ): Promise<VariantInfo> {
    const variantUrl = StringUtils.replaceAfterLastSlash(
      masterPlaylistUri,
      variant.uri,
    );

    const { body: playlistContent } = await this.httpClient.get(variantUrl);

    const mediaPlaylist = parse(playlistContent);

    if (!(mediaPlaylist instanceof types.MediaPlaylist)) {
      throw Error(`Expected variantUrl: ${variantUrl} to be a MediaPlaylist.`);
    }

    mediaPlaylist.uri = variantUrl;

    return {
      playlist: mediaPlaylist,
      declaredMaxBitrate: variant.bandwidth || 0,
      declaredAvgBitrate: variant.averageBandwidth || 0,
      measuredMaxBitrate: -1,
      measuredMinBitrate: -1,
      measuredAvgBitrate: -1,
      codecs: variant.codecs,
      masterPlaylistUri,
    };
  }

  public async aggregateBitrateValues(
    segments: SegmentInfo[],
  ): Promise<BitrateAggregation> {
    return new Promise((resolve, reject) => {
      try {
        let minBitrate = Number.MAX_VALUE;
        let maxBitrate = 0;
        let sum = 0;

        for (const segment of segments) {
          if (segment.bitrate < minBitrate) minBitrate = segment.bitrate;
          if (segment.bitrate > maxBitrate) maxBitrate = segment.bitrate;
          sum += segment.bitrate;
        }

        resolve({
          min: minBitrate,
          max: maxBitrate,
          average: Math.round(sum / segments.length),
        });
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  }
}
