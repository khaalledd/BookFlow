import { Module } from '@nestjs/common';

import { UserRegisteredListener } from './listeners/user-registered.listener';
import { EventPublishedListener } from './listeners/event-published.listener';
import { UploadCompletedListener } from './listeners/upload-completed.listener';

@Module({
  providers: [
    UserRegisteredListener,
    EventPublishedListener,
    UploadCompletedListener,
  ]
})
export class NotificationsModule {}
