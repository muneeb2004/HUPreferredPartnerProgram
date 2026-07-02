/* eslint-disable @typescript-eslint/require-await, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/explicit-function-return-type */
import * as crypto from 'crypto';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { SessionsService } from '../sessions/sessions.service';
import { UsersService } from '../users/users.service';

import { LoginDto, RefreshDto } from './dto/auth.dto';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private sessionsService: SessionsService,
  ) {}

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.usersService.findByEmail(loginDto.email);

    // Generic error to prevent email enumeration
    if (!user || !(await bcrypt.compare(loginDto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    
    // Generate secure random refresh token
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const session = await this.sessionsService.createSession(user.id, refreshToken, ipAddress, userAgent);

    return {
      accessToken,
      refreshToken,
      sessionId: session.id,
    };
  }

  async refresh(sessionId: string, refreshDto: RefreshDto) {
    // Generate a new refresh token for rotation
    const newRefreshToken = crypto.randomBytes(40).toString('hex');
    const updatedSession = await this.sessionsService.validateAndRotateSession(
      sessionId,
      refreshDto.refreshToken,
      newRefreshToken
    );

    if (!updatedSession) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.usersService.findById(updatedSession.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload = { sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      refreshToken: newRefreshToken,
      sessionId: updatedSession.id,
    };
  }

  async logout(sessionId: string) {
    await this.sessionsService.revokeSession(sessionId);
    return { success: true };
  }
}
