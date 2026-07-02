/* eslint-disable @typescript-eslint/require-await, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/explicit-function-return-type */
export class CreatePartnerDto {
  name!: string;
  slug!: string;
  description!: string;
  website?: string;
  tier?: string;
}

export class UpdatePartnerDto {
  name?: string;
  slug?: string;
  description?: string;
  website?: string;
  tier?: string;
  status?: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
  featured?: boolean;
}
