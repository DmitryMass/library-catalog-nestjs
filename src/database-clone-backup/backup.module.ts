import { BackupController } from './backup.controller';
import { BackupService } from './backup.service';

import { Book, BookSchema } from '@catalog/schema/book.schema';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
  controllers: [BackupController],
  providers: [BackupService],
})
export class BackupModule {}
