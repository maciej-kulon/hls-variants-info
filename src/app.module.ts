import { Module } from '@nestjs/common';
import { RMQModule } from 'nestjs-rmq';
import { ManifestUrlHandlerModule } from './manifest-url-handler/manifest-url-handler.module';
import { HttpInputController } from './http-input/http-input.controller';
import { HttpInputModule } from './http-input/http-input.module';
import { VariantsHandlerModule } from './variants-handler/variants-handler.module';

@Module({
  imports: [
    HttpInputModule,
    ManifestUrlHandlerModule,
    VariantsHandlerModule,
    RMQModule.forRoot({
      serviceName: 'hls-variants-info',
      exchangeName: 'hls-exchange',
      connections: [
        {
          login: 'rabbitmq',
          password: 'example',
          host: 'localhost:5672',
        },
      ],
      queueName: 'hls-variants-info-queue',
    }),
  ],
})
export class AppModule {}
