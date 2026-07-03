import { Controller, Get, Query, UseInterceptors, UnauthorizedException } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { AnalyticsReportingService } from '../analytics/analytics-reporting.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { ANALYTICS_CONFIG } from '../analytics/analytics.constants';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('v1/portal/analytics')
@Roles(UserRole.BRAND_MANAGER)
@UseInterceptors(CacheInterceptor)
export class PortalAnalyticsController {
  constructor(private readonly reportingService: AnalyticsReportingService) {}

  @Get()
  @CacheTTL(ANALYTICS_CONFIG.DASHBOARD_CACHE_TTL_SEC * 1000)
  async getDashboardReport(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    // SECURITY: Always derive partnerId from the JWT, never trust client
    const partnerId = user.partnerId;
    if (!partnerId) {
      throw new UnauthorizedException('User is not associated with a partner account');
    }

    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    
    return await this.reportingService.getPartnerReport(partnerId, start, end);
  }
}
