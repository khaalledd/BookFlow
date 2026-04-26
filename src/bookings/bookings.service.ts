import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreatePublicBookingDto } from './dto/create-public-booking.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { Booking } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/types/paginated.type';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createPublic(
    createPublicBookingDto: CreatePublicBookingDto,
  ): Promise<Booking> {
    const { name, email, phone, ...bookingData } = createPublicBookingDto;

    return this.createInternal({
      createBookingDto: bookingData,
      guestName: name,
      guestEmail: email,
      guestPhone: phone,
    });
  }

  async create(
    customerId: string,
    createBookingDto: CreateBookingDto,
  ): Promise<Booking> {
    return this.createInternal({ createBookingDto, customerId });
  }

  private async createInternal({
    createBookingDto,
    customerId,
    guestName,
    guestEmail,
    guestPhone,
  }: {
    createBookingDto: CreateBookingDto;
    customerId?: string;
    guestName?: string;
    guestEmail?: string;
    guestPhone?: string;
  }): Promise<Booking> {
    if (!customerId && (!guestName || !guestEmail || !guestPhone)) {
      throw new BadRequestException(
        'Either customerId or guest details must be provided',
      );
    }

    const {
      businessId,
      serviceId,
      date: dateString,
      startTime,
      notes,
    } = createBookingDto;

    // Validate date
    const [yyyy, mm, dd] = dateString.split('-').map(Number);
    const dateObj = new Date(Date.UTC(yyyy, mm - 1, dd));
    if (isNaN(dateObj.getTime())) {
      throw new BadRequestException('Invalid date provided');
    }
    const dayOfWeek = dateObj.getUTCDay();

    // Prevent past dates
    const nowLocal = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Africa/Cairo' }),
    );
    const nowUtcMidnight = new Date(
      Date.UTC(nowLocal.getFullYear(), nowLocal.getMonth(), nowLocal.getDate()),
    );
    if (dateObj < nowUtcMidnight) {
      throw new BadRequestException('Cannot book in the past');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Fetch relations and lock the availability row to prevent concurrent bookings
      // for the SAME business+day causing overlapping schedules.
      const availabilityQuery = await tx.$queryRaw<any[]>`
        SELECT * FROM availabilities
        WHERE "businessId" = ${businessId} AND "dayOfWeek" = ${dayOfWeek}
        FOR UPDATE
      `;

      if (!availabilityQuery || availabilityQuery.length === 0) {
        throw new BadRequestException('Business is not available on this day');
      }
      const availability = availabilityQuery[0];

      const service = await tx.service.findUnique({
        where: { id: serviceId },
        include: { business: true },
      });

      if (!service) throw new NotFoundException('Service not found');
      if (service.businessId !== businessId)
        throw new BadRequestException('Service mismatch');
      if (!service.isActive)
        throw new BadRequestException('Service is not active');

      // 2. Validate time against availability
      const startMins = this.timeToMinutes(startTime);
      const availStartMins = this.timeToMinutes(availability.startTime);
      const availEndMins = this.timeToMinutes(availability.endTime);
      const endMins = startMins + service.durationMinutes;

      if (startMins < availStartMins || endMins > availEndMins) {
        throw new BadRequestException(
          'Requested time falls outside business hours',
        );
      }

      // If booking is today, prevent booking past time
      if (dateObj.getTime() === nowUtcMidnight.getTime()) {
        const currentMins = nowLocal.getHours() * 60 + nowLocal.getMinutes();
        if (startMins <= currentMins) {
          throw new BadRequestException('Cannot book past times today');
        }
      }

      // 3. Check overlaps (double-booking prevention)
      const existingBookings = await tx.booking.findMany({
        where: {
          businessId,
          date: dateObj,
          status: { not: 'CANCELLED' },
        },
      });

      for (const b of existingBookings) {
        const bStart = this.timeToMinutes(b.startTime);
        const bEnd = this.timeToMinutes(b.endTime);
        // Overlap condition: start < bEnd AND end > bStart
        if (startMins < bEnd && endMins > bStart) {
          throw new ConflictException('This time slot is no longer available');
        }
      }

      // 4. Create the booking
      const endTime = this.minutesToTime(endMins);

      const booking = await tx.booking.create({
        data: {
          businessId,
          serviceId,
          customerId,
          guestName,
          guestEmail,
          guestPhone,
          date: dateObj,
          startTime,
          endTime,
          notes,
          status: 'CONFIRMED',
        },
        include: {
          customer: { select: { email: true, name: true } },
          service: { select: { name: true } },
          business: { select: { name: true } },
        },
      });

      // 5. Fire event
      this.eventEmitter.emit('booking.created', {
        bookingId: booking.id,
        customerEmail: booking.customer?.email || guestEmail,
        businessName: booking.business.name,
        serviceName: booking.service.name,
        date: dateString,
        startTime,
      });

      return booking;
    });
  }

  async getMine(
    customerId: string,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Booking>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.booking.findMany({
        where: { customerId },
        skip,
        take: limit,
        orderBy: [{ date: 'desc' }, { startTime: 'desc' }],
        include: {
          business: { select: { id: true, name: true, slug: true } },
          service: {
            select: {
              id: true,
              name: true,
              durationMinutes: true,
              price: true,
            },
          },
        },
      }),
      this.prisma.booking.count({ where: { customerId } }),
    ]);

    return new PaginatedResult<Booking>(data as any[], total, page, limit);
  }

  async getBusinessBookings(
    businessId: string,
    ownerId: string,
    paginationDto: PaginationDto,
    date?: string,
  ): Promise<PaginatedResult<Booking>> {
    // Verify ownership
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });
    if (!business) throw new NotFoundException('Business not found');
    if (business.ownerId !== ownerId)
      throw new ForbiddenException('Not your business');

    const { page = 1, limit = 50 } = paginationDto;
    const skip = (page - 1) * limit;

    const where: any = { businessId };
    if (date) {
      const [yyyy, mm, dd] = date.split('-').map(Number);
      where.date = new Date(Date.UTC(yyyy, mm - 1, dd));
    }

    const [data, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
        include: {
          customer: { select: { id: true, name: true, phone: true } },
          service: { select: { id: true, name: true, durationMinutes: true } },
        },
      }),
      this.prisma.booking.count({ where }),
    ]);

    return new PaginatedResult<Booking>(data as any[], total, page, limit);
  }

  async cancel(
    bookingId: string,
    userId: string,
    userRole: string,
  ): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { business: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    const isCustomer = booking.customerId === userId;
    const isOwner = booking.business.ownerId === userId;
    const isAdmin = userRole === 'ADMIN';

    if (!isCustomer && !isOwner && !isAdmin) {
      throw new ForbiddenException('Cannot cancel this booking');
    }

    if (booking.status === 'CANCELLED') {
      throw new BadRequestException('Booking is already cancelled');
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
    });

    this.eventEmitter.emit('booking.cancelled', {
      bookingId,
      cancelledBy: isCustomer ? 'CUSTOMER' : 'BUSINESS',
    });

    return updated;
  }

  async complete(bookingId: string, userId: string): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { business: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.business.ownerId !== userId) {
      throw new ForbiddenException(
        'Only the business owner can mark as complete',
      );
    }

    if (booking.status !== 'CONFIRMED') {
      throw new BadRequestException(
        'Only confirmed bookings can be marked as complete',
      );
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'COMPLETED' },
    });
  }

  // Helpers
  private timeToMinutes(timeStr: string): number {
    const [hh, mm] = timeStr.split(':').map(Number);
    return hh * 60 + mm;
  }

  private minutesToTime(mins: number): string {
    const hh = Math.floor(mins / 60);
    const mm = mins % 60;
    return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;
  }
}
