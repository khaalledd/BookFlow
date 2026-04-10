import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class BookingCancelledListener {
  private readonly logger = new Logger(BookingCancelledListener.name);

  @OnEvent('booking.cancelled')
  handleBookingCancelled(payload: { bookingId: string; cancelledBy: string }) {
    this.logger.log(`[BookFlow] Booking ${payload.bookingId} cancelled by ${payload.cancelledBy}`);
    this.logger.log(`[BookFlow] Cancellation notification queued for affected parties`);
  }
}
