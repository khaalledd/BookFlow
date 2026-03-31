import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class UserRegisteredListener {
  private readonly logger = new Logger('Notification:UserRegistered');

  @OnEvent('user.registered')
  handleUserRegisteredEvent(payload: { email: string }) {
    this.logger.log(`Welcome email sent to ${payload.email}`);
  }
}
