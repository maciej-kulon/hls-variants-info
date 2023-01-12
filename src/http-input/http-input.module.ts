import { Module } from '@nestjs/common';
import { ManifestUrlHandlerModule } from '../manifest-url-handler/manifest-url-handler.module';
import { HttpInputController } from './http-input.controller';

@Module({
  controllers: [HttpInputController],
})
export class HttpInputModule {}
