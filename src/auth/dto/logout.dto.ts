import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LogoutDto {
    @IsNotEmpty()
    @ApiProperty()
    readonly password: string;
}
