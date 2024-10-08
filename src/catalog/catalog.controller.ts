import { MessageResponse, ROLE } from 'types/generalTypes';

import { CatalogService } from './catalog.service';
import { CreateBookDto } from './dto/createBook.dto';
import { EditBookDto } from './dto/editBook.dto';
import { Book } from './schema/book.schema';

import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RoleGuard } from '@auth/guards/role-checker.guard';

import { ERROR_MSG, SUCCESS_MSG } from '@utils/responses';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('catalog')
@ApiTags('Catalog Routes')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @ApiOperation({ summary: 'Отримати книги' })
  @ApiBearerAuth('Token')
  @ApiUnauthorizedResponse({
    description: ERROR_MSG.userAccess,
  })
  @ApiOkResponse({
    description: SUCCESS_MSG.getBooks,
  })
  @ApiNotFoundResponse({ description: ERROR_MSG.booksNotFound })
  @ApiInternalServerErrorResponse({ description: ERROR_MSG.server })
  @ApiQuery({ name: 'type', required: true, type: String })
  @Get('books')
  @UseGuards(JwtAuthGuard, RoleGuard(ROLE.general))
  getBooks(
    @Query('type') type: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('classNumber') classNumber: string,
  ): Promise<{ books: Book[]; total: number; totalPrice: number }> {
    return this.catalogService.getBooks(type, page, limit, classNumber);
  }

  // @ApiOperation({ summary: 'Отримати книги по классам' })
  // @ApiBearerAuth('Token')
  // @ApiUnauthorizedResponse({
  //   description: ERROR_MSG.userAccess,
  // })
  // @ApiOkResponse({
  //   description: SUCCESS_MSG.getBooks,
  // })
  // @ApiNotFoundResponse({ description: ERROR_MSG.booksNotFound })
  // @ApiInternalServerErrorResponse({ description: ERROR_MSG.server })
  // @Get('books/by/:classNumber')
  // @UseGuards(JwtAuthGuard, RoleGuard(ROLE.general))
  // getBooksByClassNumber(
  //   @Query('page') page: string,
  //   @Query('limit') limit: string,
  //   @Param('classNumber') classNumber: string,
  // ): Promise<{ books: Book[]; total: number; totalPrice: number }> {
  //   return this.catalogService.getBooksByClassNumber(page, limit, classNumber);
  // }

  @ApiOperation({ summary: 'Отримати одну книгу' })
  @ApiBearerAuth('Token')
  @ApiUnauthorizedResponse({
    description: ERROR_MSG.userAccess,
  })
  @ApiOkResponse({
    description: SUCCESS_MSG.getBook,
  })
  @ApiNotFoundResponse({ description: ERROR_MSG.bookNotFound })
  @ApiInternalServerErrorResponse({ description: ERROR_MSG.server })
  @Get('books/:bookId')
  @UseGuards(JwtAuthGuard, RoleGuard(ROLE.general))
  getBook(@Param('bookId') bookId: string): Promise<Book> {
    return this.catalogService.getBook(bookId);
  }

  @ApiOperation({ summary: 'Пошук книг' })
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: SUCCESS_MSG.getBooks,
  })
  @ApiUnauthorizedResponse({
    description: ERROR_MSG.userAccess,
  })
  @ApiNotFoundResponse({ description: ERROR_MSG.booksNotFound })
  @ApiInternalServerErrorResponse({
    description: ERROR_MSG.server,
  })
  @Get('search/:type')
  @UseGuards(JwtAuthGuard, RoleGuard(ROLE.general))
  searchBookBy(
    @Param('type') type: string,
    @Query('q') query: string,
  ): Promise<Book[]> {
    return this.catalogService.searchBookBy(query, type);
  }

  @ApiOperation({ summary: 'Отримати архівовані книги' })
  @ApiBearerAuth('Token')
  @ApiUnauthorizedResponse({
    description: ERROR_MSG.userAccess,
  })
  @ApiOkResponse({
    description: SUCCESS_MSG.getBooks,
  })
  @ApiNotFoundResponse({ description: ERROR_MSG.booksNotFound })
  @ApiInternalServerErrorResponse({ description: ERROR_MSG.server })
  @Get('archive/books')
  // @UseGuards(JwtAuthGuard, RoleGuard(ROLE.general))
  getArchiveBooks(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<{ books: Book[]; total: number }> {
    return this.catalogService.getArchiveBooks(page, limit);
  }

  @ApiOperation({ summary: 'Пошук архівованих книг' })
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: SUCCESS_MSG.getBooks,
  })
  @ApiUnauthorizedResponse({
    description: ERROR_MSG.userAccess,
  })
  @ApiNotFoundResponse({ description: ERROR_MSG.booksNotFound })
  @ApiInternalServerErrorResponse({
    description: ERROR_MSG.server,
  })
  @Get('search/archive/books/data')
  @UseGuards(JwtAuthGuard, RoleGuard(ROLE.general))
  searchArchiveBookBy(@Query('q') query: string): Promise<Book[]> {
    return this.catalogService.searchArchiveBookBy(query);
  }

  @ApiOperation({ summary: 'Додати нову кнгиу' })
  @ApiBearerAuth('Token')
  @ApiUnauthorizedResponse({
    description: ERROR_MSG.userAccess,
  })
  @ApiCreatedResponse({
    description: SUCCESS_MSG.createBookSuccess,
    type: MessageResponse,
  })
  @ApiInternalServerErrorResponse({ description: ERROR_MSG.server })
  @Post('createBook')
  @UseGuards(JwtAuthGuard, RoleGuard(ROLE.general))
  createBook(@Body() createBookDto: CreateBookDto): Promise<MessageResponse> {
    return this.catalogService.createBook(createBookDto);
  }

  @ApiOperation({ summary: 'Редагувати книгу' })
  @ApiBearerAuth('Token')
  @ApiUnauthorizedResponse({
    description: ERROR_MSG.userAccess,
  })
  @ApiOkResponse({
    description: SUCCESS_MSG.bookEdit,
    type: MessageResponse,
  })
  @ApiNotFoundResponse({ description: ERROR_MSG.bookNotFound })
  @ApiInternalServerErrorResponse({ description: ERROR_MSG.server })
  @Put(':bookId')
  @UseGuards(JwtAuthGuard, RoleGuard(ROLE.general))
  editBook(
    @Body() editBookDto: EditBookDto,
    @Param('bookId') bookId: string,
  ): Promise<MessageResponse> {
    return this.catalogService.editBook(editBookDto, bookId);
  }

  @ApiOperation({ summary: 'Перемістити в корзину / з корзини' })
  @ApiBearerAuth('Token')
  @ApiUnauthorizedResponse({
    description: ERROR_MSG.userAccess,
  })
  @ApiOkResponse({
    description: SUCCESS_MSG.tobasket,
    type: MessageResponse,
  })
  @ApiNotFoundResponse({ description: ERROR_MSG.bookNotFound })
  @ApiInternalServerErrorResponse({ description: ERROR_MSG.server })
  @Put('tobasket/:bookId')
  @UseGuards(JwtAuthGuard, RoleGuard(ROLE.general))
  intoBasket(@Param('bookId') bookId: string): Promise<MessageResponse> {
    return this.catalogService.intoBasket(bookId);
  }

  @ApiOperation({ summary: 'Видалити книгу повністю' })
  @ApiBearerAuth('Token')
  @ApiUnauthorizedResponse({
    description: ERROR_MSG.userAccess,
  })
  @ApiOkResponse({
    description: SUCCESS_MSG.bookDeleted,
    type: MessageResponse,
  })
  @ApiNotFoundResponse({ description: ERROR_MSG.bookNotFound })
  @ApiInternalServerErrorResponse({ description: ERROR_MSG.server })
  @Delete(':bookId')
  @UseGuards(JwtAuthGuard, RoleGuard(ROLE.general))
  deleteBook(@Param('bookId') bookId: string): Promise<MessageResponse> {
    return this.catalogService.deleteBook(bookId);
  }
}
