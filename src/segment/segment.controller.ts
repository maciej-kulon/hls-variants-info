import { Controller } from '@nestjs/common';
import {
  RMQRoute,
  RMQService,
  RMQTransform,
} from 'nestjs-rmq';
import { StringUtils } from '../utils/string-utils';
import {
  RMQTopic,
} from '../rqm/topics';
import { SegmentService } from './segment.service';
import { Dao } from '../mongo/dao/dao.service';
import { SegmentDTO } from './segment.types';
import { Segment } from 'src/segment/segment.schema';
import { VariantInfo } from 'src/variant/variant.types';

@Controller()
export class SegmentController {
  public constructor(
    private readonly segmentService: SegmentService,
    private readonly dao: Dao,
    private readonly rmqService: RMQService,
  ) { }
  @RMQTransform()
  @RMQRoute(RMQTopic.VariantDataCreated)
  public async handleSegmentsUrls(variantInfo: VariantInfo) {
    for (const segment of variantInfo.playlist.segments) {
      const segmentUrl = StringUtils.replaceAfterLastSlash(
        variantInfo.playlist.uri,
        segment.uri,
      );
      await this.rmqService.notify<SegmentDTO>(
        RMQTopic.SegmentReadyToProbe,
        {
          segmentUrl,
          mediaPlaylistUrl: variantInfo.playlist.uri,
        },
        { priority: 7 },
      );
    }
  }

  @RMQTransform()
  @RMQRoute(RMQTopic.SegmentReadyToProbe)
  public async handleSegmentFfprobe(segmentTransport: SegmentDTO) {
    let segmentInfo: Segment;
    try {
      segmentInfo = await this.segmentService.ffprobeSegment(
        segmentTransport.segmentUrl,
      );
    } catch (error) {
      console.error(
        `Failed to perform ffprobe on segment: ${segmentTransport.segmentUrl}`, error,
      );
      segmentInfo = {
        uri: segmentTransport.segmentUrl,
        bitrate: -1,
      };
    }

    await this.dao.addSegment(segmentTransport.mediaPlaylistUrl, segmentInfo);

    const lastSegmentHasBeenAdded =
      await this.segmentService.checkIfAllSegmentsHadBeenAdded(
        segmentTransport.mediaPlaylistUrl,
      );

    if (lastSegmentHasBeenAdded) {
      await this.rmqService.notify<string>(
        RMQTopic.SegmentsFfprobeCompleted,
        segmentTransport.mediaPlaylistUrl,
        { priority: 8 },
      );
    }
  }
}
