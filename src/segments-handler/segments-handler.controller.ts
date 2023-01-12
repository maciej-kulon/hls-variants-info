import { Controller } from '@nestjs/common';
import { types } from 'hls-parser';
import { RMQRoute, RMQService, RMQTransform } from 'nestjs-rmq';
import { FFprobeService } from 'src/ffprobe/ffprobe-service';
import { MediaPlaylistResult } from 'src/types/types';
import { SegmentsHandlerService } from './segments-handler.service';

@Controller()
export class SegmentsHandlerController {
  public constructor(
    private readonly segmentsHandler: SegmentsHandlerService,
    private readonly ffprobeService: FFprobeService,
    private readonly rmqService: RMQService,
  ) {}
  @RMQTransform()
  @RMQRoute('media.playlist.created')
  public async handleSegments(mediaPlaylist: types.MediaPlaylist) {
    const mediaPlaylistResult: MediaPlaylistResult = {
      segments: [],
      uri: '',
    };

    const segmentsUrls = this.segmentsHandler.createSegmentsUrls(mediaPlaylist);

    for (const segmentUrl of segmentsUrls) {
      const ffprobeData = await this.ffprobeService.getFprobeData(segmentUrl);
      mediaPlaylistResult.segments.push({
        ffprobeData,
        uri: mediaPlaylist.uri,
      });
    }

    await this.rmqService.notify<MediaPlaylistResult>(
      'ffprobe.completed',
      mediaPlaylistResult,
    );
  }
}
