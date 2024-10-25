import { IsOptional, IsString, IsNumber, IsDate } from 'class-validator';

export class CreateAuditlogDto {
  @IsOptional()
  @IsString()
  action?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  timestamp?: Date;

  @IsOptional()
  @IsNumber()
  previousCredit?: number;

  @IsOptional()
  @IsNumber()
  previousLimitCredit?: number;

  @IsOptional()
  memberId?: number; 

  @IsOptional()
  userId?: number;
}
