import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAvailabilityItemDto } from './dto/update-availability.dto';
import type { Availability } from '@prisma/client';

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async getAvailability(businessId: string): Promise<Availability[]> {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });
    if (!business) {
      throw new NotFoundException(`Business with ID ${businessId} not found`);
    }

    return this.prisma.availability.findMany({
      where: { businessId },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  async updateAvailability(
    businessId: string,
    userId: string,
    schedule: UpdateAvailabilityItemDto[],
  ): Promise<Availability[]> {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException(`Business with ID ${businessId} not found`);
    }

    if (business.ownerId !== userId) {
      throw new ForbiddenException('You do not own this business');
    }

    // Validate days of week uniqueness in payload
    const customDays = new Set<number>();
    for (const item of schedule) {
      if (customDays.has(item.dayOfWeek)) {
        throw new BadRequestException(
          `Duplicate dayOfWeek ${item.dayOfWeek} found in payload`,
        );
      }
      if (item.startTime >= item.endTime) {
        throw new BadRequestException(
          `startTime must be before endTime for dayOfWeek ${item.dayOfWeek}`,
        );
      }
      customDays.add(item.dayOfWeek);
    }

    // Transaction for bulk replace
    return this.prisma.$transaction(async (tx) => {
      await tx.availability.deleteMany({
        where: { businessId },
      });

      if (schedule.length > 0) {
        await tx.availability.createMany({
          data: schedule.map((item) => ({
            businessId,
            dayOfWeek: item.dayOfWeek,
            startTime: item.startTime,
            endTime: item.endTime,
          })),
        });
      }

      return tx.availability.findMany({
        where: { businessId },
        orderBy: { dayOfWeek: 'asc' },
      });
    });
  }
}
