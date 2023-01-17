import { Module } from '@nestjs/common';
import { HttpClientModule } from '../http-client/http-client.module';
import { VariantsHandlerService } from './variants-handler.service';
import { VariantsHandlerController } from './variants-handler.controller';
import { DaoModule } from '../mongo/dao/dao.module';
import { FFprobeModule } from 'src/ffprobe/ffprobe.module';

@Module({
  imports: [HttpClientModule, DaoModule, FFprobeModule],
  providers: [VariantsHandlerService],
  exports: [VariantsHandlerService],
  controllers: [VariantsHandlerController],
})
export class VariantsHandlerModule {}
