import { IsString, IsUUID, IsEnum, IsOptional, IsInt, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AnalyticsEventType } from '@prisma/client';

export class AnalyticsEventDto {
  @IsUUID()
  eventId!: string;

  @IsInt()
  @IsOptional()
  version?: number = 1;

  @IsEnum(AnalyticsEventType)
  eventType!: AnalyticsEventType;

  @IsString()
  @IsOptional()
  entityId?: string;

  @IsString()
  @IsOptional()
  entityType?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsString()
  @IsOptional()
  sessionId?: string;

  @IsString()
  @IsOptional()
  timestamp?: string; // Client timestamp
}
