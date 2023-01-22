import { Controller } from '@nestjs/common';
import { RMQRoute, RMQService, RMQTransform } from 'nestjs-rmq';
import {
  RMQTopic,
} from 'src/rqm/topics';
import { StringUtils } from 'src/utils/string-utils';
import { VariantDTO } from 'src/variant/variant.types';
import { VmafInputDTO } from 'src/vmaf-service/vmaf.dto';
import { Dao } from '../mongo/dao/dao.service';
import { MasterPlaylistService } from './master-playlist.service';
import { InputDTO } from './master-playlist.types';

@Controller()
export class MasterPlaylistController {
  public constructor(
    private readonly masterPlaylistService: MasterPlaylistService,
    private readonly rmqService: RMQService,
    private readonly dao: Dao,
  ) { }

  @RMQTransform()
  @RMQRoute(RMQTopic.HlsManifestUrlReceived)
  public async handleManifestUrl(inputData: InputDTO) {
    const masterPlaylist = await this.masterPlaylistService.createMasterPlaylist(
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
