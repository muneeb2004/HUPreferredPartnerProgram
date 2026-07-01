export class CreatePartnerDto {
  name: string;
  slug: string;
  description: string;
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
