import { Module } from '@nestjs/common';
import { GpsService } from './gps.service';
import { GpsController } from './gps.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gp } from './entities/gp.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Gp]), // Register the Gp entity
  ],
  providers: [GpsService],
  controllers: [GpsController],
  exports: [GpsService],
})
export class GpsModule {}
