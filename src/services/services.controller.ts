import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import type { CurrentUserPayload } from '../auth/types/current-user.type';

@Controller()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  // Nested under businesses: POST /businesses/:businessId/services
  @Post('businesses/:businessId/services')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUSINESS_OWNER, Role.ADMIN)
  create(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Body() createServiceDto: CreateServiceDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.servicesService.create(businessId, user.id, createServiceDto);
  }

  // GET /businesses/:businessId/services (public)
  @Get('businesses/:businessId/services')
  findByBusiness(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Query('includeInactive') includeInactive?: string,
  ) {
    return this.servicesService.findByBusiness(
      businessId,
      includeInactive === 'true',
    );
  }

  // GET /services/:id (public)
  @Get('services/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.findOne(id);
  }

  // PATCH /services/:id (owner only)
  @Patch('services/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUSINESS_OWNER, Role.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.servicesService.update(id, user.id, updateServiceDto);
  }

  // DELETE /services/:id (owner only)
  @Delete('services/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUSINESS_OWNER, Role.ADMIN)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.servicesService.remove(id, user.id);
  }
}
