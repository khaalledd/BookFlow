import { IsOptional, IsEnum, IsNumber, IsInt, Min, IsDateString, IsUUID } from 'class-validator';
import { TicketTierName } from '../entities/ticket-tier.entity';

export class CreateTicketTierDto {
  @IsEnum(TicketTierName)
  name: TicketTierName;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(1)
  totalCapacity: number;

  @IsDateString()
  saleEndsAt: string;

  @IsUUID()
  @IsOptional()
  eventId?: string;
}
