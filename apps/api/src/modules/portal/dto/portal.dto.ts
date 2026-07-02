import { IsString, IsOptional, IsUrl, IsNumber, IsDateString } from 'class-validator';

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

export class UpdatePortalPasswordDto {
  @IsString()
  currentPassword!: string;

  @IsString()
  newPassword!: string;
}
