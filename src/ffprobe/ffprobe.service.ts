import { Injectable } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';

@Injectable()
export class FFprobeService {
  public async getFprobeData(url: string): Promise<ffmpeg.FfprobeData> {
    return new Promise((resolve, reject) => {
      try {
        const cmd = ffmpeg();
        cmd.addInput(url).ffprobe((error, data) => {
          if (error) {
            return reject(error);
          }
          resolve(data);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  public getWidth(ffprobeData: ffmpeg.FfprobeData) {
    return ffprobeData.streams.find((stream) => stream.codec_type === 'video')
      .width;
  }

  public getHeight(ffprobeData: ffmpeg.FfprobeData) {
    return ffprobeData.streams.find((stream) => stream.codec_type === 'video')
      .height;
  }

  public getFPS(ffprobeData: ffmpeg.FfprobeData) {
    return ffprobeData.streams.find((stream) => stream.codec_type === 'video')
      .r_frame_rate;
  }
}
