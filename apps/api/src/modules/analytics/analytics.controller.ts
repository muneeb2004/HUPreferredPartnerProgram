import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsEventDto } from './dto/analytics-event.dto';
import { Public } from '../../common/decorators/public.decorator';

@Controller('v1/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Public()
  @Post('events')
  @HttpCode(HttpStatus.ACCEPTED) // 202 Accepted
  async trackEvent(@Body() eventDto: AnalyticsEventDto) {
    // Controller is thin: validates DTO and hands off to service
    await this.analyticsService.enqueueEvent(eventDto);
    // Returns void immediately (202 response)
  }
}
