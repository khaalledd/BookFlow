import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Venue } from './entities/venue.entity';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/types/paginated.type';

@Injectable()
export class VenuesService {
  constructor(
    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async create(createVenueDto: CreateVenueDto): Promise<Venue> {
    const venue = this.venueRepository.create(createVenueDto);
    const saved = await this.venueRepository.save(venue);
    await this.invalidateVenuesCache();
    return saved;
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Venue>> {
    const { page = 1, limit = 10 } = paginationDto;

    const cacheKey = `venues:list:${page}:${limit}`;
    const cached = await this.cacheManager.get<PaginatedResult<Venue>>(cacheKey);
    if (cached) return cached;

    const skip = (page - 1) * limit;

    const [data, total] = await this.venueRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const result = new PaginatedResult<Venue>(data, total, page, limit);

    // Cache for 10 minutes (600 seconds)
    await this.cacheManager.set(cacheKey, result, 600000);

    return result;
  }

  async findOne(id: string): Promise<Venue> {
    const venue = await this.venueRepository.findOne({ where: { id } });
    if (!venue) {
      throw new NotFoundException(`Venue with ID ${id} not found`);
    }
    return venue;
  }

  async update(id: string, updateVenueDto: UpdateVenueDto): Promise<Venue> {
    const venue = await this.findOne(id);
    this.venueRepository.merge(venue, updateVenueDto);
    const saved = await this.venueRepository.save(venue);
    await this.invalidateVenuesCache();
    return saved;
  }

  async remove(id: string): Promise<void> {
    const venue = await this.findOne(id);
    await this.venueRepository.remove(venue);
    await this.invalidateVenuesCache();
  }

  private async invalidateVenuesCache(): Promise<void> {
    const keys: string[] = await (this.cacheManager as any).store.keys('venues:list:*');
    if (keys && keys.length > 0) {
      for (const key of keys) {
        await this.cacheManager.del(key);
      }
    }
  }
}
