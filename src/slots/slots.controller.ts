import {
  Controller,
  Get,
  Param,
  Query,
  BadRequestException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { SlotsService } from './slots.service';

@Controller('businesses/:businessId/slots')
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Get()
  getAvailableSlots(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Query('serviceId') serviceId: string,
    @Query('date') date: string,
  ) {
    if (!serviceId)
      throw new BadRequestException('serviceId query param is required');
    if (!date) throw new BadRequestException('date query param is required');

    return this.slotsService.getAvailableSlots(businessId, serviceId, date);
  }
}
