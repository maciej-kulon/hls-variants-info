import { Module } from '@nestjs/common';
import { DaoModule } from '../mongo/dao/dao.module';
import { HttpClientModule } from '../http-client/http-client.module';
import { MasterPlaylistController } from './master-playlist.controller';
import { MasterPlaylistService } from './master-playlist.service';

@Module({
  imports: [HttpClientModule, DaoModule],
  providers: [MasterPlaylistService],
  exports: [MasterPlaylistService],
  controllers: [MasterPlaylistController],
})
export class MasterPlaylistModule { }
