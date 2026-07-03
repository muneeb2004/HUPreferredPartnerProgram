import { IsString, IsOptional, IsInt, Min, Max, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { SEARCH_CONFIG } from '../search.constants';

export class AutocompleteQueryDto {
  @IsString()
  @MinLength(SEARCH_CONFIG.MIN_AUTOCOMPLETE_LENGTH)
  q!: string;

  @IsInt()
  @Min(1)
  @Max(20)
  @Type(() => Number)
  @IsOptional()
  limit?: number = SEARCH_CONFIG.AUTOCOMPLETE_LIMIT;
}
