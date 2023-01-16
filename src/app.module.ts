import { Module } from '@nestjs/common';
import { RMQModule } from 'nestjs-rmq';
import { ManifestUrlHandlerModule } from './manifest-url-handler/manifest-url-handler.module';
import { HttpInputModule } from './http-input/http-input.module';
import { VariantsHandlerModule } from './variants-handler/variants-handler.module';
import { SegmentsHandlerModule } from './segments-handler/segments-handler.module';
import { MongooseModule } from '@nestjs/mongoose';
import { VmafModule } from './vmafService/vmaf.module';

@Module({
  imports: [
    HttpInputModule,
    ManifestUrlHandlerModule,
    VariantsHandlerModule,
    SegmentsHandlerModule,
    VmafModule,
    MongooseModule.forRoot(
      `mongodb://root:root@${process.env.MONGO_HOSTNAME}:27017/hls-variants-info?tls=false&ssl=false&authSource=admin`,
    ),
    RMQModule.forRoot({
      serviceName: 'hls-variants-info',
      exchangeName: 'hls-exchange',
      prefetchCount: 30,
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
export class AppModule {}
