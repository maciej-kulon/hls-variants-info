import { Module } from '@nestjs/common';
import { FFprobeModule } from 'src/ffprobe/ffprobe.module';
import { HttpClientModule } from 'src/http-client/http-client.module';
import { SegmentsHandlerController } from './segments-handler.controller';
import { SegmentsHandlerService } from './segments-handler.service';

@Module({
  imports: [HttpClientModule, FFprobeModule],
  providers: [SegmentsHandlerService],
  exports: [SegmentsHandlerService],
  controllers: [SegmentsHandlerController],
})
export class SegmentsHandlerModule {}
