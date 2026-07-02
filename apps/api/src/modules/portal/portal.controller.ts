import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { Partner, Offer } from '@prisma/client';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

import {
  UpdatePortalProfileDto,
  CreatePortalOfferDto,
  UpdatePortalOfferDto,
} from './dto/portal.dto';
import { PortalOwnershipGuard, RequestUser } from './portal-ownership.guard';
import { PortalService } from './portal.service';




@Controller('v1/portal')
@UseGuards(JwtAuthGuard, PortalOwnershipGuard)
export class PortalController {
  constructor(private readonly portalService: PortalService) {}

  @Get('profile')
  getProfile(@CurrentUser() user: RequestUser): Promise<Partner> {
    return this.portalService.getProfile(user.partnerId as string);
  }

  @Patch('profile')
  updateProfile(
    @CurrentUser() user: RequestUser,
    @Body() updateDto: UpdatePortalProfileDto,
  ): Promise<Partner> {
    return this.portalService.updateProfile(user.partnerId as string, updateDto);
  }

  @Get('offers')
  getOffers(@CurrentUser() user: RequestUser): Promise<Offer[]> {
    return this.portalService.getOffers(user.partnerId as string);
  }

  @Post('offers')
  createOffer(
    @CurrentUser() user: RequestUser,
    @Body() createDto: CreatePortalOfferDto,
  ): Promise<Offer> {
    return this.portalService.createOffer(user.partnerId as string, createDto);
  }

  @Patch('offers/:id')
  updateOffer(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() updateDto: UpdatePortalOfferDto,
  ): Promise<Offer> {
    return this.portalService.updateOffer(user.partnerId as string, id, updateDto);
  }

  @Get('analytics')
  getAnalytics(@CurrentUser() user: RequestUser): Promise<{ offersCount: number; totalViews: number; totalRedemptions: number; recentActivity: unknown[] }> {
    return this.portalService.getAnalytics(user.partnerId as string);
  }
}
