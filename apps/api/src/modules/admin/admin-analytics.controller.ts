import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { AnalyticsReportingService } from '../analytics/analytics-reporting.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { ANALYTICS_CONFIG } from '../analytics/analytics.constants';

@Controller('v1/admin/analytics')
@Roles(UserRole.ADMIN)
@UseInterceptors(CacheInterceptor)
export class AdminAnalyticsController {
  constructor(private readonly reportingService: AnalyticsReportingService) {}

  @Get()
  @CacheTTL(ANALYTICS_CONFIG.DASHBOARD_CACHE_TTL_SEC * 1000)
  async getDashboardReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return await this.reportingService.getGlobalReport(start, end);
  }
}
