import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Body, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { EventsService } from '../events/events.service';

@Controller('uploads')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService,
    private readonly usersService: UsersService,
    private readonly eventsService: EventsService,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    if (!file) throw new BadRequestException('File is required');
    const url = await this.uploadsService.uploadImage(file, 'Seatly');
    await this.usersService.updateAvatarUrl(user.id, url);

    this.eventEmitter.emit('upload.completed', { url, type: 'avatar', userId: user.id });

    return { url };
  }

  @Post('event-cover')
  @Roles(Role.ORGANIZER, Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async uploadEventCover(
    @UploadedFile() file: Express.Multer.File,
    @Body('eventId') eventId: string,
  ) {
    if (!file) throw new BadRequestException('File is required');
    if (!eventId) throw new BadRequestException('eventId is required in body');

    const url = await this.uploadsService.uploadImage(file, 'event_covers');
    await this.eventsService.updateCoverUrl(eventId, url);

    this.eventEmitter.emit('upload.completed', { url, type: 'event-cover', eventId });

    return { url };
  }
}
