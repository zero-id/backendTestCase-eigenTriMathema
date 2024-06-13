import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MemberService } from './member.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import CreateMemberDto from './dto/create-member.dto';

@ApiTags('member')
@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  @ApiOperation({ summary: 'create member' })
  @ApiBody({ type: CreateMemberDto })
  @ApiResponse({ status: 201, description: 'create member successfully' })
  create(@Body() payload: CreateMemberDto) {
    const member = this.memberService.create(payload);
    return {
      message: 'create member successfully',
      data: member,
    };
  }

  @Get()
  @ApiOperation({ summary: 'get all members' })
  @ApiResponse({ status: 200, description: 'get all members successfully!' })
  async findAll() {
    const members = await this.memberService.findAll();

    return {
      message: 'get all members successfully!',
      data: members,
    };
  }
}
