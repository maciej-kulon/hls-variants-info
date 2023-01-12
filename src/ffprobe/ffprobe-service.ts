import { Injectable } from '@nestjs/common';
import { Duplex } from 'stream';
import { FfmpegCommand, FfprobeData } from 'fluent-ffmpeg';

@Injectable()
export class FFprobeService {
  public async getFprobeData(url: string): Promise<FfprobeData> {
    return new Promise((resolve, reject) => {
      const cmd = new FfmpegCommand();
      cmd.addInput(url).ffprobe((error, data) => {
        console.error(error);
        if (error) {
          reject(error);
        }
        resolve(data);
      });
    });
  }
}
