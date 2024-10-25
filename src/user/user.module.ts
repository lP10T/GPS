import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserAtthem } from './entities/user-atthem.entity';
import { AuditlogService } from 'src/auditlog/auditlog.service';
import { CommandModule } from 'nestjs-command';
import { UserCommand } from './user.command';

@Module({
  imports: [
    CommandModule,
    TypeOrmModule.forFeature([User, UserAtthem,AuditlogService])
  ],
  controllers: [UserController],
  providers: [UserCommand, UserService],
  exports: [UserService]
})
export class UserModule {}
