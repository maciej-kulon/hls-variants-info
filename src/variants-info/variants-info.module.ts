import { Module } from '@nestjs/common';
import { HlsParserModule } from '../hls-parser/hls-parer.module';
import { HttpClientModule } from '../http-client/http-client.module';
import { VariantsInfoService } from './variants-info.service';

@Module({
  imports: [HlsParserModule],
  providers: [VariantsInfoService],
  exports: [VariantsInfoService],
})
export class VariantsInfoModule { }