import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, IsEnum, IsOptional } from 'class-validator';
import { Role } from '../../users/entities/user.entity';

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum([Role.ATTENDEE, Role.ORGANIZER], { message: 'Role must be either ATTENDEE or ORGANIZER' })
  role?: Role.ATTENDEE | Role.ORGANIZER;
}
