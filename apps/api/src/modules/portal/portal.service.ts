import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Partner, Offer } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../common/prisma/prisma.service';

import { UpdatePortalProfileDto, CreatePortalOfferDto, UpdatePortalOfferDto, UpdatePortalSettingsDto, UpdatePortalPasswordDto } from './dto/portal.dto';

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

  async getDashboard(partnerId: string): Promise<{
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
    const partner = await this.prisma.partner.findUnique({
      where: { id: partnerId },
      include: {
        offers: {
          where: { deletedAt: null },
          orderBy: { updatedAt: 'desc' },
        },
      },
    });

    if (!partner) {
      throw new NotFoundException('Partner profile not found');
    }

    const now = new Date();
    
    // Calculate offer metrics
    const totalOffers = partner.offers.length;
    let activeOffers = 0;
    let expiredOffers = 0;
    let upcomingOffers = 0;

    partner.offers.forEach(offer => {
      if (offer.status !== 'PUBLISHED') return;
      
      const hasStarted = !offer.startDate || offer.startDate <= now;
      const hasExpired = offer.endDate && offer.endDate < now;

      if (hasExpired) {
        expiredOffers++;
      } else if (!hasStarted) {
        upcomingOffers++;
      } else {
        activeOffers++;
      }
    });

    // Calculate profile completion %
    let completionScore = 0;
    const totalFields = 5;
    if (partner.name) completionScore++;
    if (partner.description) completionScore++;
    if (partner.website) completionScore++;
    if (partner.logoId) completionScore++;
    if (partner.heroId) completionScore++;
    
    const profileCompletionPercentage = Math.round((completionScore / totalFields) * 100);

    return {
      companyName: partner.name,
      tier: partner.tier || 'Standard',
      status: partner.status,
      profileCompletionPercentage,
      lastUpdated: partner.updatedAt,
      metrics: {
        totalOffers,
        activeOffers,
        expiredOffers,
        upcomingOffers,
      },
      recentActivity: partner.offers.slice(0, 5),
    };
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
      where: { partnerId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOffer(partnerId: string, offerId: string): Promise<Offer> {
    const offer = await this.prisma.offer.findUnique({
      where: { id: offerId },
    });

    if (!offer || offer.partnerId !== partnerId || offer.deletedAt) {
      throw new NotFoundException('Offer not found');
    }

    return offer;
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
        // If explicitly archiving or saving as draft, allow it.
        // Otherwise, any other edit to the content sets it to REVIEW to await approval.
        status: (data.status === 'ARCHIVED' || data.status === 'DRAFT') 
          ? data.status
          : 'REVIEW',
      },
    });
  }

  async deleteOffer(partnerId: string, offerId: string): Promise<Offer> {
    const offer = await this.prisma.offer.findUnique({
      where: { id: offerId },
    });

    if (!offer || offer.partnerId !== partnerId) {
      throw new NotFoundException('Offer not found');
    }

    // Soft delete
    return this.prisma.offer.update({
      where: { id: offerId },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async getAnalytics(partnerId: string): Promise<{
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
    const now = new Date();

    const [
      totalOffers,
      draftOffers,
      reviewOffers,
      archivedOffers,
      activeOffers,
      expiredOffers,
      upcomingOffers,
      categoryGroups,
      recentActivity,
      trendDates
    ] = await Promise.all([
      this.prisma.offer.count({ where: { partnerId, deletedAt: null } }),
      this.prisma.offer.count({ where: { partnerId, deletedAt: null, status: 'DRAFT' } }),
      this.prisma.offer.count({ where: { partnerId, deletedAt: null, status: 'REVIEW' } }),
      this.prisma.offer.count({ where: { partnerId, deletedAt: null, status: 'ARCHIVED' } }),
      this.prisma.offer.count({
        where: {
          partnerId,
          deletedAt: null,
          status: 'PUBLISHED',
          AND: [
            { OR: [{ startDate: null }, { startDate: { lte: now } }] },
            { OR: [{ endDate: null }, { endDate: { gt: now } }] }
          ]
        },
      }),
      this.prisma.offer.count({
        where: {
          partnerId,
          deletedAt: null,
          status: 'PUBLISHED',
          endDate: { lte: now },
        },
      }),
      this.prisma.offer.count({
        where: {
          partnerId,
          deletedAt: null,
          status: 'PUBLISHED',
          startDate: { gt: now },
        },
      }),
      this.prisma.offer.groupBy({
        by: ['discountType'],
        where: { partnerId, deletedAt: null },
        _count: { id: true },
      }),
      this.prisma.offer.findMany({
        where: { partnerId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          endDate: true,
        },
      }),
      this.prisma.offer.findMany({
        where: { partnerId, deletedAt: null },
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    const categories = categoryGroups.map((g) => ({
      category: g.discountType,
      count: g._count.id,
    }));

    const trendMap = new Map<string, number>();
    trendDates.forEach((t) => {
      // Create a stable month key like "2023-08" or "Aug 2023"
      const month = t.createdAt.toLocaleString('default', { month: 'short', year: 'numeric' });
      trendMap.set(month, (trendMap.get(month) || 0) + 1);
    });
    
    const monthlyTrend = Array.from(trendMap.entries()).map(([month, count]) => ({ month, count }));

    return {
      summary: {
        total: totalOffers,
        active: activeOffers,
        draft: draftOffers,
        review: reviewOffers,
        archived: archivedOffers,
        expired: expiredOffers,
        upcoming: upcomingOffers,
      },
      categories,
      recentActivity: recentActivity.map((r) => ({
        id: r.id,
        title: r.title,
        status: r.status,
        createdAt: r.createdAt,
        expiresAt: r.endDate,
      })),
      monthlyTrend,
    };
  }

  async getSettings(userId: string): Promise<{
    id: string;
    name: string;
    email: string;
    role: string;
    partnerName?: string;
  }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      include: { partner: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      partnerName: user.partner?.name,
    };
  }

  async updateSettingsProfile(userId: string, data: UpdatePortalSettingsDto): Promise<{
    id: string;
    name: string;
    email: string;
    role: string;
  }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  }

  async updateSettingsPassword(userId: string, data: UpdatePortalPasswordDto): Promise<{
    id: string;
    name: string;
    email: string;
  }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = await bcrypt.compare(data.currentPassword, user.passwordHash);
    if (!isValid) {
      throw new BadRequestException('Incorrect current password');
    }

    const newHash = await bcrypt.hash(data.newPassword, 10);

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
      select: { id: true, name: true, email: true },
    });

    // Revoke all existing sessions so the user has to login again
    await this.prisma.session.deleteMany({
      where: { userId },
    });

    return updatedUser;
  }
}
