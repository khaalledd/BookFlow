import { IsString, IsNotEmpty, IsEnum, IsDateString, IsUUID } from 'class-validator';
import { EventCategory, EventStatus } from '../entities/event.entity';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(EventCategory)
  category: EventCategory;

  @IsEnum(EventStatus)
  status: EventStatus;

  @IsDateString()
  startsAt: string;

  @IsDateString()
  endsAt: string;

  @IsUUID()
  @IsNotEmpty()
  venueId: string;
}
