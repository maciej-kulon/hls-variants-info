import { Controller } from '@nestjs/common';
import { RMQRoute, RMQService, RMQTransform } from 'nestjs-rmq';
import { StringUtils } from '../utils/string-utils';
import { RMQTopic, SegmentDataTransport, VariantInfo } from '../types/types';
import { SegmentsHandlerService } from './segments-handler.service';
import { Dao } from '../mongo/dao/dao.service';
import { last } from 'rxjs';

@Controller()
export class SegmentsHandlerController {
  public constructor(
    private readonly segmentsHandler: SegmentsHandlerService,
    private readonly dao: Dao,
    private readonly rmqService: RMQService,
  ) {}
  @RMQTransform()
  @RMQRoute(RMQTopic.VariantDataCreated)
  public async handleSegmentsUrls(variantInfo: VariantInfo) {
    for (const segment of variantInfo.playlist.segments) {
      const segmentUrl = StringUtils.replaceAfterLastSlash(
        variantInfo.playlist.uri,
        segment.uri,
      );
      await this.rmqService.notify<SegmentDataTransport>(
        RMQTopic.SegmentReadyToProbe,
        {
          segmentUrl,
          mediaPlaylistUrl: variantInfo.playlist.uri,
        },
      );
    }
  }

  @RMQTransform()
  @RMQRoute(RMQTopic.SegmentReadyToProbe)
  public async handleSegmentFfprobe(segmentTransport: SegmentDataTransport) {
    const segmentInfo = await this.segmentsHandler.ffprobeSegment(
      segmentTransport.segmentUrl,
    );

    await this.dao.addSegment(segmentTransport.mediaPlaylistUrl, segmentInfo);

    const lastSegmentHasBeenAdded =
      await this.segmentsHandler.checkIfAllSegmentsHadBeenAdded(
        segmentTransport.mediaPlaylistUrl,
      );

    if (lastSegmentHasBeenAdded) {
      await this.rmqService.notify<string>(
        RMQTopic.SegmentsFfprobeCompleted,
        segmentTransport.mediaPlaylistUrl,
      );
    }
  }
}
