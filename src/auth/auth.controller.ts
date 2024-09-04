import {
  LoginResponse,
  MessageResponse,
  ROLE,
  TokenCheckerResponse,
} from 'types/generalTypes';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegistrationDto } from './dto/registration-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RoleGuard } from './guards/role-checker.guard';

import { ERROR_MSG, SUCCESS_MSG } from '@utils/responses';

import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Авторизація користувача')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ description: 'Зареєструватися' })
  @ApiCreatedResponse({
    description: SUCCESS_MSG.signUp,
    type: MessageResponse,
  })
  @ApiBadRequestResponse({ description: ERROR_MSG.userExist })
  @ApiInternalServerErrorResponse({ description: ERROR_MSG.server })
  @ApiUnauthorizedResponse({ description: ERROR_MSG.access })
  @ApiBearerAuth('Token')
  @Post('registration')
  @UseGuards(JwtAuthGuard, RoleGuard(ROLE.general))
  registration(
    @Body() registrationDto: RegistrationDto,
  ): Promise<MessageResponse> {
    return this.authService.registration(registrationDto);
  }

  @ApiOperation({ description: 'Увійти в систему' })
  @ApiCreatedResponse({
    description: SUCCESS_MSG.singIn,
    type: LoginResponse,
  })
  @ApiUnauthorizedResponse({ description: ERROR_MSG.wrongData })
  @ApiNotFoundResponse({ description: ERROR_MSG.userNotFound })
  @ApiInternalServerErrorResponse({
    description: ERROR_MSG.server,
  })
  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Request() req, @Body() loginUserDto: LoginUserDto) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ description: 'Перевірити валідність токену' })
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: SUCCESS_MSG.checker,
    type: TokenCheckerResponse,
  })
  @ApiUnauthorizedResponse({ description: ERROR_MSG.nonValidToken })
  @ApiInternalServerErrorResponse({ description: ERROR_MSG.server })
  @Get('checkTokenProfile')
  @UseGuards(JwtAuthGuard)
  checkUserToken(@Request() req): Promise<TokenCheckerResponse> {
    return req.user;
  }
}
