import { Module } from '@nestjs/common';

import { UserRegisteredListener } from './listeners/user-registered.listener';
import { UploadCompletedListener } from './listeners/upload-completed.listener';
import { BookingCreatedListener } from './listeners/booking-created.listener';
import { BookingCancelledListener } from './listeners/booking-cancelled.listener';

@Module({
  providers: [
    UserRegisteredListener,
    UploadCompletedListener,
    BookingCreatedListener,
    BookingCancelledListener,
  ],
})
export class NotificationsModule {}
