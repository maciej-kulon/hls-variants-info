import { Injectable } from '@nestjs/common';
import { HlsParserService } from '../hls-parser/hls-parer.service';

@Injectable()
export class VariantsInfoService {
  public constructor(
    private readonly hlsParser: HlsParserService,
  ) { }

  public async analyzeManifest(manifestUrl: string) {
    if (!manifestUrl) {
      throw new Error('x-manifest-url header can not be empty');
    }

    const masterPlaylist = await this.hlsParser.parseManifest(manifestUrl);
    const variantUrls = this.hlsParser.getVariantsUrls(masterPlaylist);
    console.log(variantUrls);
  }
}