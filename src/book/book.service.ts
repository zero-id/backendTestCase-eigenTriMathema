import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}
  async create(createBookDto: CreateBookDto) {
    return await this.prisma.book.create({
      data: createBookDto,
    });
  }

  async findAll() {
    const books = await this.prisma.book.findMany();

    return books.filter((book) => book.stock != 0);
  }
}
