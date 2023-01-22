import { Module } from '@nestjs/common';
import { FFprobeModule } from 'src/ffprobe/ffprobe.module';
import { HttpClientModule } from 'src/http-client/http-client.module';
import { DaoModule } from 'src/mongo/dao/dao.module';
import { SegmentController } from './segment.controller';
import { SegmentService } from './segment.service';

@Module({
  imports: [HttpClientModule, FFprobeModule, DaoModule],
  providers: [SegmentService],
  exports: [SegmentService],
  controllers: [SegmentController],
})
export class SegmentModule { }
