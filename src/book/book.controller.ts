import { Controller, Get, Post, Body } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BorrowReturnBookDto } from './dto/borrow-return-book.dto';

@Controller('book')
@ApiTags('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  //Find All Books
  @Get()
  @ApiOperation({ summary: 'get all books' })
  @ApiResponse({ status: 200, description: 'success get All books!' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request, Book code already exists!',
  })
  async findAll() {
    const books = await this.bookService.findAll();

    return {
      message: 'success get All books!',
      data: books,
    };
  }

  //Create Book
  @Post()
  @ApiOperation({ summary: 'create book' })
  @ApiBody({ type: CreateBookDto })
  @ApiResponse({ status: 201, description: 'create book successfully!' })
  async create(
    @Body()
    payload: CreateBookDto,
  ) {
    const book = await this.bookService.create(payload);

    return {
      message: 'create book successfully!',
      data: book,
    };
  }

  //Borrow Book
  @Post('/borrow')
  @ApiOperation({ summary: 'Borrow a book' })
  @ApiBody({ type: BorrowReturnBookDto })
  @ApiResponse({ status: 201, description: 'Book borrowed successfully' })
  @ApiResponse({
    status: 400,
    description:
      'Bad request, Member has already borrowed 2 books or Member has a penalty',
  })
  @ApiResponse({ status: 404, description: 'Member or book Not found' })
  async borrowBook(
    @Body()
    payload: BorrowReturnBookDto,
  ) {
    return await this.bookService.borrowBook(payload);
  }

  //Return Book
  @Post('return')
  @ApiOperation({ summary: 'Return a book' })
  @ApiBody({ type: BorrowReturnBookDto })
  @ApiResponse({ status: 201, description: 'Book returned successfully' })
  @ApiResponse({ status: 400, description: 'Bad request, Book not Borrowed' })
  @ApiResponse({ status: 404, description: 'Member or book Not found' })
  async returnBook(
    @Body()
    payload: BorrowReturnBookDto,
  ) {
    return await this.bookService.returnBook(payload);
  }
}
