import { Module } from '@nestjs/common';
import { HttpClientModule } from '../http-client/http-client.module';
import { VariantService } from './variant.service';
import { VariantsHandlerController } from './variant.controller';
import { DaoModule } from '../mongo/dao/dao.module';
import { FFprobeModule } from 'src/ffprobe/ffprobe.module';

@Module({
  imports: [HttpClientModule, DaoModule, FFprobeModule],
  providers: [VariantService],
  exports: [VariantService],
  controllers: [VariantsHandlerController],
})
export class VariantModule { }
