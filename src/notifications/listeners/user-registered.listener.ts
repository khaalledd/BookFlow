import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class UserRegisteredListener {
  private readonly logger = new Logger(UserRegisteredListener.name);

  @OnEvent('user.registered')
  handleUserRegistered(payload: { email: string }) {
    this.logger.log(`[BookFlow] Welcome email queued for: ${payload.email}`);
  }
}
