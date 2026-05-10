import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import type { CurrentUserPayload } from '../auth/types/current-user.type';
import { UsersService } from '../users/users.service';
import { BusinessesService } from '../businesses/businesses.service';
import { ServicesService } from '../services/services.service';

@Controller('uploads')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService,
    private readonly usersService: UsersService,
    private readonly businessesService: BusinessesService,
    private readonly servicesService: ServicesService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    if (!file) throw new BadRequestException('File is required');
    const url = await this.uploadsService.uploadImage(file, 'bookflow/avatars');
    await this.usersService.updateAvatarUrl(user.id, url);

    this.eventEmitter.emit('upload.completed', {
      url,
      type: 'avatar',
      userId: user.id,
    });

    return { url };
  }

  @Post('business-logo')
  @Roles(Role.BUSINESS_OWNER, Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async uploadBusinessLogo(
    @UploadedFile() file: Express.Multer.File,
    @Body('businessId') businessId: string,
  ) {
    if (!file) throw new BadRequestException('File is required');
    if (!businessId)
      throw new BadRequestException('businessId is required in body');

    const url = await this.uploadsService.uploadImage(
      file,
      'bookflow/business-logos',
    );
    await this.businessesService.updateLogoUrl(businessId, url);

    this.eventEmitter.emit('upload.completed', {
      url,
      type: 'business-logo',
      businessId,
    });

    return { url };
  }

  @Post('service-cover')
  @Roles(Role.BUSINESS_OWNER, Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async uploadServiceCover(
    @UploadedFile() file: Express.Multer.File,
    @Body('serviceId') serviceId: string,
  ) {
    if (!file) throw new BadRequestException('File is required');
    if (!serviceId)
      throw new BadRequestException('serviceId is required in body');

    const url = await this.uploadsService.uploadImage(
      file,
      'bookflow/service-covers',
    );
    await this.servicesService.updateCoverUrl(serviceId, url);

    this.eventEmitter.emit('upload.completed', {
      url,
      type: 'service-cover',
      serviceId,
    });

    return { url };
  }
}
