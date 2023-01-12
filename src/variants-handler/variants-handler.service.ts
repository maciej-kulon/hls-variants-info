import { Injectable } from '@nestjs/common';
import { parse, types } from 'hls-parser';
import { HttpClientService } from 'src/http-client/http-client.service';
import { StringUtils } from 'src/utils/string-utils';

@Injectable()
export class VariantsHandlerService {
  public constructor(private readonly httpClient: HttpClientService) {}
  public createVariantsUrls(masterPlaylist: types.MasterPlaylist) {
    const urls: string[] = [];
    for (const variant of masterPlaylist.variants) {
      urls.push(
        StringUtils.replaceAfterLastSlash(masterPlaylist.uri, variant.uri),
      );
    }
    return urls;
  }

  public async createMediaPlaylist(
    variantUrl: string,
  ): Promise<types.MediaPlaylist> {
    const { body: playlistContent } = await this.httpClient.get(variantUrl);
    const mediaPlaylist = parse(playlistContent);
    if (!(mediaPlaylist instanceof types.MediaPlaylist)) {
      throw Error(`Expected variantUrl: ${variantUrl} to be a MediaPlaylist.`);
    }
    mediaPlaylist.uri = variantUrl;
    return mediaPlaylist;
  }
}
