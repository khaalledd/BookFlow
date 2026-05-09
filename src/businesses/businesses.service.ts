import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import type { Business } from '@prisma/client';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/types/paginated.type';

@Injectable()
export class BusinessesService {
  private readonly logger = new Logger(BusinessesService.name);
  private readonly businessesListVersionKey = 'businesses:list:version';

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  // ─── Create ──────────────────────────────────────────────────
  async create(
    ownerId: string,
    createBusinessDto: CreateBusinessDto,
  ): Promise<Business> {
    const slug = await this.generateUniqueSlug(createBusinessDto.name);

    const business = await this.prisma.business.create({
      data: {
        ...createBusinessDto,
        slug,
        ownerId,
      },
    });

    await this.bumpBusinessesListVersion();
    return business;
  }

  // ─── Find All (Public, Paginated, Filterable) ────────────────
  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Business>> {
    const { page = 1, limit = 10, category, city } = paginationDto;
    const listVersion = await this.getBusinessesListVersion();

    const cacheKey = `businesses:list:v${listVersion}:${page}:${limit}:${category || ''}:${city || ''}`;
    const cached =
      await this.cacheManager.get<PaginatedResult<Business>>(cacheKey);
    if (cached) return cached;

    const skip = (page - 1) * limit;

    const where: any = {};
    if (category) where.category = category;
    if (city) where.city = { contains: city, mode: 'insensitive' };

    const [data, total] = await Promise.all([
      this.prisma.business.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: { select: { id: true, name: true, avatarUrl: true } },
        },
      }),
      this.prisma.business.count({ where }),
    ]);

    const result = new PaginatedResult<Business>(
      data as any[],
      total,
      page,
      limit,
    );

    // Cache for 5 minutes
    await this.cacheManager.set(cacheKey, result, 300000);

    return result;
  }

  // ─── Find One by ID ──────────────────────────────────────────
  async findOne(id: string): Promise<Business> {
    const cacheKey = `businesses:${id}`;
    const cached = await this.cacheManager.get<Business>(cacheKey);
    if (cached) return cached;

    const business = await this.prisma.business.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, avatarUrl: true } },
        services: { where: { isActive: true } },
        availabilities: { orderBy: { dayOfWeek: 'asc' } },
      },
    });

    if (!business) {
      throw new NotFoundException(`Business with ID ${id} not found`);
    }

    // Cache for 10 minutes
    await this.cacheManager.set(cacheKey, business, 600000);

    return business;
  }

  // ─── Find by Slug (Public Booking Page) ──────────────────────
  async findBySlug(slug: string): Promise<Business> {
    const business = await this.prisma.business.findUnique({
      where: { slug },
      include: {
        owner: { select: { id: true, name: true, avatarUrl: true } },
        services: { where: { isActive: true }, orderBy: { price: 'asc' } },
        availabilities: { orderBy: { dayOfWeek: 'asc' } },
      },
    });

    if (!business) {
      throw new NotFoundException(`Business "${slug}" not found`);
    }

    return business;
  }

  // ─── Update (Owner Only) ────────────────────────────────────
  async update(
    id: string,
    userId: string,
    updateBusinessDto: UpdateBusinessDto,
  ): Promise<Business> {
    const business = await this.findOne(id);
    this.assertOwnership(business, userId);

    // If name changes, regenerate slug
    const data: any = { ...updateBusinessDto };
    if (updateBusinessDto.name && updateBusinessDto.name !== business.name) {
      data.slug = await this.generateUniqueSlug(updateBusinessDto.name);
    }

    const updated = await this.prisma.business.update({
      where: { id },
      data,
    });

    await this.bumpBusinessesListVersion();
    await this.cacheManager.del(`businesses:${id}`);

    return updated;
  }

  // ─── Delete (Owner or Admin) ─────────────────────────────────
  async remove(id: string, userId: string, userRole: string): Promise<void> {
    const business = await this.findOne(id);

    if (userRole !== 'ADMIN') {
      this.assertOwnership(business, userId);
    }

    await this.prisma.business.delete({ where: { id } });
    await this.bumpBusinessesListVersion();
    await this.cacheManager.del(`businesses:${id}`);
  }

  // ─── Update Logo URL ────────────────────────────────────────
  async updateLogoUrl(id: string, logoUrl: string): Promise<Business> {
    await this.findOne(id); // ensure exists
    const updated = await this.prisma.business.update({
      where: { id },
      data: { logoUrl },
    });
    await this.bumpBusinessesListVersion();
    await this.cacheManager.del(`businesses:${id}`);
    return updated;
  }

  // ─── Dashboard Stats (Owner Only) ────────────────────────────
  async getDashboard(id: string, userId: string) {
    const business = await this.findOne(id);
    this.assertOwnership(business, userId);

    const nowLocal = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Africa/Cairo' }),
    );
    const yyyy = nowLocal.getFullYear();
    const mm = nowLocal.getMonth();
    const dd = nowLocal.getDate();

    const todayStart = new Date(Date.UTC(yyyy, mm, dd));

    // Start of week (Sunday)
    const dayOfWeek = todayStart.getUTCDay();
    const weekStartLocal = new Date(nowLocal);
    weekStartLocal.setDate(nowLocal.getDate() - dayOfWeek);
    const weekStart = new Date(
      Date.UTC(
        weekStartLocal.getFullYear(),
        weekStartLocal.getMonth(),
        weekStartLocal.getDate(),
      ),
    );

    // Start of month
    const monthStart = new Date(Date.UTC(yyyy, mm, 1));

    const [
      todaysBookings,
      weekBookingsCount,
      monthBookingsCount,
      popularServicesData,
    ] = await Promise.all([
      this.prisma.booking.findMany({
        where: {
          businessId: id,
          date: todayStart,
          status: { not: 'CANCELLED' },
        },
        include: {
          customer: { select: { name: true } },
          service: { select: { name: true, durationMinutes: true } },
        },
        orderBy: { startTime: 'asc' },
      }),
      this.prisma.booking.count({
        where: {
          businessId: id,
          date: { gte: weekStart },
          status: { not: 'CANCELLED' },
        },
      }),
      this.prisma.booking.count({
        where: {
          businessId: id,
          date: { gte: monthStart },
          status: { not: 'CANCELLED' },
        },
      }),
      this.prisma.booking.groupBy({
        by: ['serviceId'],
        where: { businessId: id, status: { not: 'CANCELLED' } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 3,
      }),
    ]);

    // Populate service names for popular services
    const topServiceIds = popularServicesData.map((s) => s.serviceId);
    const topServices = await this.prisma.service.findMany({
      where: { id: { in: topServiceIds } },
      select: { id: true, name: true },
    });

    const popularServices = popularServicesData.map((s) => ({
      serviceId: s.serviceId,
      name: topServices.find((ts) => ts.id === s.serviceId)?.name || 'Unknown',
      count: s._count.id,
    }));

    return {
      todayCount: todaysBookings.length,
      todaysBookings,
      thisWeekCount: weekBookingsCount,
      thisMonthCount: monthBookingsCount,
      popularServices,
    };
  }

  // ─── Helpers ─────────────────────────────────────────────────
  private assertOwnership(business: any, userId: string): void {
    if (business.ownerId !== userId) {
      throw new ForbiddenException('You do not own this business');
    }
  }

  private async generateUniqueSlug(name: string): Promise<string> {
    let slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s]+/g, '-')
      .replace(/-+/g, '-');

    const existing = await this.prisma.business.findUnique({ where: { slug } });
    if (existing) {
      const suffix = Math.random().toString(36).substring(2, 7);
      slug = `${slug}-${suffix}`;
    }

    return slug;
  }

  private async getBusinessesListVersion(): Promise<number> {
    const rawVersion = await this.cacheManager.get<number | string>(
      this.businessesListVersionKey,
    );
    const parsedVersion = Number(rawVersion);

    if (!Number.isFinite(parsedVersion) || parsedVersion < 1) {
      return 1;
    }

    return Math.floor(parsedVersion);
  }

  private async bumpBusinessesListVersion(): Promise<void> {
    try {
      const currentVersion = await this.getBusinessesListVersion();
      await this.cacheManager.set(
        this.businessesListVersionKey,
        currentVersion + 1,
      );
    } catch (_err) {
      this.logger.warn(
        'Could not bump business list cache version — entries will expire naturally',
      );
    }
  }
}
