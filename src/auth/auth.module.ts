import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';
import { UserModule } from 'src/user/user.module';
import { AuditlogService } from 'src/auditlog/auditlog.service';
import { AuditlogModule } from 'src/auditlog/auditlog.module';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}), 
    UserModule,
    AuditlogModule
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule { }
