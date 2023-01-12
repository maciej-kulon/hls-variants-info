import { Module } from '@nestjs/common';
import { HttpClientModule } from '../http-client/http-client.module';
import { HlsParserService } from './hls-parer.service';

@Module({
  imports: [HttpClientModule],
  providers: [HlsParserService],
  exports: [HlsParserService],
})
export class HlsParserModule { }