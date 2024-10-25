import { Command, Positional } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';

@Injectable()
export class UserCommand {
  constructor(private readonly userService: UserService) { }

  @Command({
    command: 'create:super-admin <username> <password> <firstname> <lastname>',
    describe: 'create a super admin',
  })
  async create(
    @Positional({ name: 'username', describe: 'the username', type: 'string' }) username: string,
    @Positional({ name: 'password', describe: 'the password', type: 'string' }) password: string,
    @Positional({ name: 'firstname', describe: 'the firstname', type: 'string' }) firstName: string,
    @Positional({ name: 'lastname', describe: 'the lastname', type: 'string' }) lastName: string,
  ) {
    await this.userService.create({
      code: '000',
      username: username,
      password: password,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: null,
      roleId: 1,
      branchIds: []
    });
  }
}