import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ErrorCode } from '../exceptions/error-codes';
import { LocalGuard } from '../guards/local.guard';
import { UsersService } from '../users/users.service';
import { ServerException } from '../exceptions/server.exception';
import { SigninUserDto, SigninUserResponseDto } from './dto/signin-user.dto';
import { SignupUserDto, SignupUserResponseDto } from './dto/signup-user.dto';
import { NoValidUserResponseDto } from '../users/dto/no-valid-user-response.dto';

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
  @ApiResponse({
    status: 200,
    description: 'Авторизовывает пользователя по указанным username и password',
    type: SigninUserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: NoValidUserResponseDto,
  })
  @ApiBody({
    description: 'Данные авторизации пользователя',
    type: SigninUserDto,
  })
  @Post('signin')
  signin(
    @Body() signinUserDto: SigninUserDto,
    @Req() req,
  ): SigninUserResponseDto {
    /* Генерируем для пользователя JWT-токен */
    return this.authService.auth(req.user.id);
  }

  @ApiResponse({
    status: 201,
    description:
      'Регистрирует пользователя с указаннымми данными и возвращает токен',
    type: SigninUserResponseDto,
  })
  @ApiBody({
    description: 'Модель регистрации пользователя',
    type: SignupUserDto,
  })
  @Post('signup')
  async signup(
    @Body() signupUserDto: SignupUserDto,
  ): Promise<SignupUserResponseDto> {
    const isExists = await this.usersService.findOne({
      username: signupUserDto.username.toLowerCase(),
    });

    if (isExists) {
      throw new ServerException(ErrorCode.UserAlreadyExists);
    }

    /* При регистрации создаём пользователя и генерируем для него токен */
    const user = await this.usersService.create({
      ...signupUserDto,
      username: signupUserDto.username.toLowerCase(),
      email: signupUserDto.email.toLowerCase(),
    });

    return this.authService.auth(user.id);
  }
}
