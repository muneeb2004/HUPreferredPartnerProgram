import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as crypto from 'crypto';
import { PrismaService } from '../../common/prisma/prisma.service';

export interface EmailChangeEvent {
  userId: string;
  oldEmail: string;
  newEmail: string;
  token: string;
}

@Injectable()
export class UserEmailService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async requestEmailChange(userId: string, newEmail: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId, deletedAt: null } });
    if (!user) throw new NotFoundException('User not found');
    if (user.email === newEmail) throw new BadRequestException('Email is already set to this value');

    // Check if new email is already in use by another account
    const existingUser = await this.prisma.user.findUnique({ where: { email: newEmail } });
    if (existingUser) throw new BadRequestException('Email is already in use');

    // Invalidate previous pending requests
    await this.prisma.userEmailChangeToken.deleteMany({
      where: { userId },
    });

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Set expiration to 24 hours from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await this.prisma.userEmailChangeToken.create({
      data: {
        userId,
        newEmail,
        tokenHash,
        expiresAt,
      },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { pendingEmail: newEmail },
    });

    const event: EmailChangeEvent = {
      userId,
      oldEmail: user.email,
      newEmail,
      token,
    };

    // TODO: Hook up SES/email providers to listen to this event
    this.eventEmitter.emit('user.email.change_requested', event);
  }

  async verifyEmailChange(token: string): Promise<void> {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const changeToken = await this.prisma.userEmailChangeToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!changeToken) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    if (changeToken.expiresAt < new Date()) {
      await this.prisma.userEmailChangeToken.delete({ where: { id: changeToken.id } });
      throw new BadRequestException('Verification token has expired');
    }

    // Apply the new email
    await this.prisma.user.update({
      where: { id: changeToken.userId },
      data: {
        email: changeToken.newEmail,
        pendingEmail: null,
      },
    });

    // Cleanup token
    await this.prisma.userEmailChangeToken.delete({ where: { id: changeToken.id } });

    this.eventEmitter.emit('user.email.changed', {
      userId: changeToken.userId,
      email: changeToken.newEmail,
    });
  }
}
