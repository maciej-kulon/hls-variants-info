import { Injectable } from '@nestjs/common';
import { parse, types } from 'hls-parser';
import { HttpClientService } from '../http-client/http-client.service';

export type VariantData = {
  uri: string;

}

@Injectable()
export class HlsParserService {
  public constructor(
    private readonly httpClient: HttpClientService,
  ) { }

  public async parseManifest(manifestUrl: string): Promise<types.MasterPlaylist> {
    const { body: manifestContent } = await this.httpClient.get(manifestUrl);
    const manifest = parse(manifestContent);
    if (!(manifest instanceof types.MasterPlaylist)) {
      throw new Error('Expected manifestContent to be a master playlist.');
    }
    manifest.uri = manifestUrl;
    return manifest;
  }

  public getVariantsUrls(masterPlaylist: types.MasterPlaylist) {
    const urls: string[] = [];
    for (const variant of masterPlaylist.variants) {
      urls.push(this.replaceAfterLastSlash(masterPlaylist.uri, variant.uri));
    }
    return urls;
  }

  public async getSegmentsUrls(variantUri: string) {

  }

  private replaceAfterLastSlash(input: string, newPart: string): string {
    const selectAfterLastSlash = /([^\/]+$)/;
    const regex = new RegExp(selectAfterLastSlash);

    return input.replace(regex, newPart);
  }
}