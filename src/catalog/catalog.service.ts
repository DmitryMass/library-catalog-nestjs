import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageResponse } from 'src/types/generalTypes';
import { ERROR_MSG, SUCCESS_MSG } from 'src/utils/responses';
import { CreateBookDto } from './dto/createBook.dto';
import { Book } from './schema/book.schema';

@Injectable()
export class CatalogService {
  constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

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
}
