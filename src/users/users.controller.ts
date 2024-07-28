import { Body, Controller, Get, HttpStatus, Post, Req } from '@nestjs/common';
import { UsersService } from './services';
import { AppRequest, getUserIdFromRequest } from '../shared';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserDto } from '../database/createUser.dto';

@Controller('api/profile/user')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  async findByUserId(@Req() req: AppRequest) {
    const user = await this.userService.findOne(getUserIdFromRequest(req));
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { user },
    };
  }

  @Post()
  async createUser(@Body() body: any) {
    const userDto = plainToInstance(UserDto, body);
    const errors = await validate(userDto);

    if (errors.length > 0) {
      throw new Error('Validation failed');
    }

    const user = await this.userService.createOne(userDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'User created successfully',
      data: user,
    };
  }
}
