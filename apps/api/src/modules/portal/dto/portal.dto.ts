import { IsString, IsOptional, IsUrl, IsNumber, IsDateString, MinLength, MaxLength, Matches } from 'class-validator';

export class UpdatePortalProfileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  logoId?: string;

  @IsString()
  @IsOptional()
  heroId?: string;
}

export class CreatePortalOfferDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  discountType!: string;

  @IsNumber()
  discountValue!: number;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  terms?: string;
}

export class UpdatePortalOfferDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  discountType?: string;

  @IsNumber()
  @IsOptional()
  discountValue?: number;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  terms?: string;

  @IsString()
  @IsOptional()
  status?: string;
}

export class UpdatePortalSettingsDto {
  @IsString()
  @IsOptional()
  name?: string;
}

import { PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_MESSAGE } from '@hu-partner/utils';

export class UpdatePortalPasswordDto {
  @IsString()
  currentPassword!: string;

  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH)
  @MaxLength(PASSWORD_MAX_LENGTH)
  @Matches(PASSWORD_REGEX, { message: PASSWORD_REGEX_MESSAGE })
  newPassword!: string;
}
