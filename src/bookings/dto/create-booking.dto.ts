import { IsString, IsNotEmpty, Matches, IsOptional, MaxLength } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  serviceId: string;

  @IsNotEmpty()
  @IsString()
  businessId: string;

  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be in YYYY-MM-DD format' })
  date: string;

  @IsNotEmpty()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, { message: 'startTime must be in HH:mm format' })
  startTime: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
