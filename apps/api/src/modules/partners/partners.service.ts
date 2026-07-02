import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/prisma/prisma.service';

import { CreatePartnerDto, UpdatePartnerDto } from './dto/partner.dto';

@Injectable()
export class PartnersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: any) {
    const { page = 1, limit = 20, status, category } = query;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    
    // In Phase 8, public endpoints implicitly filter by PUBLISHED unless preview token provided
    // For now, if status is provided, we filter by it.
    if (status) {
      where.status = status;
    }

    if (category) {
      where.categories = { some: { slug: category } };
    }

    const [data, total] = await Promise.all([
      this.prisma.partner.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        include: { categories: true, logo: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.partner.count({ where }),
    ]);

    return {
      data,
      meta: {
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
        },
      },
    };
  }

  async findOne(slug: string) {
    const partner = await this.prisma.partner.findFirst({
      where: { slug, deletedAt: null },
      include: { categories: true, logo: true, hero: true, offers: { where: { deletedAt: null } } },
    });

    if (!partner) {
      throw new NotFoundException(`Partner with slug ${slug} not found`);
    }
    return partner;
  }

  async create(dto: CreatePartnerDto) {
    return this.prisma.partner.create({
      data: dto,
    });
  }

  async update(slug: string, dto: UpdatePartnerDto) {
    return this.prisma.partner.update({
      where: { slug },
      data: dto,
    });
  }

  async softDelete(slug: string) {
    return this.prisma.partner.update({
      where: { slug },
      data: { deletedAt: new Date() },
    });
  }
}
