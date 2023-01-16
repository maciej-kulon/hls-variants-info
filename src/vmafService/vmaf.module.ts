import { Module } from '@nestjs/common';
import { RMQModule } from 'nestjs-rmq';
import { FFmpegModule } from 'src/ffmpeg/ffmpeg.module';
import { FFprobeModule } from 'src/ffprobe/ffprobe.module';
import { VmafController } from './vmaf.controller';
import { VmafService } from './vmaf.service';

@Module({
  imports: [FFprobeModule, FFmpegModule],
  providers: [VmafService],
  exports: [VmafService],
  controllers: [VmafController],
})
export class VmafModule {}
