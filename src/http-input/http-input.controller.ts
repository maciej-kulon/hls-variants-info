import { Controller, Get, Headers, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { RMQService } from 'nestjs-rmq';
import { RMQTopic } from 'src/rqm/topics';
import { glob } from 'glob';
import { InputDTO } from 'src/master-playlist/master-playlist.types';

@Controller()
export class HttpInputController {
  public constructor(private readonly rmqService: RMQService) { }

  @Post('/hls-manifest')
  public async analyzeManifest(
    @Headers('x-manifest-url') hlsManifestUrl: string,
    @Headers('x-tag') tag: string,
    @Headers('x-vmaf-model') vmafModel: string,
    @Headers('x-enable-phone-model') enablePhoneModel: boolean,
    @Headers('x-original-video-url') originalVideoUrl: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!hlsManifestUrl) {
      res.status(400).send('x-manifest-url header is required');
      return;
    }

    await this.rmqService.notify<InputDTO>(
      RMQTopic.HlsManifestUrlReceived,
      {
        hlsManifestUrl,
        originalVideoUrl,
        tag,
        vmafModel,
        enablePhoneModel,
      },
      { priority: 4 },
    );

    res.status(202).send();
  }

  @Get('/vmaf-models')
  public async gatAvailableVmafModels(@Res() res: Response) {
    glob('/usr/local/share/model/**/*', (err, files) => {
      if (err) {
        return res.status(500).send('Glob function failed');
      } else {
        return res.status(200).send(files);
      }
    });
  }
}
