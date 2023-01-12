import { Module } from '@nestjs/common';
import { VariantsInfoController } from './variants-info/variants-info.controller';
import { VariantsInfoModule } from './variants-info/variants-info.module';

@Module({
  imports: [VariantsInfoModule],
  controllers: [VariantsInfoController],
})
export class AppModule { }
