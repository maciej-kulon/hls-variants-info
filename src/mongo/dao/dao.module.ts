import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MasterPlaylistSchema } from '../master-playlist/master-playlist.model';
import { Dao } from './dao.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'MasterPlaylist',
        schema: MasterPlaylistSchema,
      },
    ]),
  ],
  providers: [Dao],
  exports: [Dao],
})
export class DaoModule {}
