import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiProperty({
    example: '6574484ba0c57f095174ee',
    description: 'ID користувача',
  })
  id: string;

  @ApiProperty({
    example: 'johnatan@gmail.com',
    description: 'Пошта користувача',
  })
  email: string;

  @ApiProperty({
    example: 'token',
    description: 'token auth',
  })
  token: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  role: string;
}

export class MessageResponse {
  @ApiProperty({
    example: 'будь який меседж',
    description: 'меседж',
  })
  message: string;
}

export class TokenCheckerResponse {
  @ApiProperty({
    example: '6574484ba0c57f095174ee',
    description: 'ID користувача',
  })
  id: string;

  @ApiProperty({
    example: 'johnatan@gmail.com',
    description: 'Пошта користувача',
  })
  email: string;
}

export enum ROLE {
  general = 'general',
  user = 'user',
}
