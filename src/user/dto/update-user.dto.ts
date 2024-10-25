import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  readonly code?: string;

  readonly firstName?: string;

  readonly lastName?: string;

  readonly phoneNumber?: string;

  readonly roleId?: number;

  readonly isActive?: boolean;

  readonly branchIds: string[];

  
}
