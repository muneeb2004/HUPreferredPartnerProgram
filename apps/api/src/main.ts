import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from './common/filters/prisma-client-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Apply Global Filter for Prisma Errors
  app.useGlobalFilters(new PrismaClientExceptionFilter());
  
  // Apply Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe({ 
    transform: true, 
    whitelist: true,
    forbidNonWhitelisted: true
  }));
  
  app.enableCors();
  
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
