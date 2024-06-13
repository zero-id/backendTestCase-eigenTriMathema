import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class BorrowReturnBookDto {
  @ApiProperty({
    example: '1',
    description: 'book code',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  bookCode: string;

  @ApiProperty({
    example: '1',
    description: 'member code',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  memberCode: string;
}
