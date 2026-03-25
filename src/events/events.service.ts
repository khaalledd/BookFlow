import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/types/paginated.type';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) { }

  async create(createEventDto: CreateEventDto): Promise<Event> {
    try {
      const event = this.eventRepository.create(createEventDto);
      const saved = await this.eventRepository.save(event);
      await this.invalidateEventsCache();
      return saved;
    } catch (error) {
      if (error?.code === '23503') {
        throw new BadRequestException('Invalid venueId. Venue does not exist.');
      }
      throw error;
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Event>> {
    const { page = 1, limit = 10, category, city } = paginationDto;

    // Build cache key from query params
    const cacheKey = `events:list:${page}:${limit}:${category || ''}:${city || ''}`;
    const cached = await this.cacheManager.get<PaginatedResult<Event>>(cacheKey);
    if (cached) return cached;

    const skip = (page - 1) * limit;
    const queryBuilder = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.venue', 'venue')
      .orderBy('event.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    // Apply optional filters
    if (category) {
      queryBuilder.andWhere('event.category = :category', { category });
    }
    if (city) {
      queryBuilder.andWhere('venue.city ILIKE :city', { city: `%${city}%` });
    }

    const [data, total] = await queryBuilder.getManyAndCount();
    const result = new PaginatedResult<Event>(data, total, page, limit);

    // Cache for 5 minutes (300 seconds)
    await this.cacheManager.set(cacheKey, result, 300000);

    return result;
  }

  async findOne(id: string): Promise<Event> {
    const cacheKey = `events:${id}`;
    const cached = await this.cacheManager.get<Event>(cacheKey);
    if (cached) return cached;

    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['venue'],
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    // Cache for 10 minutes (600 seconds)
    await this.cacheManager.set(cacheKey, event, 600000);

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);
    this.eventRepository.merge(event, updateEventDto);
    try {
      const saved = await this.eventRepository.save(event);
      await this.invalidateEventsCache();
      await this.cacheManager.del(`events:${id}`);
      return saved;
    } catch (error) {
      if (error?.code === '23503') {
        throw new BadRequestException('Invalid venueId. Venue does not exist.');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const event = await this.findOne(id);
    await this.eventRepository.remove(event);
    await this.invalidateEventsCache();
    await this.cacheManager.del(`events:${id}`);
  }

  private async invalidateEventsCache(): Promise<void> {
    // Delete all list caches by using the store's keys method
    const keys: string[] = await (this.cacheManager as any).store.keys('events:list:*');
    if (keys && keys.length > 0) {
      for (const key of keys) {
        await this.cacheManager.del(key);
      }
    }
  }
}
