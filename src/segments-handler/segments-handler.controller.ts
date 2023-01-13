import { Controller } from '@nestjs/common';
import { types } from 'hls-parser';
import { RMQRoute, RMQService, RMQTransform } from 'nestjs-rmq';
import { FFprobeService } from 'src/ffprobe/ffprobe-service';
import { MediaPlaylistResult, SegmentResult } from 'src/types/types';
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
    const segmentsUrls = await this.segmentsHandler.createSegmentsUrls(
      mediaPlaylist,
    );

    const promises: Promise<SegmentResult>[] = [];
    for (const segmentUrl of segmentsUrls) {
      promises.push(
        new Promise((resolve, reject) => {
          this.ffprobeService
            .getFprobeData(segmentUrl)
            .then((ffprobeData) => {
              resolve({
                ffprobeData,
                uri: segmentUrl,
              });
            })
            .catch((err) => {
              console.error(err);
              reject(err);
            });
        }),
      );
    }

    const segmentsResults = await Promise.all(promises);

    const mediaPlaylistResult: MediaPlaylistResult = {
      segments: segmentsResults,
      uri: mediaPlaylist.uri,
    };

    console.log(mediaPlaylistResult);

    await this.rmqService.notify<MediaPlaylistResult>(
      'ffprobe.completed',
      mediaPlaylistResult,
    );
  }
}
