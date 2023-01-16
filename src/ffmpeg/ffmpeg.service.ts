import { Injectable } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import { OriginalVideoData, VmafResult } from '../types/types';

@Injectable()
export class FFmpegService {
  public async vmaf(
    distorted: string,
    original: OriginalVideoData,
    modelPath?: string,
  ): Promise<VmafResult> {
    return new Promise((resolve, reject) => {
      try {
        const cmd = ffmpeg({ stdoutLines: 0 });
        const filePath = `/usr/vmaf${Buffer.from(distorted).toString(
          'base64',
        )}.json`;

        this.subscribeToFfmpegEvents(
          cmd,
          (_) => {
            const data = fs.readFileSync(filePath).toString();
            fs.unlinkSync(filePath);
            resolve({ identifier: distorted, log: JSON.parse(data) });
          },
          reject,
        );

        cmd
          .addInput(distorted)
          .addInput(original.source)
          .addOption(
            '-filter_complex',
            `[0:v]scale=${original.width}:${original.height},framerate=${
              original.fps
            }[dist]; [1:v]scale=${original.width}:${
              original.height
            },framerate=${
              original.fps
            }[original]; [dist][original]libvmaf=log_fmt=json:log_path=${filePath}${
              process.env.RUNS_IN_CONTAINER
                ? modelPath
                  ? modelPath
                  : ':model_path=/usr/local/share/model/vmaf_v0.6.1.json'
                : ''
            }`,
          )
          .format('null')
          .save('-');
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  private subscribeToFfmpegEvents(
    ffmpeg: ffmpeg.FfmpegCommand,
    callback: any,
    errorHandler: any,
  ): void {
    ffmpeg.on('error', (error) => {
      console.log(error);
      errorHandler(error);
    });
    ffmpeg.on('progress', ({ percent }) => {
      console.log(`${Math.round(percent)}%`);
    });
    ffmpeg.on('end', callback);
    ffmpeg.on('start', console.log);
    ffmpeg.on('stderr', console.log);
  }
}
