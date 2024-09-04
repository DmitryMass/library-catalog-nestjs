import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { Book, BookSchema } from './schema/book.schema';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
