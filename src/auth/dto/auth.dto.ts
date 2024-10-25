import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AuthDto {
    @IsNotEmpty()
    @ApiProperty()
    readonly username: string;
    
    @IsNotEmpty()
    @ApiProperty()
    readonly password: string;
}
