import { Module } from '@nestjs/common';
import { GpsService } from './gps.service';
import { GpsController } from './gps.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gp } from './entities/gp.entity';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forFeature([Gp]), // Register the Gp entity
    BullModule.registerQueue({
      name: 'gps', // Register the queue with the name 'gps'
    }),
  ],
  providers: [GpsService],
  controllers: [GpsController],
  exports: [GpsService],
})
export class GpsModule {}
