import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class EventPublishedListener {
  private readonly logger = new Logger('Notification:EventPublished');

  @OnEvent('event.published')
  handleEventPublishedEvent(payload: { title: string }) {
    this.logger.log(`Notify all attendees about ${payload.title}`);
  }
}
