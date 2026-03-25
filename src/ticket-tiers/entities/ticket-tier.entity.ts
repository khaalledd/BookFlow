import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Event } from '../../events/entities/event.entity';

export enum TicketTierName {
  VIP = 'VIP',
  EARLY_BIRD = 'EARLY_BIRD',
  STUDENT = 'STUDENT',
  GENERAL = 'GENERAL',
}

@Entity('ticket_tiers')
export class TicketTier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: TicketTierName,
  })
  name: TicketTierName;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  totalCapacity: number;

  @Column('timestamp')
  saleEndsAt: Date;

  @Column()
  eventId: string;

  @ManyToOne(() => Event, (event) => event.ticketTiers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
