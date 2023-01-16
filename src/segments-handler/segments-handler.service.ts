import { Injectable } from '@nestjs/common';
import { Dao } from '../mongo/dao/dao.service';
import { FFprobeService } from '../ffprobe/ffprobe.service';
import { SegmentInfo } from '../types/types';
@Injectable()
export class SegmentsHandlerService {
  public constructor(
    private readonly ffprobeService: FFprobeService,
    private readonly dao: Dao,
  ) {} //TODO: DAO, DAL, REPOSITORY

  public async ffprobeSegment(segmentUrl: string): Promise<SegmentInfo> {
    return new Promise((resolve, reject) => {
      this.ffprobeService
        .getFprobeData(segmentUrl)
        .then((ffprobeData) => {
          const bitrate = ffprobeData.format.bit_rate;
          resolve({
            bitrate,
            uri: segmentUrl,
          });
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  }

  public async checkIfAllSegmentsHadBeenAdded(variantUri: string) {
    const desiredSegmentsCount = await this.dao.getVariantDesiredSegmentsCount(
      variantUri,
    );
    const currentSegmentsCount = (
      await this.dao.getAllVariantSegments(variantUri)
    ).length;
    console.log(`${currentSegmentsCount}/${desiredSegmentsCount}`);
    return desiredSegmentsCount === currentSegmentsCount;
  }
}
