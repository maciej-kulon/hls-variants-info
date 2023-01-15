import { Injectable, Scope } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';

@Injectable()
export class FFprobeService {
  public async getFprobeData(url: string): Promise<ffmpeg.FfprobeData> {
    return new Promise((resolve, reject) => {
      try {
        const cmd = ffmpeg();
        cmd.addInput(url).ffprobe((error, data) => {
          if (error) {
            console.log(error);
            return reject(error);
          }
          resolve(data);
        });
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }
}
