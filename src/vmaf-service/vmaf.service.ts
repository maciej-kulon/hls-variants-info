import { Injectable } from '@nestjs/common';
import { FFmpegService } from 'src/ffmpeg/ffmpeg.service';
import { FFprobeService } from 'src/ffprobe/ffprobe.service';
import { VmafInputDTO } from './vmaf.dto';

@Injectable()
export class VmafService {
  public constructor(
    private readonly ffprobeService: FFprobeService,
    private readonly ffmpegService: FFmpegService,
  ) { }
  public async computeVmaf(vmafInputData: VmafInputDTO) {
    const originalVideoData = await this.ffprobeService.getFprobeData(
      vmafInputData.originalVideoUrl,
    );

    const distortedVideoData = await this.ffprobeService.getFprobeData(
      vmafInputData.variantUri,
    );

    const originalFps = this.calculateFPS(
      this.ffprobeService.getFPS(originalVideoData),
    );

    const distortedFps = this.calculateFPS(
      this.ffprobeService.getFPS(distortedVideoData),
    );

    return await this.ffmpegService.calculateVmaf(
      vmafInputData.variantUri,
      {
        source: vmafInputData.originalVideoUrl,
        width: this.ffprobeService.getWidth(originalVideoData),
        height: this.ffprobeService.getHeight(originalVideoData),
        fps: (distortedFps < originalFps
          ? distortedFps
          : originalFps
        ).toString(),
      },
      vmafInputData.vmafModel,
      vmafInputData.enablePhoneModel,
    );
  }

  public calculateFPS(frameRate: string) {
    const numbers = frameRate.split('/');
    return parseInt(numbers[0]) / parseInt(numbers[1]);
  }
}
