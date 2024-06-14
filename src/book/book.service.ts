import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { BorrowReturnBookDto } from './dto/borrow-return-book.dto';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  //Find All Books
  async findAll() {
    const books = await this.prisma.book.findMany();

    return books.filter((book) => book.stock != 0);
  }

  //Create Book
  async create(payload: CreateBookDto) {
    const book = await this.prisma.book.findUnique({
      where: {
        code: payload.code,
      },
    });

    if (book) {
      throw new BadRequestException('Bad Request, Book code already exists!');
    }

    return await this.prisma.book.create({
      data: payload,
    });
  }

  //Borrow Book
  async borrowBook(payload: BorrowReturnBookDto) {
    const member = await this.prisma.member.findUnique({
      where: {
        code: payload.memberCode,
      },
    });

    if (!member) throw new NotFoundException('Member not found');

    const memberBorrows = await this.prisma.borrow.findMany({
      where: {
        memberId: member.id,
        returnDate: null,
      },
    });

    if (memberBorrows.length >= 2)
      throw new BadRequestException('Member has already borrowed 2 books');

    if (member.penaltyEnds && member.penaltyEnds > new Date())
      throw new BadRequestException('Member has a penalty');

    const book = await this.prisma.book.findUnique({
      where: {
        code: payload.bookCode,
      },
    });

    if (!book || book.stock === 0)
      throw new NotFoundException('Book not found or out of stock');

    await this.prisma.book.update({
      where: {
        code: payload.bookCode,
      },
      data: {
        stock: book.stock - 1,
      },
    });

    return await this.prisma.borrow.create({
      data: {
        memberId: member.id,
        bookId: book.id,
      },
    });
  }

  //Return Book
  async returnBook(payload: BorrowReturnBookDto) {
    const book = await this.prisma.book.findUnique({
      where: {
        code: payload.bookCode,
      },
    });

    if (!book) throw new NotFoundException('Book not found');

    const member = await this.prisma.member.findUnique({
      where: {
        code: payload.memberCode,
      },
    });

    if (!member) throw new BadRequestException('Member not found');

    const borrow = await this.prisma.borrow.findFirst({
      where: {
        memberId: member.id,
        bookId: book.id,
        returnDate: null,
      },
    });

    if (!borrow) throw new BadRequestException('Book not borrowed');

    const returnDate = new Date();
    const borrowDuration =
      (returnDate.getTime() - borrow.borrowDate.getTime()) /
      (1000 * 60 * 60 * 24);

    if (borrowDuration > 7) {
      const penaltyEnds = new Date();
      penaltyEnds.setDate(penaltyEnds.getDate() + 3);

      await this.prisma.member.update({
        where: {
          id: member.id,
        },
        data: {
          penaltyEnds,
        },
      });
    }

    await this.prisma.book.update({
      where: {
        id: book.id,
      },
      data: {
        stock: book.stock + 1,
      },
    });

    return await this.prisma.borrow.update({
      where: {
        id: borrow.id,
      },
      data: {
        returnDate,
      },
    });
  }
}
