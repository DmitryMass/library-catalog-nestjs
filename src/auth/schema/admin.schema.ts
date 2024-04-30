import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { ROLE } from 'src/types/generalTypes';

@Schema({
  timestamps: true,
})
export class User {
  @ApiProperty({
    example: 'ФІО автора',
    description: 'Петриченко Людмила Васілвна',
  })
  @Prop({ default: '' })
  fullName: string;

  @ApiProperty({
    example: 'jonhSmith12345@gmail.com',
    description: 'Почта',
  })
  @Prop({ unique: true, required: true })
  email: string;

  @ApiProperty({
    example: 'anyPassword12345',
    description: 'Пароль користувача',
  })
  @Prop({ required: true })
  @Exclude()
  password: string;

  @ApiProperty({
    example: 'Одна із..',
    description: 'Роль користувача',
    type: ROLE,
    required: true,
  })
  @IsEnum(ROLE)
  @Prop({ default: ROLE.user })
  role: ROLE;
}

export const UserSchema = SchemaFactory.createForClass(User);
