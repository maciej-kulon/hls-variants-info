import { Controller } from '@nestjs/common';
import { RMQRoute, RMQService, RMQTransform } from 'nestjs-rmq';
import {
  InputDTO,
  RMQTopic,
  VariantDTO,
  VmafInputDTO,
} from 'src/types/types';
import { StringUtils } from 'src/utils/string-utils';
import { Dao } from '../mongo/dao/dao.service';
import { ManifestUrlHandlerService } from './manifest-url-handler.service';

@Controller()
export class ManifestUrlHandlerController {
  public constructor(
    private readonly manifestUrlHandler: ManifestUrlHandlerService,
    private readonly rmqService: RMQService,
    private readonly dao: Dao,
  ) { }

  @RMQTransform()
  @RMQRoute(RMQTopic.HlsManifestUrlReceived)
  public async handleManifestUrl(inputData: InputDTO) {
    const masterPlaylist = await this.manifestUrlHandler.createMasterPlaylist(
      inputData.hlsManifestUrl,
    );

    await this.dao.saveMasterPlaylist(inputData);

    for (const variant of masterPlaylist.variants) {
      await this.rmqService.notify<VariantDTO>(
        RMQTopic.HlsManifestParsed,
        { variant, masterPlaylistUri: masterPlaylist.uri },
        { priority: 5 },
      );

      if (inputData.originalVideoUrl) {
        await this.rmqService.notify<VmafInputDTO>(
          RMQTopic.VmafInputDataReceived,
          {
            variantUri: StringUtils.replaceAfterLastSlash(
              inputData.hlsManifestUrl,
              variant.uri,
            ),
            originalVideoUrl: inputData.originalVideoUrl,
            vmafModel: inputData.vmafModel,
            enablePhoneModel: inputData.enablePhoneModel,
          },
          { priority: 2 },
        );
      }
    }
  }
}
