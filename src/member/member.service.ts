import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}

  async generateMemberCode(): Promise<string> {
    const memberCount = await this.prisma.member.count();

    const formattedCount = String(memberCount + 1).padStart(3, '0');

    return `M${formattedCount}`;
  }
  async create(createMemberDto: CreateMemberDto) {
    const code = await this.generateMemberCode();

    return this.prisma.member.create({
      data: {
        name: createMemberDto.name,
        code,
      },
    });
  }

  async findAll() {
    return await this.prisma.member.findMany({
      include: {
        _count: {
          select: {
            borrows: {
              where: {
                returnDate: null,
              },
            },
          },
        },
      },
    });
  }

}
