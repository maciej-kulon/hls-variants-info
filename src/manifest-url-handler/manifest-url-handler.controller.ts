import { Controller } from '@nestjs/common';
import { types } from 'hls-parser';
import {
  ExtendedMessage,
  RMQError,
  RMQMessage,
  RMQRoute,
  RMQService,
  RMQTransform,
} from 'nestjs-rmq';
import { ManifestUrlHandlerService } from './manifest-url-handler.service';

@Controller()
export class ManifestUrlHandlerController {
  public constructor(
    private readonly manifestUrlHandler: ManifestUrlHandlerService,
    private readonly rmqService: RMQService,
  ) {}

  @RMQTransform()
  @RMQRoute('manifest.url.received')
  public async handleManifestUrl(manifestUrl: string) {
    const masterPlaylist = await this.manifestUrlHandler.createMasterPlaylist(
      manifestUrl,
    );

    await this.rmqService.notify<types.MasterPlaylist>(
      'master.playlist.created',
      masterPlaylist,
    );
  }
}
