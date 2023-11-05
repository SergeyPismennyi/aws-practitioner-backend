import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export const bootstrap = () => {
  return NestFactory.create(AppModule);
};
