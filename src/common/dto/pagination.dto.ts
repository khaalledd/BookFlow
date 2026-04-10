import {
  IsOptional,
  IsInt,
  Min,
  Max,
  IsString,
  IsEnum,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BusinessCategory } from '@prisma/client';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(BusinessCategory)
  category?: BusinessCategory;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date?: string;
}
