import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MasterPlaylist, MasterPlaylistSchema } from '../master-playlist/master-playlist.schema';
import { Dao } from './dao.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MasterPlaylist.name,
        schema: MasterPlaylistSchema,
      },
    ]),
  ],
  providers: [Dao],
  exports: [Dao],
})
export class DaoModule { }
