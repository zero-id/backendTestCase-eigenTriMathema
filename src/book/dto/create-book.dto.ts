import { ApiProperty } from '@nestjs/swagger';
import {  IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    example: 'Harry Potter',
    description: 'book title',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Zero',
    description: 'book author',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({
    example: 1,
    minimum: 1,
    description: 'book stock',
    required: true,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @ApiProperty({
    example: 'JK-450',
    description: 'book code',
    required: true,
    type: String,
    uniqueItems: true,
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}



