import { IsEmail, IsString, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class RegistrationDto {
  @ApiProperty({ example: 'jonh@gmail.com', description: 'Пошта користувача' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'anyPass', description: 'Пароль користувача' })
  @IsString()
  @MinLength(6, { message: 'Пароль повинен бути більше 6 символів' })
  password: string;

  @ApiProperty({
    description: '',
    default: '',
  })
  @IsString({ message: '' })
  role: string;
}
