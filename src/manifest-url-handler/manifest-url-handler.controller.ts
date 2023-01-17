import { Controller } from '@nestjs/common';
import { RMQRoute, RMQService, RMQTransform } from 'nestjs-rmq';
import {
  InputDataTransport,
  RMQTopic,
  VariantDataTransport,
  VmafInputDataTransport,
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
  ) {}

  @RMQTransform()
  @RMQRoute(RMQTopic.HlsManifestUrlReceived)
  public async handleManifestUrl(inputData: InputDataTransport) {
    const masterPlaylist = await this.manifestUrlHandler.createMasterPlaylist(
      inputData.hlsManifestUrl,
    );

    await this.dao.saveMasterPlaylist(inputData);

    masterPlaylist.variants.forEach(async (variant) => {
      await this.rmqService.notify<VariantDataTransport>(
        RMQTopic.HlsManifestParsed,
        { variant, masterPlaylistUri: masterPlaylist.uri },
      );

      if (inputData.originalVideoUrl) {
        await this.rmqService.notify<VmafInputDataTransport>(
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
        );
      }
    });
  }
}
