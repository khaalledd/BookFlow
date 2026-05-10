import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { UsersService } from '../users/users.service';
import { BusinessesService } from '../businesses/businesses.service';
import { ServicesService } from '../services/services.service';

describe('UploadsController', () => {
  let controller: UploadsController;

  const mockUploadsService = {
    uploadImage: jest.fn(),
  };

  const mockUsersService = {
    updateAvatarUrl: jest.fn(),
  };

  const mockBusinessesService = {
    updateLogoUrl: jest.fn(),
  };

  const mockServicesService = {
    updateCoverUrl: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadsController],
      providers: [
        {
          provide: UploadsService,
          useValue: mockUploadsService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: BusinessesService,
          useValue: mockBusinessesService,
        },
        {
          provide: ServicesService,
          useValue: mockServicesService,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    controller = module.get<UploadsController>(UploadsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
