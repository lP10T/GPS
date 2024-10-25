import * as argon2 from 'argon2';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { PaginateConfig, PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { UserAtthem } from './entities/user-atthem.entity';
import { AuditlogService } from 'src/auditlog/auditlog.service';

export const USER_PAGINATION_CONFIG: PaginateConfig<User> = {
  sortableColumns: ['id', 'code', 'username', 'phoneNumber'],
  searchableColumns: ['code', 'username', 'firstName', 'lastName', 'phoneNumber'],
  relations: ['role'],
  select: ['id', 'username', 'code', 'firstName', 'lastName', 'phoneNumber',
    'role.id', 'role.name', 'isActive', 'createdAt'],
};

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserAtthem)
    private userAtthemRepository: Repository<UserAtthem>,
    @InjectRepository(AuditlogService)
    private auditlogService:AuditlogService,
    private dataSource: DataSource,
  ) { }

  async incrementFailedLoginAttempts(userId: number) {
    let userAtthem = await this.userAtthemRepository.findOne({ where: { user: { id: userId } } });

    if (!userAtthem) {
      userAtthem = this.userAtthemRepository.create({ user: { id: userId }, failedLoginAttempts: 1, lastFailedAttempt: new Date() });
    } else {
      userAtthem.failedLoginAttempts += 1;
      userAtthem.lastFailedAttempt = new Date();
    }

    await this.userAtthemRepository.save(userAtthem);
  }

  async resetFailedLoginAttempts(userId: number) {
    await this.userAtthemRepository.update({ user: { id: userId } }, { failedLoginAttempts: 0, lastFailedAttempt: null });
  }

  async getFailedLoginAttempts(userId: number): Promise<UserAtthem> {
    return this.userAtthemRepository.findOne({ where: { user: { id: userId } } });
  }

  
  
  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.findById(userId); 

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const passwordMatches = await argon2.verify(user.password, oldPassword);
    if (!passwordMatches) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    const hashedNewPassword = await argon2.hash(newPassword);
    user.password = hashedNewPassword; 

    await this.userRepository.save(user); 
    return { message: 'Password changed successfully' };
  }

  async forcechangePassword(userId: number, newPassword: string, currentuserId: number) {
    const user = await this.findById(userId); 
    const role = await this.findOne(currentuserId)
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (!role || !role.role || !role.role.name) {
      throw new UnauthorizedException('Role information not found');
    }

    const roleName = role.role.name;

    if (roleName !== 'super_admin' && roleName !== 'admin') {
      throw new UnauthorizedException('Access denied: Only super_admin and admin can change passwords');
    }

    const hashedNewPassword = await argon2.hash(newPassword);
    user.password = hashedNewPassword; 

    await this.userRepository.save(user); 

    return { message: 'Password changed successfully' };
  }
  
  async create(createUserDto: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const usernameIsExist = await this.userRepository.findOne({ where: { username: createUserDto.username } });
    if (usernameIsExist) throw new BadRequestException('username already exists');

    const codeIsExist = await this.userRepository.findOne({ where: { code: createUserDto.code } });
    if (codeIsExist) throw new BadRequestException('code already exists');

    
    const hash = await argon2.hash(createUserDto.password);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hash,
      isActive: true,
      role: { id: createUserDto.roleId },
    });

  
    await queryRunner.manager.save(user);

    await queryRunner.commitTransaction();
    return createUserDto
  }catch (err) {
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        role: {
          id: true,
          name: true,
          permissions: {
            id: true,
            name: true
          }
        }
      },
      relations: {
        role: {
          permissions: true
        }
      },
    });

    if (!user) throw new NotFoundException("user not found");

    return user;
  }

  async update(userId: number, id: number, updateUserDto: UpdateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const user = await this.findById(id);
    const currentUser = await this.findById(userId); 
    console.log(currentUser)
    if (!currentUser || !currentUser.role || !currentUser.role.name) {
      throw new UnauthorizedException('Role information not found');
    }

    const roleName = currentUser.role.name;

    if (roleName !== 'super_admin' && roleName !== 'admin') {
      throw new UnauthorizedException('Access denied: Only super_admin and admin can change passwords');
    }

    if (userId == id) {
      throw new BadRequestException('You cant edit your own role');
    }

    if (!user) throw new NotFoundException("user not found");

    const userData = this.userRepository.create({
      ...updateUserDto,
      role: {
        id: updateUserDto?.roleId,
      },
      // branchs: updateUserDto?.branchIds.map(branchId => ({ id: +branchId })),
    });

    this.userRepository.update(id, userData);

    await queryRunner.commitTransaction();
  }
  catch (err) {
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
  }

  async remove(id: number) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException("user not found");

    const date = new Date().valueOf();

    await this.userRepository.update(id, { code: `${date}-${user.code}`, username: `${date}-${user.username}` });

    await this.userRepository.softDelete(id);
  }

  findByUsername(username: string) {
    return this.userRepository.findOne({
      where: { username },
      relations: { role: {} }
    });
  }

  findById(userId: number) {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: {
        role: true
      }
    });
  }

  async datatables(query: PaginateQuery): Promise<Paginated<User>> {
    return paginate(query, this.userRepository, USER_PAGINATION_CONFIG);
  }

  async updateRefreshToken(userId: number, token: string) {
    await this.userRepository.update(userId, {
      refreshToken: token,
    });
  }
}
