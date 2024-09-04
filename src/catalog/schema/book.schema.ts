import { IsEnum } from 'class-validator';
import { BookType } from 'types/generalTypes';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({
  timestamps: true,
})
export class Book {
  @ApiProperty({
    example: 'Назва книги',
    description: 'Мина Мозайло',
  })
  @Prop({ default: '' })
  name: string;

  @ApiProperty({
    example: 'Автор книги',
    description: 'Куліш М.П.',
  })
  @Prop({ default: '' })
  author: string;

  @ApiProperty({
    example: 'Рік видання',
    description: '1987',
  })
  @Prop({ default: '' })
  publicationYear: number;

  @ApiProperty({
    example: 'Ціна книги',
    description: '1.10',
  })
  @Prop({ default: '' })
  price: number;

  @ApiProperty({
    example: 'Номер акту вибуття',
    description: '12345567',
  })
  @Prop({ default: '' })
  disposalAct: string;

  @ApiProperty({
    example: 'Дата прибуття',
    description: '10.10.2010',
  })
  @Prop({ default: '' })
  dateOfArrival: Date;

  @ApiProperty({
    example: 'Дата вибуття',
    description: '10.10.2010',
  })
  @Prop({ default: '' })
  dateOfWithdrawal: Date;

  @ApiProperty({
    example: 'Номер супровідного документу',
    description: '2345667',
  })
  @Prop({ default: '' })
  accompanyningDocumentNumber: string;

  @ApiProperty({
    example: 'Xудожня література / Підручник',
    description: 'Тип підручника',
    type: BookType,
    required: true,
  })
  @IsEnum(BookType)
  @Prop({ default: BookType.none })
  type: BookType;

  @ApiProperty({
    example: 'Чи видалена книга ?',
    description: 'true or false',
  })
  @Prop({ default: false })
  isDeleted: boolean;

  @ApiProperty({
    example: 'Класс',
    description: 'від 1 до 11',
  })
  @Prop({ default: 0 })
  classNumber: number;

  @ApiProperty({
    example: 'Інвентарний номер',
    description: '12233555',
  })
  @Prop({ default: 0 })
  inventoryNumber: number;
}

export const BookSchema = SchemaFactory.createForClass(Book);
