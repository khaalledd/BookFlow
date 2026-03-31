import { Injectable, NotFoundException, BadRequestException, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Event, EventStatus } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/types/paginated.type';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async create(createEventDto: CreateEventDto): Promise<Event> {
    try {
      const event = this.eventRepository.create(createEventDto);
      const saved = await this.eventRepository.save(event);
      await this.invalidateEventsCache();

      if (saved.status === EventStatus.PUBLISHED) {
        this.eventEmitter.emit('event.published', { title: saved.title });
      }

      return saved;
    } catch (error) {
      if (error?.code === '23503') {
        throw new BadRequestException('Invalid venueId. Venue does not exist.');
      }
      throw error;
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Event>> {
    const { page = 1, limit = 10, category, city, status } = paginationDto;

    // Build cache key from query params
    const cacheKey = `events:list:${page}:${limit}:${category || ''}:${city || ''}:${status || ''}`;
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
    if (status) {
      queryBuilder.andWhere('event.status = :status', { status });
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
    const wasPublished = event.status === EventStatus.PUBLISHED;

    this.eventRepository.merge(event, updateEventDto);
    try {
      const saved = await this.eventRepository.save(event);
      await this.invalidateEventsCache();
      await this.cacheManager.del(`events:${id}`);

      const isPublished = saved.status === EventStatus.PUBLISHED;
      if (!wasPublished && isPublished) {
        this.eventEmitter.emit('event.published', { title: saved.title });
      }

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
    try {
      const store = (this.cacheManager as any).store;
      if (store && typeof store.keys === 'function') {
        const keys: string[] = await store.keys('events:list:*');
        if (keys && keys.length > 0) {
          for (const key of keys) {
            await this.cacheManager.del(key);
          }
        }
      }
    } catch (err) {
      this.logger.warn('Could not invalidate events cache — entries will expire naturally');
    }
  }

  async updateCoverUrl(id: string, coverUrl: string): Promise<Event> {
    const event = await this.findOne(id);
    event.coverUrl = coverUrl;
    const saved = await this.eventRepository.save(event);
    await this.invalidateEventsCache();
    await this.cacheManager.del(`events:${id}`);
    return saved;
  }
}
