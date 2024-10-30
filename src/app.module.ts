import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GpsModule } from './gps/gps.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuditlogModule } from './auditlog/auditlog.module';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { ConfigModule } from '@nestjs/config';
import { DeviceModule } from './device/device.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '203.146.252.145',
      port: 3306,
      username: 'devashac_gps',
      password: 'm4u9Is4!8',
      database: 'devashac_gps_demo',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    // BullModule.forRoot({
    //   redis: {
    //     host: 'redis',
    //     port: 6379,
    //   },
    // }),
    GpsModule,
    AuthModule,
    UserModule,
    AuditlogModule,
    PermissionModule,
    RoleModule,
    DeviceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }