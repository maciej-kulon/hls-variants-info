import { Module } from '@nestjs/common';
import { HttpClientModule } from 'src/http-client/http-client.module';
import { VariantsHandlerService } from './variants-handler.service';
import { VariantsHandlerController } from './variants-handler.controller';

@Module({
  imports: [HttpClientModule],
  providers: [VariantsHandlerService],
  exports: [VariantsHandlerService],
  controllers: [VariantsHandlerController],
})
export class VariantsHandlerModule {}
