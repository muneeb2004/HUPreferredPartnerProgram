import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscribeDto, VerifySubscriptionDto, UnsubscribeDto, ConfirmUnsubscribeDto } from './dto/subscription.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Throttle } from '@nestjs/throttler';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';

@Controller('api/v1')
export class SubscriptionsController {
  constructor(
    private subscriptionsService: SubscriptionsService,
    private prisma: PrismaService,
  ) {}

  @Public()
  @Throttle({ default: { limit: 3, ttl: 3600000 } }) // 3 per hour
  @Post('subscriptions')
  async subscribe(@Body() dto: SubscribeDto) {
    return this.subscriptionsService.subscribe(dto.email);
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 3600000 } }) // 10 per hour
  @Post('subscriptions/verify')
  async verify(@Body() dto: VerifySubscriptionDto) {
    return this.subscriptionsService.verify(dto.token);
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 per minute
  @Post('subscriptions/unsubscribe/request')
  async requestUnsubscribe(@Body() dto: UnsubscribeDto) {
    return this.subscriptionsService.requestUnsubscribe(dto.email);
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 per minute
  @Post('subscriptions/unsubscribe/confirm')
  async confirmUnsubscribe(@Body() dto: ConfirmUnsubscribeDto) {
    return this.subscriptionsService.unsubscribe(dto.token);
  }

  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Get('admin/subscriptions')
  async getSubscriptions() {
    // In production, this would use cursor pagination.
    return {
      data: await this.prisma.newsletterSubscription.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' },
      }),
    };
  }
}
