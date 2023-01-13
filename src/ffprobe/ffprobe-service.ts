import { Injectable } from '@nestjs/common';
import { ffprobe, FfprobeData } from 'fluent-ffmpeg';

@Injectable()
export class FFprobeService {
  public async getFprobeData(url: string): Promise<FfprobeData> {
    return new Promise((resolve, reject) => {
      ffprobe(url, (error, data) => {
        if (error) {
          reject(error);
        }
        resolve(data);
      });
    });
  }
}
