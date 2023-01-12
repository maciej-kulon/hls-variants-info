import { Injectable } from '@nestjs/common';
import { types } from 'hls-parser';
import { HttpClientService } from 'src/http-client/http-client.service';
import { StringUtils } from 'src/utils/string-utils';
import { Duplex } from 'stream';

@Injectable()
export class SegmentsHandlerService {
  public constructor(private readonly httpClient: HttpClientService) {}
  public createSegmentsUrls(mediaPlaylist: types.MediaPlaylist) {
    const urls: string[] = [];
    for (const segment of mediaPlaylist.segments) {
      urls.push(
        StringUtils.replaceAfterLastSlash(mediaPlaylist.uri, segment.uri),
      );
    }
    return urls;
  }
}
