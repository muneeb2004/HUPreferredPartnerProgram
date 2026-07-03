import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';

export enum AggregationInterval {
  DAILY = 'DAILY',
  HOURLY = 'HOURLY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY'
}

export class AnalyticsQueryDto {
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsEnum(AggregationInterval)
  @IsOptional()
  interval?: AggregationInterval = AggregationInterval.DAILY;

  @IsString()
  @IsOptional()
  partnerId?: string; // Optional filter for admin

  @IsString()
  @IsOptional()
  offerId?: string;
}
