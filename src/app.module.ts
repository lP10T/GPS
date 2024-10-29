import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GpsModule } from './gps/gps.module';
import { Gp } from './gps/entities/gp.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuditlogModule } from './auditlog/auditlog.module';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: 'i@Passw0rd',
      database: 'gps',
      entities: [Gp],
      synchronize: true,
    }),
    BullModule.forRoot({
      redis: {
        host: '127.0.0.1',
        port: 6380,
      },
    }),
    GpsModule,AuthModule,UserModule,AuditlogModule,PermissionModule,RoleModule // GPS module with MQTT client and Bull queue integration
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
