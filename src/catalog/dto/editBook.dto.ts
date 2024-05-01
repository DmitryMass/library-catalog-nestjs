import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class EditBookDto {
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
  dateOfArrival: Date;
}
