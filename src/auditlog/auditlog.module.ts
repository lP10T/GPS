import { Module } from '@nestjs/common';
import { AuditlogService } from './auditlog.service';
import { AuditlogController } from './auditlog.controller';
import { AuditLog } from './entities/auditlog.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuditLog]),
],
  controllers: [AuditlogController],
  providers: [AuditlogService],
  exports: [AuditlogService],
})
export class AuditlogModule {}
