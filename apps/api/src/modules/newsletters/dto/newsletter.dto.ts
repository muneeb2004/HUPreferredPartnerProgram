import { IsString, IsNotEmpty } from 'class-validator';

export class SendNewsletterDto {
  // Can be expanded with specific sending options later
}

export class CreateNewsletterIssueDto {
  newsletterId!: string;
  slug!: string;
  title!: string;
  excerpt?: string;
  status?: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
  pdfId?: string;
  publishedAt?: string;
}

export class UpdateNewsletterIssueDto {
  newsletterId?: string;
  slug?: string;
  title?: string;
  excerpt?: string;
  status?: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
  pdfId?: string;
  publishedAt?: string;
}
