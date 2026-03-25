import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { TicketTier } from './entities/ticket-tier.entity';
import { CreateTicketTierDto } from './dto/create-ticket-tier.dto';
import { UpdateTicketTierDto } from './dto/update-ticket-tier.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/types/paginated.type';

@Injectable()
export class TicketTiersService {
  constructor(
    @InjectRepository(TicketTier)
    private readonly ticketTierRepository: Repository<TicketTier>,
  ) {}

  async create(eventId: string, createTicketTierDto: CreateTicketTierDto): Promise<TicketTier> {
    const tier = this.ticketTierRepository.create({
      ...createTicketTierDto,
      eventId,
    } as unknown as DeepPartial<TicketTier>);
    return await this.ticketTierRepository.save(tier);
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<TicketTier>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.ticketTierRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['event'],
    });

    return new PaginatedResult<TicketTier>(data, total, page, limit);
  }

  async findAllByEvent(eventId: string, paginationDto: PaginationDto): Promise<PaginatedResult<TicketTier>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.ticketTierRepository.findAndCount({
      where: { eventId },
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['event'],
    });

    return new PaginatedResult<TicketTier>(data, total, page, limit);
  }

  async findOneByEvent(eventId: string, id: string): Promise<TicketTier> {
    const tier = await this.ticketTierRepository.findOne({
      where: { id, eventId },
      relations: ['event'],
    });
    if (!tier) {
      throw new NotFoundException(`Ticket Tier with ID ${id} not found for Event ${eventId}`);
    }
    return tier;
  }

  async update(eventId: string, id: string, updateTicketTierDto: UpdateTicketTierDto): Promise<TicketTier> {
    const tier = await this.findOneByEvent(eventId, id);
    this.ticketTierRepository.merge(tier, updateTicketTierDto);
    return await this.ticketTierRepository.save(tier);
  }

  async remove(eventId: string, id: string): Promise<void> {
    const tier = await this.findOneByEvent(eventId, id);
    await this.ticketTierRepository.remove(tier);
  }
}
