import { UseGuards, applyDecorators } from "@nestjs/common"
import { ApiBearerAuth } from "@nestjs/swagger"
import { AccessTokenGuard } from "src/common/guards"

export const Auth = (...args: string[]) => {
  return applyDecorators(
    ApiBearerAuth(),
    UseGuards(AccessTokenGuard)
  )
}
