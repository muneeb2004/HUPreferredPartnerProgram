import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SearchQueryDto } from './dto/search.dto';
import { AutocompleteQueryDto } from './dto/autocomplete.dto';
import { SEARCH_CONFIG } from './search.constants';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(private readonly prisma: PrismaService) {}

  async search(query: SearchQueryDto) {
    const startTime = performance.now();
    const { 
      q, 
      page = 1, 
      limit = SEARCH_CONFIG.DEFAULT_PAGE_SIZE, 
      category, 
      partnerStatus, 
      offerStatus, 
      featuredOnly, 
      startDate, 
      endDate, 
      sort 
    } = query;
    const offset = (page - 1) * limit;

    let searchCondition = Prisma.empty;
    let rankSelect = Prisma.empty;
    let rankOrder = Prisma.sql`"createdAt" DESC`;

    // websearch_to_tsquery provides excellent natural language mapping and safety out of the box
    if (q && q.trim().length > 0) {
      searchCondition = Prisma.sql`AND to_tsvector('english', name || ' ' || description) @@ websearch_to_tsquery('english', ${q})`;
      rankSelect = Prisma.sql`, ts_rank(to_tsvector('english', name || ' ' || description), websearch_to_tsquery('english', ${q})) as relevance`;
      
      if (sort === 'relevance') {
        rankOrder = Prisma.sql`relevance DESC, "createdAt" DESC`;
      }
    }

    if (sort === 'newest') rankOrder = Prisma.sql`"createdAt" DESC`;
    if (sort === 'oldest') rankOrder = Prisma.sql`"createdAt" ASC`;

    // Filter conditions for partners
    const partnerFilters = [Prisma.sql`"deletedAt" IS NULL`];
    if (partnerStatus) partnerFilters.push(Prisma.sql`status = ${partnerStatus}::"ContentStatus"`);
    else partnerFilters.push(Prisma.sql`status != 'ARCHIVED'::"ContentStatus"`);
    if (featuredOnly) partnerFilters.push(Prisma.sql`featured = true`);
    if (startDate) partnerFilters.push(Prisma.sql`"createdAt" >= ${new Date(startDate)}`);
    if (endDate) partnerFilters.push(Prisma.sql`"createdAt" <= ${new Date(endDate)}`);

    // Filter conditions for offers
    const offerFilters = [Prisma.sql`"deletedAt" IS NULL`];
    if (offerStatus) offerFilters.push(Prisma.sql`status = ${offerStatus}::"ContentStatus"`);
    else offerFilters.push(Prisma.sql`status != 'ARCHIVED'::"ContentStatus"`);
    if (startDate) offerFilters.push(Prisma.sql`"createdAt" >= ${new Date(startDate)}`);
    if (endDate) offerFilters.push(Prisma.sql`"createdAt" <= ${new Date(endDate)}`);

    // Categories filter (requires joining)
    let partnerCategoryJoin = Prisma.empty;
    if (category) {
      partnerCategoryJoin = Prisma.sql`
        INNER JOIN "_CategoryToPartner" ctp ON ctp."B" = p.id
        INNER JOIN "categories" c ON c.id = ctp."A" AND c.slug = ${category}
      `;
    }

    const partnerWhere = Prisma.sql`${Prisma.join(partnerFilters, ' AND ')}`;
    const offerWhere = Prisma.sql`${Prisma.join(offerFilters, ' AND ')}`;

    // Raw SQL to search both and combine
    const sqlQuery = Prisma.sql`
      WITH partner_results AS (
        SELECT 
          'partner' as type,
          p.id,
          p.name as title,
          p.description,
          p.status,
          p.featured,
          p.slug,
          p."createdAt"
          ${rankSelect}
        FROM partners p
        ${partnerCategoryJoin}
        WHERE ${partnerWhere} ${searchCondition}
      ),
      offer_results AS (
        SELECT 
          'offer' as type,
          o.id,
          o.title,
          o.description,
          o.status,
          false as featured,
          '' as slug,
          o."createdAt"
          ${rankSelect}
        FROM offers o
        WHERE ${offerWhere} ${q && q.trim().length > 0 ? Prisma.sql`AND to_tsvector('english', title || ' ' || description) @@ websearch_to_tsquery('english', ${q})` : Prisma.empty}
      ),
      combined AS (
        SELECT * FROM partner_results
        UNION ALL
        SELECT * FROM offer_results
      )
      SELECT * FROM combined
      ORDER BY ${rankOrder}
      LIMIT ${limit} OFFSET ${offset}
    `;

    // Also get total count
    const countQuery = Prisma.sql`
      WITH partner_results AS (
        SELECT p.id FROM partners p ${partnerCategoryJoin} WHERE ${partnerWhere} ${searchCondition}
      ),
      offer_results AS (
        SELECT o.id FROM offers o WHERE ${offerWhere} ${q && q.trim().length > 0 ? Prisma.sql`AND to_tsvector('english', title || ' ' || description) @@ websearch_to_tsquery('english', ${q})` : Prisma.empty}
      )
      SELECT (SELECT COUNT(*) FROM partner_results) + (SELECT COUNT(*) FROM offer_results) as total
    `;

    const [results, [{ total }]] = await Promise.all([
      this.prisma.$queryRaw(sqlQuery),
      this.prisma.$queryRaw<{ total: bigint }[]>(countQuery),
    ]);

    const duration = performance.now() - startTime;
    this.logger.log(`[Search] Query='${q || ''}' Results=${results ? (results as any[]).length : 0}/${total} Duration=${duration.toFixed(2)}ms`);

    return {
      data: results,
      meta: {
        total: Number(total),
        page,
        limit,
        totalPages: Math.ceil(Number(total) / limit),
      }
    };
  }

  async autocomplete(query: AutocompleteQueryDto) {
    const startTime = performance.now();
    const { q, limit = SEARCH_CONFIG.AUTOCOMPLETE_LIMIT } = query;
    
    // Very fast prefix search using Prisma ILike for simple autocomplete
    // websearch_to_tsquery is less ideal here because autocomplete expects prefix matching mid-word
    
    const [partners, offers] = await Promise.all([
      this.prisma.partner.findMany({
        where: {
          name: { contains: q, mode: 'insensitive' },
          deletedAt: null,
          status: 'PUBLISHED',
        },
        select: { id: true, name: true, slug: true },
        take: limit,
      }),
      this.prisma.offer.findMany({
        where: {
          title: { contains: q, mode: 'insensitive' },
          deletedAt: null,
          status: 'PUBLISHED',
        },
        select: { id: true, title: true, partner: { select: { slug: true } } },
        take: limit,
      })
    ]);

    const merged = [
      ...partners.map(p => ({ type: 'partner' as const, id: p.id, title: p.name, url: `/partners/${p.slug}` })),
      ...offers.map(o => ({ type: 'offer' as const, id: o.id, title: o.title, url: `/partners/${o.partner.slug}#offer-${o.id}` }))
    ].slice(0, limit);

    const duration = performance.now() - startTime;
    this.logger.log(`[Autocomplete] Query='${q}' Results=${merged.length} Duration=${duration.toFixed(2)}ms`);

    return {
      data: merged
    };
  }
}
