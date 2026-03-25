import { IsOptional, IsEnum, IsNumber, IsInt, Min, IsDateString, IsUUID } from 'class-validator';
import { TicketTierName } from '../entities/ticket-tier.entity';

export class UpdateTicketTierDto {
  @IsOptional()
  @IsEnum(TicketTierName)
  name?: TicketTierName;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  totalCapacity?: number;

  @IsOptional()
  @IsDateString()
  saleEndsAt?: string;

  @IsOptional()
  @IsUUID()
  eventId?: string;
}
