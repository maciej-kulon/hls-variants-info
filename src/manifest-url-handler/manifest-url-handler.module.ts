import { Module } from '@nestjs/common';
import { DaoModule } from '../mongo/dao/dao.module';
import { HttpClientModule } from '../http-client/http-client.module';
import { ManifestUrlHandlerController } from './manifest-url-handler.controller';
import { ManifestUrlHandlerService } from './manifest-url-handler.service';

@Module({
  imports: [HttpClientModule, DaoModule],
  providers: [ManifestUrlHandlerService],
  exports: [ManifestUrlHandlerService],
  controllers: [ManifestUrlHandlerController],
})
export class ManifestUrlHandlerModule {}
