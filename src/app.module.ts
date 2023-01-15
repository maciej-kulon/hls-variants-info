import { Module } from '@nestjs/common';
import { RMQModule } from 'nestjs-rmq';
import { ManifestUrlHandlerModule } from './manifest-url-handler/manifest-url-handler.module';
import { HttpInputModule } from './http-input/http-input.module';
import { VariantsHandlerModule } from './variants-handler/variants-handler.module';
import { SegmentsHandlerModule } from './segments-handler/segments-handler.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    HttpInputModule,
    ManifestUrlHandlerModule,
    VariantsHandlerModule,
    SegmentsHandlerModule,
    MongooseModule.forRoot(
      // 'mongodb://root:root@hls-variants-mongo:27017/hls-variants-info?tls=false&ssl=false&authSource=admin',
      'mongodb://root:root@0.0.0.0:27017/hls-variants-info?tls=false&ssl=false&authSource=admin',
    ),
    RMQModule.forRoot({
      serviceName: 'hls-variants-info',
      exchangeName: 'hls-exchange',
      prefetchCount: 30,
      connections: [
        {
          login: 'rabbitmq',
          password: 'example',
          // host: 'hls-variants-broker:5672',
          host: '0.0.0.0:5672',
        },
      ],
      queueName: 'hls-variants-info-queue',
    }),
  ],
})
export class AppModule {}
