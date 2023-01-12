import { Controller } from '@nestjs/common';
import { types } from 'hls-parser';
import { RMQRoute, RMQService, RMQTransform } from 'nestjs-rmq';
import { VariantsHandlerService } from './variants-handler.service';

@Controller()
export class VariantsHandlerController {
  public constructor(
    private readonly variantsHandlerService: VariantsHandlerService,
    private readonly rmqService: RMQService,
  ) {}
  @RMQTransform()
  @RMQRoute('master.playlist.created')
  public async handleVariants(masterPlaylist: types.MasterPlaylist) {
    const variantsUrls =
      this.variantsHandlerService.createVariantsUrls(masterPlaylist);
    for (const variantUrl of variantsUrls) {
      const mediaPlaylist =
        await this.variantsHandlerService.createMediaPlaylist(variantUrl);
      console.log(mediaPlaylist);
      await this.rmqService.notify<types.MediaPlaylist>(
        'media.playlist.created',
        mediaPlaylist,
      );
    }
  }
}
