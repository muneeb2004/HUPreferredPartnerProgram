// ─── User Domain Types ────────────────────────────────────────

import { type BaseEntity } from './common';

/** User role in the platform */
export enum UserRole {
  Admin = 'ADMIN',
  Student = 'STUDENT',
  Faculty = 'FACULTY',
  Staff = 'STAFF',
  PartnerAdmin = 'PARTNER_ADMIN',
}

/** User entity */
export interface User extends BaseEntity {
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: string | null;
  avatarUrl: string | null;
}

/** Authentication tokens pair */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
