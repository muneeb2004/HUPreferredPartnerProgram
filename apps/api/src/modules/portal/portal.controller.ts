import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Partner, Offer } from '@prisma/client';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

import {
  UpdatePortalProfileDto,
  CreatePortalOfferDto,
  UpdatePortalOfferDto,
  UpdatePortalSettingsDto,
  UpdatePortalPasswordDto,
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

  @Get('dashboard')
  getDashboard(@CurrentUser() user: RequestUser): Promise<{
    companyName: string;
    tier: string;
    status: string;
    profileCompletionPercentage: number;
    lastUpdated: Date;
    metrics: {
      totalOffers: number;
      activeOffers: number;
      expiredOffers: number;
      upcomingOffers: number;
    };
    recentActivity: Offer[];
  }> {
    return this.portalService.getDashboard(user.partnerId as string);
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

  @Get('offers/:id')
  getOffer(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
  ): Promise<Offer> {
    return this.portalService.getOffer(user.partnerId as string, id);
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

  @Delete('offers/:id')
  deleteOffer(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
  ): Promise<Offer> {
    return this.portalService.deleteOffer(user.partnerId as string, id);
  }

  @Get('analytics')
  getAnalytics(@CurrentUser() user: RequestUser): Promise<{
    summary: {
      total: number;
      active: number;
      draft: number;
      review: number;
      archived: number;
      expired: number;
      upcoming: number;
    };
    categories: { category: string; count: number }[];
    recentActivity: { id: string; title: string; status: string; createdAt: Date; expiresAt: Date | null }[];
    monthlyTrend: { month: string; count: number }[];
  }> {
    return this.portalService.getAnalytics(user.partnerId as string);
  }

  @Get('settings')
  getSettings(@CurrentUser() user: RequestUser): Promise<{
    id: string;
    name: string;
    email: string;
    role: string;
    partnerName?: string;
  }> {
    return this.portalService.getSettings(user.id);
  }

  @Patch('settings/profile')
  updateSettingsProfile(
    @CurrentUser() user: RequestUser,
    @Body() dto: UpdatePortalSettingsDto,
  ): Promise<{
    id: string;
    name: string;
    email: string;
    role: string;
  }> {
    return this.portalService.updateSettingsProfile(user.id, dto);
  }

  @Patch('settings/password')
  updateSettingsPassword(
    @CurrentUser() user: RequestUser,
    @Body() dto: UpdatePortalPasswordDto,
  ): Promise<{
    id: string;
    name: string;
    email: string;
  }> {
    return this.portalService.updateSettingsPassword(user.id, dto);
  }
}
