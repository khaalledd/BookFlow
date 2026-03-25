import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { TicketTiersService } from './ticket-tiers.service';
import { CreateTicketTierDto } from './dto/create-ticket-tier.dto';
import { UpdateTicketTierDto } from './dto/update-ticket-tier.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller()
export class TicketTiersController {
  constructor(private readonly ticketTiersService: TicketTiersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('events/:eventId/tiers')
  create(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @Body() createTicketTierDto: CreateTicketTierDto,
  ) {
    return this.ticketTiersService.create(eventId, createTicketTierDto);
  }

  @Get('events/:eventId/tiers')
  findAllByEvent(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.ticketTiersService.findAllByEvent(eventId, paginationDto);
  }

  @Get('events/:eventId/tiers/:tierId')
  findOneByEvent(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @Param('tierId', ParseUUIDPipe) tierId: string,
  ) {
    return this.ticketTiersService.findOneByEvent(eventId, tierId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('events/:eventId/tiers/:tierId')
  update(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @Param('tierId', ParseUUIDPipe) tierId: string,
    @Body() updateTicketTierDto: UpdateTicketTierDto,
  ) {
    return this.ticketTiersService.update(eventId, tierId, updateTicketTierDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('events/:eventId/tiers/:tierId')
  remove(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @Param('tierId', ParseUUIDPipe) tierId: string,
  ) {
    return this.ticketTiersService.remove(eventId, tierId);
  }

  // Admin only, later phase
  @Get('ticket-tiers')
  findAllGlobal(@Query() paginationDto: PaginationDto) {
    return this.ticketTiersService.findAll(paginationDto);
  }
}
