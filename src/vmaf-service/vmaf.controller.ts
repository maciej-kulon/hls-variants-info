import { Controller } from '@nestjs/common';
import { RMQRoute, RMQService, RMQTransform } from 'nestjs-rmq';
import { RMQTopic, VmafInputDTO, VmafResult } from '../rqm/topics';
import { VmafService } from './vmaf.service';

@Controller()
export class VmafController {
  public constructor(
    private readonly vmafService: VmafService,
    private readonly rmqService: RMQService,
  ) { }
  @RMQTransform()
  @RMQRoute(RMQTopic.VmafInputDataReceived)
  public async handleVmafRequest(vmafInputData: VmafInputDTO) {
    const vmaf = await this.vmafService.computeVmaf(vmafInputData);

    await this.rmqService.notify<VmafResult>(
      RMQTopic.VariantVmafCompleted,
      vmaf,
      { priority: 3 },
    );
  }
}
