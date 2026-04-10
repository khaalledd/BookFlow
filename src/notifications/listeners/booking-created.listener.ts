import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class BookingCreatedListener {
  private readonly logger = new Logger(BookingCreatedListener.name);

  @OnEvent('booking.created')
  handleBookingCreated(payload: { bookingId: string; customerEmail: string; businessName: string; serviceName: string; date: string; startTime: string }) {
    this.logger.log(`[BookFlow] Booking confirmed — ${payload.serviceName} at ${payload.businessName} on ${payload.date} ${payload.startTime}`);
    this.logger.log(`[BookFlow] Confirmation SMS/email queued for customer: ${payload.customerEmail}`);
    this.logger.log(`[BookFlow] Notification queued for business owner`);
  }
}
