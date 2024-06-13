import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

class CreateMemberDto {
  @ApiProperty({
    example: 'Zero',
    description: 'member name',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
export default CreateMemberDto;
