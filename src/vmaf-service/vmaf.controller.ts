import { Controller } from '@nestjs/common';
import { RMQRoute, RMQService, RMQTransform } from 'nestjs-rmq';
import { RMQTopic, VmafInputDataTransport, VmafResult } from '../types/types';
import { VmafService } from './vmaf.service';

@Controller()
export class VmafController {
  public constructor(
    private readonly vmafService: VmafService,
    private readonly rmqService: RMQService,
  ) {}
  @RMQTransform()
  @RMQRoute(RMQTopic.VmafInputDataReceived)
  public async handleVmafRequest(vmafInputData: VmafInputDataTransport) {
    const vmaf = await this.vmafService.computeVmaf(vmafInputData);

    await this.rmqService.notify<VmafResult>(
      RMQTopic.VariantVmafCompleted,
      vmaf,
      { priority: 3 },
    );
  }
}
