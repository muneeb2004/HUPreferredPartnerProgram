/* eslint-disable @typescript-eslint/require-await, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/explicit-function-return-type */
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async createSession(userId: string, refreshToken: string, ipAddress?: string, userAgent?: string) {
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    // Refresh tokens valid for 7 days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    return this.prisma.session.create({
      data: {
        userId,
        refreshTokenHash,
        expiresAt,
        ipAddress,
        userAgent,
      },
    });
  }

  async validateAndRotateSession(sessionId: string, oldRefreshToken: string, newRefreshToken: string) {
    const session = await this.prisma.session.findUnique({ where: { id: sessionId } });
    if (!session) return null;

    if (session.expiresAt < new Date()) {
      await this.revokeSession(sessionId);
      return null; // Expired
    }

    const isValid = await bcrypt.compare(oldRefreshToken, session.refreshTokenHash);
    if (!isValid) {
      // Possible token theft, revoke session immediately
      await this.revokeSession(sessionId);
      return null;
    }

    const newHash = await bcrypt.hash(newRefreshToken, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    return this.prisma.session.update({
      where: { id: sessionId },
      data: { refreshTokenHash: newHash, expiresAt },
    });
  }

  async revokeSession(sessionId: string) {
    return this.prisma.session.delete({ where: { id: sessionId } }).catch(() => null);
  }
}
