import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class AnalyticsAggregationService {
  private readonly logger = new Logger(AnalyticsAggregationService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Runs daily at 1:00 AM to aggregate previous day's data.
   */
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async aggregateDailyStats() {
    this.logger.log('Starting daily analytics aggregation...');
    
    const today = new Date();
    // We aggregate data from yesterday
    const targetDate = new Date(today);
    targetDate.setDate(targetDate.getDate() - 1);
    targetDate.setHours(0, 0, 0, 0);

    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    try {
      await this.aggregatePartnerStats(targetDate, nextDate);
      await this.aggregateOfferStats(targetDate, nextDate);
      await this.aggregateSearchStats(targetDate, nextDate);
      
      this.logger.log('Daily analytics aggregation completed successfully.');
    } catch (error) {
      this.logger.error(`Aggregation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async aggregatePartnerStats(start: Date, end: Date) {
    // We get counts grouped by entityId where eventType is PARTNER_VIEW
    const views = await this.prisma.analyticsEvent.groupBy({
      by: ['entityId'],
      where: {
        eventType: 'PARTNER_VIEW',
        createdAt: { gte: start, lt: end },
        entityId: { not: null },
      },
      _count: { _all: true },
    });

    // In a real app we might also track partner-level clicks or other metrics
    for (const view of views) {
      if (!view.entityId) continue;
      
      await this.prisma.dailyPartnerStats.upsert({
        where: {
          partnerId_date: {
            partnerId: view.entityId,
            date: start,
          },
        },
        update: {
          views: { increment: view._count._all },
        },
        create: {
          partnerId: view.entityId,
          date: start,
          views: view._count._all,
          clicks: 0,
        },
      });
    }
  }

  private async aggregateOfferStats(start: Date, end: Date) {
    // 1. Group Views
    const views = await this.prisma.analyticsEvent.groupBy({
      by: ['entityId'],
      where: {
        eventType: 'OFFER_VIEW',
        createdAt: { gte: start, lt: end },
        entityId: { not: null },
      },
      _count: { _all: true },
    });

    // 2. Group Clicks
    const clicks = await this.prisma.analyticsEvent.groupBy({
      by: ['entityId'],
      where: {
        eventType: 'OFFER_CLICK',
        createdAt: { gte: start, lt: end },
        entityId: { not: null },
      },
      _count: { _all: true },
    });

    // Merge logic
    const statsMap = new Map<string, { views: number, clicks: number }>();
    
    for (const v of views) {
      if (v.entityId) statsMap.set(v.entityId, { views: v._count._all, clicks: 0 });
    }
    for (const c of clicks) {
      if (c.entityId) {
        const existing = statsMap.get(c.entityId) || { views: 0, clicks: 0 };
        existing.clicks = c._count._all;
        statsMap.set(c.entityId, existing);
      }
    }

    // Upsert
    for (const [offerId, stat] of statsMap.entries()) {
      // Need partnerId. Since event doesn't directly store partnerId for offers typically, 
      // we must fetch it from the Offer table.
      const offer = await this.prisma.offer.findUnique({ where: { id: offerId }, select: { partnerId: true } });
      if (!offer) continue;

      await this.prisma.dailyOfferStats.upsert({
        where: {
          offerId_date: {
            offerId,
            date: start,
          },
        },
        update: {
          views: { increment: stat.views },
          clicks: { increment: stat.clicks },
        },
        create: {
          offerId,
          partnerId: offer.partnerId,
          date: start,
          views: stat.views,
          clicks: stat.clicks,
        },
      });
    }
  }

  private async aggregateSearchStats(start: Date, end: Date) {
    const searches = await this.prisma.analyticsEvent.findMany({
      where: {
        eventType: 'SEARCH_QUERY',
        createdAt: { gte: start, lt: end },
      },
      select: { metadata: true }
    });

    // Group by query text manually since it's inside metadata JSON
    const queryMap = new Map<string, { count: number, zeroResults: number, duration: number }>();

    for (const search of searches) {
      if (!search.metadata) continue;
      
      const meta = search.metadata as any;
      const q = meta.searchQuery;
      if (!q) continue;

      const existing = queryMap.get(q) || { count: 0, zeroResults: 0, duration: 0 };
      existing.count += 1;
      existing.zeroResults += meta.zeroResultCount ? 1 : 0;
      existing.duration += meta.duration || 0;
      
      queryMap.set(q, existing);
    }

    for (const [query, stats] of queryMap.entries()) {
      const avgDuration = stats.duration / stats.count;

      await this.prisma.searchAnalytics.upsert({
        where: {
          date_query: {
            date: start,
            query,
          },
        },
        update: {
          count: { increment: stats.count },
          zeroResultCount: { increment: stats.zeroResults },
          // Rolling average approximation
          avgDurationMs: avgDuration,
        },
        create: {
          date: start,
          query,
          count: stats.count,
          zeroResultCount: stats.zeroResults,
          avgDurationMs: avgDuration,
        },
      });
    }
  }
}
