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
import type { Service } from '@prisma/client';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  private readonly logger = new Logger(ServicesService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  // ─── Create (Owner Only) ────────────────────────────────────
  async create(
    businessId: string,
    userId: string,
    createServiceDto: CreateServiceDto,
  ): Promise<Service> {
    await this.assertBusinessOwnership(businessId, userId);

    const service = await this.prisma.service.create({
      data: {
        ...createServiceDto,
        price: createServiceDto.price,
        businessId,
      },
    });

    await this.invalidateBusinessCache(businessId);
    return service;
  }

  // ─── Find All by Business (Public) ──────────────────────────
  async findByBusiness(
    businessId: string,
    includeInactive = false,
  ): Promise<Service[]> {
    return this.prisma.service.findMany({
      where: includeInactive ? { businessId } : { businessId, isActive: true },
      orderBy: { price: 'asc' },
    });
  }

  // ─── Find One ───────────────────────────────────────────────
  async findOne(id: string): Promise<Service> {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        business: {
          select: { id: true, name: true, slug: true, ownerId: true },
        },
      },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return service;
  }

  // ─── Update (Owner Only) ────────────────────────────────────
  async update(
    id: string,
    userId: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    const service = await this.findOne(id);
    await this.assertBusinessOwnership((service as any).business.id, userId);

    const updated = await this.prisma.service.update({
      where: { id },
      data: updateServiceDto,
    });

    await this.invalidateBusinessCache(updated.businessId);
    return updated;
  }

  // ─── Delete (Owner Only) ────────────────────────────────────
  async remove(id: string, userId: string): Promise<void> {
    const service = await this.findOne(id);
    await this.assertBusinessOwnership((service as any).business.id, userId);

    await this.prisma.service.delete({ where: { id } });
    await this.invalidateBusinessCache(service.businessId);
  }

  // ─── Update Cover URL ──────────────────────────────────────
  async updateCoverUrl(id: string, coverUrl: string): Promise<Service> {
    await this.findOne(id); // ensure exists
    return this.prisma.service.update({
      where: { id },
      data: { coverUrl },
    });
  }

  // ─── Helpers ─────────────────────────────────────────────────
  private async assertBusinessOwnership(
    businessId: string,
    userId: string,
  ): Promise<void> {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      select: { ownerId: true },
    });

    if (!business) {
      throw new NotFoundException(`Business with ID ${businessId} not found`);
    }

    if (business.ownerId !== userId) {
      throw new ForbiddenException('You do not own this business');
    }
  }

  private async invalidateBusinessCache(businessId: string): Promise<void> {
    try {
      await this.cacheManager.del(`businesses:${businessId}`);
    } catch (_err) {
      this.logger.warn('Could not invalidate business cache');
    }
  }
}
