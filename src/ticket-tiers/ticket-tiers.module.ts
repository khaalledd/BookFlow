import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketTiersService } from './ticket-tiers.service';
import { TicketTiersController } from './ticket-tiers.controller';
import { TicketTier } from './entities/ticket-tier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TicketTier])],
  controllers: [TicketTiersController],
  providers: [TicketTiersService],
  exports: [TicketTiersService, TypeOrmModule], 
})
export class TicketTiersModule {}
