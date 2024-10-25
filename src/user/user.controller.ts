import { Controller, Get, Post, Body, Put, Param, Delete, UseInterceptors, ClassSerializerInterceptor, ParseIntPipe, HttpCode, HttpStatus, BadRequestException, Req } from '@nestjs/common';
import { USER_PAGINATION_CONFIG, UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Request } from 'express';


@Controller('user')
@ApiTags('ผู้ใช้งาน')
@Auth()
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('profile')
  async profile(@Req() req: Request) {
    const userId = req.user['sub'];
    

    return this.userService.findById(userId);
  }

  @Post('change-password')
  @ApiConsumes('application/json') 
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        oldPassword: {
          type: 'string',
          example: 'oldPassword123',
        },
        newPassword: {
          type: 'string',
          example: 'newPassword456',
        },
      },
    },
  })
  async changePass(
      @Req() req: Request,
      @Body('oldPassword') oldPassword: any,
      @Body('newPassword') newPassword: any,
  ) {
      const userId = req.user['sub'];
      
      try {
        const result = await this.userService.changePassword(userId, oldPassword, newPassword);
        return result;
      } catch (error) {
        
        throw new BadRequestException(error.message);
      }
  }


  @Post('force-change-password')
  @ApiConsumes('application/json') 
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: {
          type: 'number',
          example: '0',
        },
        newPassword: {
          type: 'string',
          example: 'string',
        },
      },
    },
  })
 
  async forcechangePass(
    @Req() req: Request,  
    @Body('userId') userId: any,
    @Body('newPassword') newPassword: any,
  ) {
    const currentuserId = req.user['sub'];
      try {
        const result = await this.userService.forcechangePassword(userId, newPassword,currentuserId);
        return result;
      } catch (error) {
        
        throw new BadRequestException(error.message);
      }
  }




  @Get('datatables')
  @HttpCode(HttpStatus.OK)
  @ApiPaginationQuery(USER_PAGINATION_CONFIG)
  datatables(@Paginate() query: PaginateQuery) {
    return this.userService.datatables(query);
  }

  @Post()
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiConsumes('application/json')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }



  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.userService.findOne(+id);
  }

  @Put(':id')
  @ApiConsumes('application/json')
  @ApiConsumes('application/x-www-form-urlencoded')
  update(
    @Req() req: Request,  
    @Param('id', ParseIntPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
      const userId = req.user['sub'];
    
    return this.userService.update(userId,+id, updateUserDto);
  }





  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.userService.remove(+id);
  }
}
