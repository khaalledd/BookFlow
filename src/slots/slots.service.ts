import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SlotsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAvailableSlots(
    businessId: string,
    serviceId: string,
    dateString: string,
  ): Promise<string[]> {
    // 1. Validate date
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(dateString)) {
      throw new BadRequestException('date must be in YYYY-MM-DD format');
    }

    const [yyyy, mm, dd] = dateString.split('-').map(Number);
    const dateObj = new Date(yyyy, mm - 1, dd);
    if (isNaN(dateObj.getTime())) {
      throw new BadRequestException('Invalid date provided');
    }

    const dayOfWeek = dateObj.getDay(); // 0 is Sunday, 6 is Saturday

    // 2. Load dependencies
    const [business, service, availability] = await Promise.all([
      this.prisma.business.findUnique({ where: { id: businessId } }),
      this.prisma.service.findUnique({ where: { id: serviceId } }),
      this.prisma.availability.findUnique({
        where: { businessId_dayOfWeek: { businessId, dayOfWeek } },
      }),
    ]);

    if (!business) throw new NotFoundException('Business not found');
    if (!service) throw new NotFoundException('Service not found');
    if (service.businessId !== businessId) {
      throw new BadRequestException('Service does not belong to this business');
    }
    if (!service.isActive) {
      throw new BadRequestException('Service is not currently active');
    }

    // If no availability for this day, return empty slots
    if (!availability) {
      return [];
    }

    // 3. Fetch bookings for this day
    // The DB date field is stored at UTC midnight usually if created via Booking module
    // We will query where date matches. BUT since we don't have Booking module fully built, let's just query by date.
    // For exact match, convert dateString to UTC Date or just query the exact date.
    const bookings = await this.prisma.booking.findMany({
      where: {
        businessId,
        date: new Date(Date.UTC(yyyy, mm - 1, dd)),
        status: { not: 'CANCELLED' },
      },
    });

    // 4. Generate candidate slots
    const startMins = this.timeToMinutes(availability.startTime);
    const endMins = this.timeToMinutes(availability.endTime);
    const duration = service.durationMinutes;

    const candidateSlots: { start: number; end: number }[] = [];
    for (let t = startMins; t + duration <= endMins; t += duration) {
      candidateSlots.push({ start: t, end: t + duration });
    }

    // 5. Filter out booked slots
    const availableSlots = candidateSlots.filter((slot) => {
      // Check overlap: slotStart < bookingEnd AND slotEnd > bookingStart
      const isOverlapping = bookings.some((b) => {
        const bStart = this.timeToMinutes(b.startTime);
        const bEnd = this.timeToMinutes(b.endTime);
        return slot.start < bEnd && slot.end > bStart;
      });
      return !isOverlapping;
    });

    // 6. Filter out past slots if date is today
    const nowEgypt = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Africa/Cairo' }),
    );
    const isToday =
      nowEgypt.getDate() === dd &&
      nowEgypt.getMonth() === mm - 1 &&
      nowEgypt.getFullYear() === yyyy;

    let finalSlots = availableSlots;
    if (isToday) {
      const currentMins = nowEgypt.getHours() * 60 + nowEgypt.getMinutes();
      finalSlots = availableSlots.filter((slot) => slot.start > currentMins);
    }

    return finalSlots.map((slot) => this.minutesToTime(slot.start));
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
