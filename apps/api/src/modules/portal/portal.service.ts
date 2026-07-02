import { Injectable, NotFoundException } from '@nestjs/common';
import { Partner, Offer } from '@prisma/client';

import { PrismaService } from '../../common/prisma/prisma.service';

import { UpdatePortalProfileDto, CreatePortalOfferDto, UpdatePortalOfferDto } from './dto/portal.dto';

@Injectable()
export class PortalService {
  constructor(private prisma: PrismaService) {}

  async getProfile(partnerId: string): Promise<Partner> {
    const partner = await this.prisma.partner.findUnique({
      where: { id: partnerId },
      include: {
        logo: true,
        hero: true,
        categories: true,
      },
    });

    if (!partner) {
      throw new NotFoundException('Partner profile not found');
    }

    return partner;
  }

  async updateProfile(partnerId: string, data: UpdatePortalProfileDto): Promise<Partner> {
    // Determine if status should revert to DRAFT/REVIEW based on fields changed
    // For now, let's keep it simple or set to REVIEW
    return this.prisma.partner.update({
      where: { id: partnerId },
      data: {
        ...data,
        status: 'REVIEW', // Profile updates require admin review
      },
    });
  }

  async getOffers(partnerId: string): Promise<Offer[]> {
    return this.prisma.offer.findMany({
      where: { partnerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createOffer(partnerId: string, data: CreatePortalOfferDto): Promise<Offer> {
    return this.prisma.offer.create({
      data: {
        ...data,
        partnerId,
        status: 'REVIEW', // Default to review required
      },
    });
  }

  async updateOffer(partnerId: string, offerId: string, data: UpdatePortalOfferDto): Promise<Offer> {
    const offer = await this.prisma.offer.findUnique({
      where: { id: offerId },
    });

    if (!offer || offer.partnerId !== partnerId) {
      throw new NotFoundException('Offer not found');
    }

    return this.prisma.offer.update({
      where: { id: offerId },
      data: {
        ...data,
        status: 'REVIEW', // Automatically revert to review if modified
      },
    });
  }

  async getAnalytics(partnerId: string): Promise<{ offersCount: number; totalViews: number; totalRedemptions: number; recentActivity: unknown[] }> {
    // Placeholder for actual analytics.
    // In Phase 14 this will query Event/Metric models.
    const offersCount = await this.prisma.offer.count({
      where: { partnerId },
    });
    
    return {
      offersCount,
      totalViews: 0,
      totalRedemptions: 0,
      recentActivity: [],
    };
  }
}
