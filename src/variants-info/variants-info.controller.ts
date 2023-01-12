import { Controller, Headers, Post } from '@nestjs/common';
import { VariantsInfoService } from './variants-info.service';

@Controller()
export class VariantsInfoController {
  public constructor(private readonly service: VariantsInfoService) { }

  @Post('/hls-manifest')
  public async analyzeManifest(
    @Headers('x-manifest-url') manifestUrl: string,
  ): Promise<void> {
    try {
      await this.service.analyzeManifest(manifestUrl);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }
}