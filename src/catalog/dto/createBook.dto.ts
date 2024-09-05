import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  author: string;

  @ApiProperty()
  @IsString()
  disposalAct: string;

  @ApiProperty()
  @IsString()
  accompanyningDocumentNumber: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsNumber()
  publicationYear: number;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  classNumber: number;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  dateOfWithdrawal: Date;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  inventoryNumber: number;

  @ApiProperty()
  @IsDate()
  dateOfArrival: Date;
}
