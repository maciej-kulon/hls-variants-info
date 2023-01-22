import { Injectable } from '@nestjs/common';
import { parse, types } from 'hls-parser';
import { HttpClientService } from '../http-client/http-client.service';

export type VariantData = {
  uri: string;
};

@Injectable()
export class MasterPlaylistService {
  public constructor(private readonly httpClient: HttpClientService) { }

  public async createMasterPlaylist(
    manifestUrl: string,
  ): Promise<types.MasterPlaylist> {
    try {
      const { body: manifestContent } = await this.httpClient.get(manifestUrl);
      const manifest = parse(manifestContent);
      if (!(manifest instanceof types.MasterPlaylist)) {
        throw new Error(
          `Expected manifestUrl: ${manifestUrl} to be a master playlist.`,
        );
      }
      manifest.uri = manifestUrl;
      return manifest;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
