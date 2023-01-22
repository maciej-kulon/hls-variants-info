import { Controller } from '@nestjs/common';
import { RMQRoute, RMQService, RMQTransform } from 'nestjs-rmq';
import { Dao } from '../mongo/dao/dao.service';
import {
  RMQTopic,
  VariantInfo,
  VariantDTO,
  VmafResult,
} from '../types/types';
import { VariantsHandlerService } from './variants-handler.service';

@Controller()
export class VariantsHandlerController {
  public constructor(
    private readonly variantsHandlerService: VariantsHandlerService,
    private readonly dao: Dao,
    private readonly rmqService: RMQService,
  ) { }
  @RMQTransform()
  @RMQRoute(RMQTopic.HlsManifestParsed)
  public async handleVariants(variantTransport: VariantDTO) {
    const variantInfo = await this.variantsHandlerService.createVariantInfo(
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
      await this.variantsHandlerService.aggregateBitrateValues(segments);
    await this.dao.updateBitrateValues(variantUri, bitrateValues);
  }

  @RMQTransform()
  @RMQRoute(RMQTopic.VariantVmafCompleted)
  public async updateVmafResults(vmaf: VmafResult) {
    await this.dao.updateVmafResult(vmaf);
  }
}
