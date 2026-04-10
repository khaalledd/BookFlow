import { IsInt, Min, Max, IsString, Matches, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAvailabilityItemDto {
  @IsInt()
  @Min(0)
  @Max(6) // 0=Sunday, 6=Saturday
  dayOfWeek: number;

  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, { message: 'startTime must be in HH:mm format' })
  startTime: string;

  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, { message: 'endTime must be in HH:mm format' })
  endTime: string;
}

export class UpdateAvailabilityDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAvailabilityItemDto)
  schedule: UpdateAvailabilityItemDto[];
}
