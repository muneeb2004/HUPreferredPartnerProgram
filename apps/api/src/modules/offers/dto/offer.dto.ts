/* eslint-disable @typescript-eslint/require-await, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/explicit-function-return-type */
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString, IsEnum, ValidateIf, Min } from 'class-validator';

export enum OfferStatus {
  DRAFT = 'DRAFT',
  REVIEW = 'REVIEW',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  EXPIRED = 'EXPIRED',
}

export class CreateOfferDto {
  @IsString()
  @IsNotEmpty()
  partnerId!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsNotEmpty()
  discountType!: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
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

  @IsEnum(OfferStatus)
  @IsOptional()
  status?: OfferStatus;
}

export class UpdateOfferDto {
  @IsString()
  @IsOptional()
  partnerId?: string;

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
  @Min(0)
  @IsOptional()
  @Type(() => Number)
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

  @IsEnum(OfferStatus)
  @IsOptional()
  status?: OfferStatus;
}
