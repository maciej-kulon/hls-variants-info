import { Module } from '@nestjs/common';
import { RMQModule } from 'nestjs-rmq';
import { MasterPlaylistModule } from './master-playlist/master-playlist.module';
import { HttpInputModule } from './http-input/http-input.module';
import { VariantModule } from './variant/variant.module';
import { SegmentModule } from './segment/segment.module';
import { MongooseModule } from '@nestjs/mongoose';
import { VmafModule } from './vmaf-service/vmaf.module';

@Module({
  imports: [
    HttpInputModule,
    MasterPlaylistModule,
    VariantModule,
    SegmentModule,
    VmafModule,
    MongooseModule.forRoot(
      `mongodb://root:root@${process.env.MONGO_HOSTNAME}:27017/hls-variants-info?tls=false&ssl=false&authSource=admin`,
    ),
    RMQModule.forRoot({
      serviceName: 'hls-variants-info',
      exchangeName: 'hls-exchange',
      prefetchCount: 30,
      queueOptions: {
        maxPriority: 9,
      },
      connections: [
        {
          login: 'rabbitmq',
          password: 'example',
          host: `${process.env.RABBIT_HOSTNAME}:5672`,
        },
      ],
      queueName: 'hls-variants-info-queue',
    }),
  ],
})
export class AppModule { }
