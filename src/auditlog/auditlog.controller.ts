import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import {AUDITLOG_PAGINATION_CONFIG, AuditlogService } from './auditlog.service';
import { CreateAuditlogDto } from './dto/create-auditlog.dto';
import { UpdateAuditlogDto } from './dto/update-auditlog.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiPaginationQuery, Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { AuditLog } from './entities/auditlog.entity';
@ApiTags('Audit log')
@Controller('auditlog')
export class AuditlogController {
  constructor(private readonly auditlogService: AuditlogService) {}

  // @Post()
  // create(@Body() createAuditlogDto: CreateAuditlogDto) {
  //   return this.auditlogService.create(createAuditlogDto);
  // }

  @Get()
  findAll() {
    return this.auditlogService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.auditlogService.findOne(+id);
  // }


  @Get('datatables')
  @HttpCode(HttpStatus.OK)
  @ApiPaginationQuery(AUDITLOG_PAGINATION_CONFIG)
  datatables(@Paginate() query: PaginateQuery) {
    return this.auditlogService.datatables(query);
  }


  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuditlogDto: UpdateAuditlogDto) {
  //   return this.auditlogService.update(+id, updateAuditlogDto);
  // }



//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.auditlogService.remove(+id);
//   }
// }
}
