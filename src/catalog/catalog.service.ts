import { EditBookDto } from './dto/editBook.dto';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageResponse } from 'src/types/generalTypes';
import { ERROR_MSG, SUCCESS_MSG } from 'src/utils/responses';
import { CreateBookDto } from './dto/createBook.dto';
import { Book } from './schema/book.schema';

@Injectable()
export class CatalogService {
  constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

  async getBooks(
    type: string,
    page: string,
    limit: string,
  ): Promise<{ books: Book[]; total: number; totalPrice: number }> {
    const parseLimit = parseInt(limit);
    const parsePage = parseInt(page);
    const skip = (parsePage - 1) * parseLimit;
    const books = await this.bookModel
      .find({ type })
      .skip(skip)
      .limit(parseLimit);

    if (!books) {
      throw new NotFoundException(ERROR_MSG.booksNotFound);
    }
    const totalBook = await this.bookModel.find({ type });
    const result = await this.bookModel.aggregate([
      {
        $match: {
          isDeleted: false,
          type,
        },
      },
      {
        $group: {
          _id: null,
          totalPrice: { $sum: '$price' },
        },
      },
    ]);

    return {
      books,
      total: totalBook.length,
      totalPrice: result.length ? result[0].totalPrice : 0,
    };
  }

  async getBook(bookId: string): Promise<Book> {
    const book = await this.bookModel.findById(bookId);
    if (!book) {
      throw new NotFoundException(ERROR_MSG.bookNotFound);
    }
    return book;
  }

  async searchBookBy(query: string, type: string): Promise<Book[]> {
    try {
      const book = await this.bookModel.find({
        type,
        isDeleted: false,
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { author: { $regex: query, $options: 'i' } },
        ],
      });

      if (!book) {
        throw new NotFoundException(ERROR_MSG.bookNotFound);
      }

      return book;
    } catch (err) {
      throw new InternalServerErrorException(ERROR_MSG.server);
    }
  }

  async createBook(createBookDto: CreateBookDto): Promise<MessageResponse> {
    const {
      name,
      author,
      accompanyningDocumentNumber,
      dateOfArrival,
      disposalAct,
      price,
      publicationYear,
      type,
      classNumber,
    } = createBookDto;

    try {
      await this.bookModel.create({
        name,
        author,
        accompanyningDocumentNumber,
        dateOfArrival,
        disposalAct,
        price,
        publicationYear,
        type,
        classNumber,
      });

      return { message: SUCCESS_MSG.createBookSuccess };
    } catch (err) {
      throw new InternalServerErrorException(ERROR_MSG.server);
    }
  }

  async editBook(
    editBookDto: EditBookDto,
    bookId: string,
  ): Promise<MessageResponse> {
    const book = await this.bookModel.findById(bookId);
    if (!book) {
      throw new NotFoundException(ERROR_MSG.bookNotFound);
    }
    try {
      await this.bookModel.findByIdAndUpdate(book, {
        $set: { ...editBookDto },
      });

      return { message: SUCCESS_MSG.bookEdit };
    } catch (err) {
      throw new InternalServerErrorException(ERROR_MSG.server);
    }
  }

  async intoBasket(bookId: string): Promise<MessageResponse> {
    const book = await this.bookModel.findById(bookId);
    if (!book) {
      throw new NotFoundException(ERROR_MSG.bookNotFound);
    }
    try {
      await this.bookModel.findByIdAndUpdate(book, {
        $set: { isDeleted: !book.isDeleted },
      });
      return { message: 'Операція успішна.' };
    } catch (err) {
      throw new InternalServerErrorException(ERROR_MSG.server);
    }
  }

  async deleteBook(bookId: string): Promise<MessageResponse> {
    const book = await this.bookModel.findById(bookId);
    if (!book) {
      throw new NotFoundException(ERROR_MSG.bookNotFound);
    }
    try {
      await this.bookModel.findByIdAndDelete(book);
      return { message: SUCCESS_MSG.bookDeleted };
    } catch (err) {
      throw new InternalServerErrorException(ERROR_MSG.server);
    }
  }
}
