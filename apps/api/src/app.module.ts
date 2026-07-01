import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { PartnersModule } from './modules/partners/partners.module';
import { MediaModule } from './modules/media/media.module';

@Module({
  imports: [PrismaModule, PartnersModule, MediaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
