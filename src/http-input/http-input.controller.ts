import { Controller, Headers, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { RMQService } from 'nestjs-rmq';

@Controller()
export class HttpInputController {
  public constructor(private readonly rmqService: RMQService) {}

  @Post('/hls-manifest')
  public async analyzeManifest(
    @Headers('x-manifest-url') manifestUrl: string,
    @Res() res: Response,
  ): Promise<void> {
    res.status(202).send();
    await this.rmqService.notify<string>('manifest.url.received', manifestUrl);
  }
}
