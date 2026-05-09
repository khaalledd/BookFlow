import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class UploadCompletedListener {
  private readonly logger = new Logger('Notification:UploadCompleted');

  @OnEvent('upload.completed')
  handleUploadCompletedEvent(payload: {
    url: string;
    type: string;
    userId?: string;
    eventId?: string;
  }) {
    this.logger.log(`File uploaded successfully: ${payload.url}`);
  }
}
