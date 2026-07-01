// ─── Partner Domain Types ─────────────────────────────────────

import { type BaseEntity } from './common';

/** Partner category classification */
export enum PartnerCategory {
  Food = 'FOOD',
  Retail = 'RETAIL',
  Education = 'EDUCATION',
  Health = 'HEALTH',
  Entertainment = 'ENTERTAINMENT',
  Technology = 'TECHNOLOGY',
  Finance = 'FINANCE',
  Travel = 'TRAVEL',
  Other = 'OTHER',
}

/** Partner lifecycle status */
export enum PartnerStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING',
  Suspended = 'SUSPENDED',
}

/** Partner entity */
export interface Partner extends BaseEntity {
  name: string;
  slug: string;
  description: string;
  logo: string | null;
  website: string | null;
  contactEmail: string;
  contactPhone: string | null;
  category: PartnerCategory;
  status: PartnerStatus;
  address: string | null;
  termsAndConditions: string | null;
}
