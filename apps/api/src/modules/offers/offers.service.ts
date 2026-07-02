/* eslint-disable @typescript-eslint/require-await, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/explicit-function-return-type */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

import { PrismaService } from '../../common/prisma/prisma.service';

import { CreateOfferDto, UpdateOfferDto } from './dto/offer.dto';

@Injectable()
export class OffersService {
  constructor(private prisma: PrismaService) {}

  private validateDates(startDate?: string | Date | null, endDate?: string | Date | null) {
    if (startDate && endDate) {
      if (new Date(startDate) >= new Date(endDate)) {
        throw new BadRequestException('endDate must be after startDate');
      }
    }
  }

  private validatePublish(dto: any, existingOffer?: any) {
    const status = dto.status || existingOffer?.status;
    if (status === 'PUBLISHED') {
      const startDate = dto.startDate !== undefined ? dto.startDate : existingOffer?.startDate;
      const endDate = dto.endDate !== undefined ? dto.endDate : existingOffer?.endDate;
      const terms = dto.terms !== undefined ? dto.terms : existingOffer?.terms;

      if (!startDate || !endDate || !terms) {
        throw new BadRequestException('Offers cannot be published without startDate, endDate, and terms');
      }
    }
  }

  async create(createOfferDto: CreateOfferDto) {
    this.validateDates(createOfferDto.startDate, createOfferDto.endDate);
    this.validatePublish(createOfferDto);
    
    return this.prisma.offer.create({
      data: createOfferDto as any,
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
    const existing = await this.findOne(id);
    this.validateDates(
      updateOfferDto.startDate !== undefined ? updateOfferDto.startDate : existing.startDate, 
      updateOfferDto.endDate !== undefined ? updateOfferDto.endDate : existing.endDate
    );
    this.validatePublish(updateOfferDto, existing);

    return this.prisma.offer.update({
      where: { id },
      data: updateOfferDto as any,
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
