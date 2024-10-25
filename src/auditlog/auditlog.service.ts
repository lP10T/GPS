import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/auditlog.entity';
import { CreateAuditlogDto } from './dto/create-auditlog.dto';
import { UpdateAuditlogDto } from './dto/update-auditlog.dto';
import { paginate, PaginateQuery, Paginated, PaginateConfig, FilterOperator } from 'nestjs-paginate';

export const AUDITLOG_PAGINATION_CONFIG: PaginateConfig<AuditLog> = {
  sortableColumns: ['action', 'id', 'timestamp','userId'],
  searchableColumns: ['action','userId'],
  filterableColumns: {
    'action': [FilterOperator.EQ],
    'userId':[FilterOperator.EQ],
    'timestamp':[FilterOperator.BTW]
  },
};

@Injectable()
export class AuditlogService {

  private readonly logger = new Logger(AuditlogService.name);

  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  private sanitizeNumber(value: number | undefined): number | null {
    return (typeof value === 'number' && !isNaN(value)) ? value : null;
  }

  private validateQuery(query: PaginateQuery): void {
    if (query.page && (isNaN(Number(query.page)) || Number(query.page) <= 0)) {
      throw new BadRequestException('Invalid page number');
    }
    if (query.limit && (isNaN(Number(query.limit)) || Number(query.limit) <= 0)) {
      throw new BadRequestException('Invalid limit number');
    }
  }

  async create(createAuditlogDto: CreateAuditlogDto): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create({
      ...createAuditlogDto,
      previousCredit: this.sanitizeNumber(createAuditlogDto.previousCredit),
      previousLimitCredit: this.sanitizeNumber(createAuditlogDto.previousLimitCredit),
    });
    return this.auditLogRepository.save(auditLog);
  }

  async findAll() {
    return this.auditLogRepository.find();
  }

  async datatables(query: PaginateQuery): Promise<Paginated<AuditLog>> {
    this.validateQuery(query);
    try {
      const result = await paginate(query, this.auditLogRepository, AUDITLOG_PAGINATION_CONFIG);
      // Log the result for debugging
      return result;
    } catch (error) {
      
      throw error;
    }
  }

  // async findOne(id: number): Promise<AuditLog> {
  //   if (isNaN(id) || id <= 0) {
  //     throw new BadRequestException('Invalid ID provided');
  //   }
  //   return this.auditLogRepository.findOne({ where: { id } });
  // }

  // async remove(id: number) {
  //   if (isNaN(id) || id <= 0) {
  //     throw new BadRequestException('Invalid ID provided');
  //   }
  //   await this.auditLogRepository.delete(id);
  // }
}
