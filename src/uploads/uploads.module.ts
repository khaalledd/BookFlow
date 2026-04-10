import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { UsersModule } from '../users/users.module';
import { BusinessesModule } from '../businesses/businesses.module';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [UsersModule, BusinessesModule, ServicesModule],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
