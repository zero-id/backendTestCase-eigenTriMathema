import {
  Controller,
  Get,
  Post,
  Body,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    const book = await this.bookService.create(createBookDto);



    return {
      message: 'success create book!',
      data: book,
    };
  }

  @Get()
  async findAll() {
    const books = await this.bookService.findAll();

    return {
      message: 'success get All books!',
      data: books,
    };
  }
}
