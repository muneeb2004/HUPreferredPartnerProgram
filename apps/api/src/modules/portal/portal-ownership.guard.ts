import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

export interface RequestUser {
  id: string;
  email: string;
  role: string;
  partnerId?: string;
}

@Injectable()
export class PortalOwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as RequestUser | undefined;

    if (!user || user.role !== 'BRAND_MANAGER') {
      throw new ForbiddenException('Only brand managers can access this portal');
    }

    if (!user.partnerId) {
      throw new ForbiddenException('Brand manager is not associated with any partner profile');
    }

    return true;
  }
}
