import * as argon2 from 'argon2';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuditlogService } from 'src/auditlog/auditlog.service';
import { AuditLog } from 'src/auditlog/entities/auditlog.entity';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private auditlogService: AuditlogService,
  ) { }

  async createSuperAdmin(createUserDto: CreateUserDto) {
    try {
      await this.usersService.create({
        code: createUserDto.code,
        username: createUserDto.username,
        password: createUserDto.password,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        phoneNumber: null,
        roleId: 1,
        branchIds: []
      });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async signIn(authDto: AuthDto) {
    const user = await this.usersService.findByUsername(authDto.username);
    if (!user){
      throw new BadRequestException('username or password is not correct');
    } 

    const userAtthem = await this.usersService.getFailedLoginAttempts(user.id);

    if (userAtthem && userAtthem.failedLoginAttempts >= 5) {
      const now = new Date();
      const lastFailedAttempt = new Date(userAtthem.lastFailedAttempt);
      const diff = now.getTime() - lastFailedAttempt.getTime();
      
      if (diff < 600000) { 
        throw new BadRequestException('Account locked due to multiple failed login attempts. Please try again later. after 10 minutes');
      } else {
        await this.usersService.resetFailedLoginAttempts(user.id);
      }
    }

    const passwordMatches = await argon2.verify(user.password, authDto.password);
    if (!passwordMatches) {
      
      const auditLog = new AuditLog();
      auditLog.action = 'FAILED_LOGIN';
      auditLog.description = `Failed login attempt for ${authDto.username}.`;
      auditLog.timestamp = new Date();
      // auditLog.member = user; 
      await this.auditlogService.create(auditLog);
      await this.usersService.incrementFailedLoginAttempts(user.id);
      throw new BadRequestException('username or password is not correct');
    }
    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    await this.usersService.resetFailedLoginAttempts(user.id);
    const auditLog = new AuditLog();
    auditLog.action = 'SUCCESSFUL_LOGIN';
    auditLog.description = `User ${user.username} logged in successfully.`;
    auditLog.userId = user.id;
    auditLog.timestamp = new Date();
    await this.auditlogService.create(auditLog);
   
    return {
      ...tokens,
      name:  user.fullName,
      role: user.role.name
    };
  }

  async getTokens(userId: number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ sub: userId, username }, { secret: this.configService.get('JWT_ACCESS_SECRET'), expiresIn: '1y' }),
      this.jwtService.signAsync({ sub: userId, username }, { secret: this.configService.get('JWT_REFRESH_SECRET'), expiresIn: '2y' })
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hash = await argon2.hash(refreshToken);
    await this.usersService.updateRefreshToken(userId, hash);
  }

  async logout(userId: number, password: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException('User not found.');

    const passwordMatches = await argon2.verify(user.password, password);
    if (!passwordMatches) throw new UnauthorizedException('username or password is not correct');

    await this.usersService.updateRefreshToken(userId, null);

    return true;
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');

    const refreshTokenMatches = await argon2.verify(user.refreshToken, refreshToken);
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async signInWithToken(accessToken: string) {
    const data = this.jwtService.decode(accessToken);

    const user = await this.usersService.findByUsername(data.username);
    if (!user) throw new UnauthorizedException('user not found');

    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }
}
