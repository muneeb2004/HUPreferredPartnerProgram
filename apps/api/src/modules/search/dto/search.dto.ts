import { IsString, IsOptional, IsInt, Min, Max, IsIn, IsBoolean, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { SEARCH_CONFIG } from '../search.constants';

export class SearchQueryDto {
  @IsString()
  @IsOptional()
  q?: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @IsInt()
  @Min(1)
  @Max(SEARCH_CONFIG.MAX_PAGE_SIZE)
  @Type(() => Number)
  @IsOptional()
  limit?: number = SEARCH_CONFIG.DEFAULT_PAGE_SIZE;

  @IsString()
  @IsOptional()
  @IsIn(['relevance', 'newest', 'oldest'])
  sort?: 'relevance' | 'newest' | 'oldest' = 'relevance';

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  @IsIn(['ACTIVE', 'INACTIVE'])
  partnerStatus?: string;

  @IsString()
  @IsOptional()
  @IsIn(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED', 'EXPIRED'])
  offerStatus?: string;

  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  featuredOnly?: boolean;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}
