/* eslint-disable @typescript-eslint/require-await, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/explicit-function-return-type */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalPartners, totalOffers, totalUsers, activeSubscriptions] = await Promise.all([
      this.prisma.partner.count(),
      this.prisma.offer.count(),
      this.prisma.user.count(),
      this.prisma.newsletterSubscription.count({
        where: { status: 'ACTIVE' },
      }),
    ]);

    return {
      partners: totalPartners,
      offers: totalOffers,
      users: totalUsers,
      activeSubscriptions: activeSubscriptions,
    };
  }
}
