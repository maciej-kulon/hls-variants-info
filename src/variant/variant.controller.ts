import { Controller } from '@nestjs/common';
import { RMQRoute, RMQService, RMQTransform } from 'nestjs-rmq';
import { VmafResult } from 'src/vmaf-service/vmaf.dto';
import { Dao } from '../mongo/dao/dao.service';
import {
  RMQTopic,
} from '../rqm/topics';
import { VariantDTO, VariantInfo } from './variant.types';
import { VariantService } from './variant.service';

@Controller()
export class VariantsHandlerController {
  public constructor(
    private readonly variantService: VariantService,
    private readonly dao: Dao,
    private readonly rmqService: RMQService,
  ) { }
  @RMQTransform()
  @RMQRoute(RMQTopic.HlsManifestParsed)
  public async handleVariant(variantTransport: VariantDTO) {
    const variantInfo = await this.variantService.createVariantInfo(
      variantTransport.variant,
      variantTransport.masterPlaylistUri,
    );

    await this.dao.addVariant(variantInfo);

    await this.rmqService.notify<VariantInfo>(
      RMQTopic.VariantDataCreated,
      variantInfo,
      { priority: 6 },
    );
  }

  @RMQTransform()
  @RMQRoute(RMQTopic.SegmentsFfprobeCompleted)
  public async updateBitrateValues(variantUri: string) {
    const segments = await this.dao.getAllVariantSegments(variantUri);
    const bitrateValues =
      await this.variantService.aggregateBitrateValues(segments);
    await this.dao.updateBitrateValues(variantUri, bitrateValues);
  }

  @RMQTransform()
  @RMQRoute(RMQTopic.VariantVmafCompleted)
  public async updateVmafResults(vmaf: VmafResult) {
    await this.dao.updateVmafResult(vmaf);
  }
}
