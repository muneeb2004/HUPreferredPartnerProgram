import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { NewslettersService } from './newsletters.service';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { Throttle } from '@nestjs/throttler';

@Controller('api/v1')
export class NewslettersController {
  constructor(private newslettersService: NewslettersService) {}

  @Public()
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @Get('newsletters')
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.newslettersService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Public()
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @Get('newsletters/:slug')
  async findOne(@Param('slug') slug: string) {
    return this.newslettersService.findBySlug(slug);
  }

  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Throttle({ default: { limit: 1, ttl: 600000 } }) // 1 per 10 mins (per IP globally, ideal would be per ID, but relying on service idempotency)
  @Post('admin/newsletters/:id/send')
  async triggerSend(@Param('id') id: string) {
    return this.newslettersService.triggerSend(id);
  }
}
