import { Injectable } from '@nestjs/common';
import got, { Got } from 'got';

@Injectable()
export class HttpClientService {
  private httpClient: Got = got.extend({
    retry: {
      limit: 5,
    },
  });

  public async get(url: string | URL) {
    return await this.httpClient.get(url);
  }
}
