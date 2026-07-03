import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AnalyticsReportDto } from './dto/analytics-report.dto';

@Injectable()
export class AnalyticsReportingService {
  private readonly logger = new Logger(AnalyticsReportingService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates a report for a specific partner.
   * Leverages pre-aggregated Daily tables.
   */
  async getPartnerReport(partnerId: string, startDate?: Date, endDate?: Date): Promise<AnalyticsReportDto> {
    const start = startDate || new Date(new Date().setDate(new Date().getDate() - 30));
    const end = endDate || new Date();

    const stats = await this.prisma.dailyPartnerStats.findMany({
      where: {
        partnerId,
        date: { gte: start, lte: end },
      },
      orderBy: { date: 'asc' },
    });

    let totalViews = 0;
    let totalClicks = 0;
    
    const timeline = stats.map(stat => {
      totalViews += stat.views;
      totalClicks += stat.clicks;
      return {
        date: stat.date.toISOString(),
        views: stat.views,
        clicks: stat.clicks,
      };
    });

    const offerStats = await this.prisma.dailyOfferStats.groupBy({
      by: ['offerId'],
      where: {
        partnerId,
        date: { gte: start, lte: end },
      },
      _sum: {
        views: true,
        clicks: true,
      },
    });

    // Populate offer titles
    const offerIds = offerStats.map(o => o.offerId);
    const offers = await this.prisma.offer.findMany({
      where: { id: { in: offerIds } },
      select: { id: true, title: true }
    });
    
    const titleMap = new Map(offers.map(o => [o.id, o.title]));

    const topOffers = offerStats.map(o => ({
      offerId: o.offerId,
      title: titleMap.get(o.offerId) || 'Unknown Offer',
      views: o._sum.views || 0,
      clicks: o._sum.clicks || 0,
    })).sort((a, b) => b.clicks - a.clicks).slice(0, 5);

    return {
      metrics: {
        totalViews,
        totalClicks,
        ctr: totalViews > 0 ? Number(((totalClicks / totalViews) * 100).toFixed(2)) : 0,
      },
      timeline,
      topOffers,
    };
  }

  /**
   * Generates a global report for the Admin dashboard.
   */
  async getGlobalReport(startDate?: Date, endDate?: Date) {
    const start = startDate || new Date(new Date().setDate(new Date().getDate() - 30));
    const end = endDate || new Date();

    // 1. Global traffic timeline (views across all partners)
    const stats = await this.prisma.dailyPartnerStats.groupBy({
      by: ['date'],
      where: {
        date: { gte: start, lte: end },
      },
      _sum: {
        views: true,
        clicks: true,
      },
      orderBy: { date: 'asc' },
    });

    const timeline = stats.map(stat => ({
      date: stat.date.toISOString(),
      views: stat._sum.views || 0,
      clicks: stat._sum.clicks || 0,
    }));

    // 2. Top Partners
    const partnerStats = await this.prisma.dailyPartnerStats.groupBy({
      by: ['partnerId'],
      where: {
        date: { gte: start, lte: end },
      },
      _sum: { views: true, clicks: true },
      orderBy: { _sum: { views: 'desc' } },
      take: 5,
    });
    
    const partnerIds = partnerStats.map(p => p.partnerId);
    const partners = await this.prisma.partner.findMany({
      where: { id: { in: partnerIds } },
      select: { id: true, name: true }
    });
    const pMap = new Map(partners.map(p => [p.id, p.name]));

    const topPartners = partnerStats.map(p => ({
      partnerId: p.partnerId,
      name: pMap.get(p.partnerId) || 'Unknown',
      views: p._sum.views || 0,
      clicks: p._sum.clicks || 0,
    }));

    // 3. Search Analytics Summary
    const searchStats = await this.prisma.searchAnalytics.findMany({
      where: { date: { gte: start, lte: end } },
    });
    
    let totalSearches = 0;
    let totalZero = 0;
    searchStats.forEach(s => {
      totalSearches += s.count;
      totalZero += s.zeroResultCount;
    });

    return {
      metrics: {
        totalViews: timeline.reduce((sum, t) => sum + t.views, 0),
        totalClicks: timeline.reduce((sum, t) => sum + t.clicks, 0),
      },
      timeline,
      topPartners,
      search: {
        totalSearches,
        zeroResultSearches: totalZero,
        zeroResultRate: totalSearches > 0 ? Number(((totalZero / totalSearches) * 100).toFixed(2)) : 0,
      }
    };
  }
}
