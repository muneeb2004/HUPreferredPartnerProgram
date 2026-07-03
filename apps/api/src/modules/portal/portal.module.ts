import { Module } from '@nestjs/common';

import { PrismaModule } from '../../common/prisma/prisma.module';
import { AnalyticsModule } from '../analytics/analytics.module';

import { PortalController } from './portal.controller';
import { PortalService } from './portal.service';
import { PortalAnalyticsController } from './portal-analytics.controller';


@Module({
  imports: [PrismaModule, AnalyticsModule],
  controllers: [PortalController, PortalAnalyticsController],
  providers: [PortalService],
})
export class PortalModule {}
