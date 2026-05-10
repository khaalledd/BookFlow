import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreatePublicBookingDto } from './dto/create-public-booking.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';
import type { CurrentUserPayload } from '../auth/types/current-user.type';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('public')
  createPublic(@Body() createPublicBookingDto: CreatePublicBookingDto) {
    return this.bookingsService.createPublic(createPublicBookingDto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createBookingDto: CreateBookingDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.bookingsService.create(user.id, createBookingDto);
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  getMine(
    @CurrentUser() user: CurrentUserPayload,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.bookingsService.getMine(user.id, paginationDto);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.bookingsService.cancel(id, user.id, user.role);
  }

  @Patch(':id/complete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUSINESS_OWNER)
  complete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.bookingsService.complete(id, user.id);
  }
}

@Controller('businesses/:businessId/bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BusinessBookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @Roles(Role.BUSINESS_OWNER, Role.ADMIN)
  getBusinessBookings(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @CurrentUser() user: CurrentUserPayload,
    @Query() paginationDto: PaginationDto,
    @Query('date') date?: string,
  ) {
    return this.bookingsService.getBusinessBookings(
      businessId,
      user.id,
      paginationDto,
      date,
    );
  }
}
