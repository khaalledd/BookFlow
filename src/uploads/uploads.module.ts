import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

import { UsersModule } from '../users/users.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [UsersModule, EventsModule],
  controllers: [UploadsController],
  providers: [UploadsService]
})
export class UploadsModule {}
