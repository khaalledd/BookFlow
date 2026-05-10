import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import {
  BookingsController,
  BusinessBookingsController,
} from './bookings.controller';

@Module({
  controllers: [BookingsController, BusinessBookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
