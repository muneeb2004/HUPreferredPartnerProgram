import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/prisma/prisma.service';

import { CreateOfferDto, UpdateOfferDto } from './dto/offer.dto';

@Injectable()
export class OffersService {
  constructor(private prisma: PrismaService) {}

  async create(createOfferDto: CreateOfferDto) {
    return this.prisma.offer.create({
      data: createOfferDto,
      include: { partner: true }
    });
  }

  async findAll(query: any = {}) {
    const { partnerId, status } = query;
    const where: any = { deletedAt: null };
    if (partnerId) where.partnerId = partnerId;
    if (status) where.status = status;
    
    return this.prisma.offer.findMany({
      where,
      include: { partner: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const offer = await this.prisma.offer.findFirst({
      where: { id, deletedAt: null },
      include: { partner: true }
    });
    if (!offer) throw new NotFoundException('Offer not found');
    return offer;
  }

  async update(id: string, updateOfferDto: UpdateOfferDto) {
    await this.findOne(id);
    return this.prisma.offer.update({
      where: { id },
      data: updateOfferDto,
      include: { partner: true }
    });
  }

  async softDelete(id: string) {
    await this.findOne(id);
    return this.prisma.offer.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'ARCHIVED' },
    });
  }
}
