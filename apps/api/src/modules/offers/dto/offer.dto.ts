export class CreateOfferDto {
  partnerId!: string;
  title!: string;
  description!: string;
  code?: string;
  discountType!: string;
  discountValue!: number;
  startDate?: Date;
  endDate?: Date;
  terms?: string;
}

export class UpdateOfferDto {
  partnerId?: string;
  title?: string;
  description?: string;
  code?: string;
  discountType?: string;
  discountValue?: number;
  startDate?: Date;
  endDate?: Date;
  terms?: string;
  status?: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
}
