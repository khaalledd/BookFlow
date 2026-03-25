import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Venue } from '../../venues/entities/venue.entity';
import { TicketTier } from '../../ticket-tiers/entities/ticket-tier.entity';

export enum EventCategory {
  CONCERT = 'CONCERT',
  SPORTS = 'SPORTS',
  CONFERENCE = 'CONFERENCE',
  OTHER = 'OTHER',
}

export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: EventCategory,
    default: EventCategory.OTHER,
  })
  category: EventCategory;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.DRAFT,
  })
  status: EventStatus;

  @Column('timestamp')
  startsAt: Date;

  @Column('timestamp')
  endsAt: Date;

  @Column()
  venueId: string;

  @ManyToOne(() => Venue, (venue) => venue.events, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venueId' })
  venue: Venue;

  @OneToMany(() => TicketTier, (ticketTier) => ticketTier.event)
  ticketTiers: TicketTier[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
