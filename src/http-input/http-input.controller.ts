import { Controller, Headers, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { RMQService } from 'nestjs-rmq';
import { InputDataTransport, RMQTopic } from 'src/types/types';

@Controller()
export class HttpInputController {
  public constructor(private readonly rmqService: RMQService) {}

  @Post('/hls-manifest')
  public async analyzeManifest(
    @Headers('x-manifest-url') hlsManifestUrl: string,
    @Headers('x-original-video-url') originalVideoUrl: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!hlsManifestUrl) {
      res.status(400).send('x-manifest-url header is required');
      return;
    }

    await this.rmqService.notify<InputDataTransport>(
      RMQTopic.HlsManifestUrlReceived,
      {
        hlsManifestUrl,
        originalVideoUrl,
      },
    );

    res.status(202).send();
  }
}
