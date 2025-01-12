import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ErrorCode } from '../exceptions/error-codes';
import { LocalGuard } from '../guards/local.guard';
import { UsersService } from '../users/users.service';
import { ServerException } from '../exceptions/server.exception';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SigninUserDto, SigninUserResponseDto } from './dto/signin-user.dto';

@ApiTags('auth')
@Controller('')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  /**
   * Стратегия local автоматически достанет username и password из тела запроса
   * Если пароль будет верным, id пользователя окажется в объекте req.user
   */
  @UseGuards(LocalGuard)
  @Post('signin')
  signin(
    @Body() signinUserDto: SigninUserDto,
    @Req() req,
  ): SigninUserResponseDto {
    /* Генерируем для пользователя JWT-токен */
    return this.authService.auth(req.user.id);
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const isExists = await this.usersService.findOne({
      where: {
        username: createUserDto.username,
      },
    });
    if (isExists) {
      throw new ServerException(ErrorCode.UserAlreadyExists);
    }

    /* При регистрации создаём пользователя и генерируем для него токен */
    const user = await this.usersService.create(createUserDto);

    return this.authService.auth(user.id);
  }
}
