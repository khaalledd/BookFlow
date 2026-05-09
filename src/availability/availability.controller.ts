import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import type { CurrentUserPayload } from '../auth/types/current-user.type';

@Controller('businesses/:businessId/availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get()
  getAvailability(@Param('businessId', ParseUUIDPipe) businessId: string) {
    return this.availabilityService.getAvailability(businessId);
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUSINESS_OWNER, Role.ADMIN)
  updateAvailability(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Body() dto: UpdateAvailabilityDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.availabilityService.updateAvailability(
      businessId,
      user.id,
      dto.schedule,
    );
  }
}
