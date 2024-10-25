import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Request } from 'express';
import { AccessTokenGuard, RefreshTokenGuard } from 'src/common/guards';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { Auth } from './decorators/auth.decorator';
import { LogoutDto } from './dto/logout.dto';

@Controller('auth')
@ApiTags('เข้าสู่ระบบ')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('create-super-admin')
  @ApiExcludeEndpoint()
  async createSuperAdmin(@Req() req: Request, @Body() payload: any) {
    if (req.headers['x-api-key'] !== "ASHATECH") {
      throw new NotFoundException();
    }

    await this.authService.createSuperAdmin(payload);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }

  @Auth()
  @Post('logout')
  logout(@Req() req: Request, @Body() body: LogoutDto) {
    return this.authService.logout(req.user['sub'], body.password);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Post('sign-in-with-token')
  signInWithToken(@Body() body: { accessToken: string }) {
    return this.authService.signInWithToken(body.accessToken);
  }
}
