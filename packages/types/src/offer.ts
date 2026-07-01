// ─── Offer Domain Types ───────────────────────────────────────

import { type BaseEntity, type UUID } from './common';

/** Type of offer/discount */
export enum OfferType {
  Percentage = 'PERCENTAGE',
  FixedAmount = 'FIXED_AMOUNT',
  BuyOneGetOne = 'BOGO',
  FreeItem = 'FREE_ITEM',
  Special = 'SPECIAL',
}

/** Offer lifecycle status */
export enum OfferStatus {
  Active = 'ACTIVE',
  Expired = 'EXPIRED',
  Draft = 'DRAFT',
  Scheduled = 'SCHEDULED',
  Paused = 'PAUSED',
}

/** Offer entity */
export interface Offer extends BaseEntity {
  title: string;
  description: string;
  partnerId: UUID;
  type: OfferType;
  status: OfferStatus;
  discountValue: number | null;
  startDate: string;
  endDate: string;
  termsAndConditions: string | null;
  maxRedemptions: number | null;
  currentRedemptions: number;
}
