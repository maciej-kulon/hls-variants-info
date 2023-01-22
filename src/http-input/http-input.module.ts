import { Module } from '@nestjs/common';
import { HttpInputController } from './http-input.controller';

@Module({
  controllers: [HttpInputController],
})
export class HttpInputModule { }
