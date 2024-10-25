import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty({message: 'Username is required'})
  readonly username: string;

  @IsNotEmpty({message: 'Password is required'})
  @IsStrongPassword({ minLength: 8, minLowercase: 1, minUppercase:1, minSymbols: 1, minNumbers: 1 })
  readonly password: string;

  @IsNotEmpty({message: 'Code is required'})
  readonly code: string;

  @IsNotEmpty({message: 'Firstname is required'})
  readonly firstName: string;

  @IsNotEmpty({message: 'Lastname is required'})
  readonly lastName: string;

  @ApiProperty({ required: false })
  readonly phoneNumber: string;

  @IsNotEmpty({message: 'RoleId is required'})
  readonly roleId: number;

  @IsNotEmpty({message: 'BranchId is required'})
  readonly branchIds: string[];

  
  // @IsString()
  // oldPassword: string;

  // @IsString()
  // newPassword: string;
}
