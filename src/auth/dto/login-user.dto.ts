import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'jonh@gmail.com', description: 'Пошта користувача' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'anyPass', description: 'Пароль користувача' })
  @IsString()
  @MinLength(6, { message: 'Пароль повинен бути більше 6 символів' })
  password: string;
}
