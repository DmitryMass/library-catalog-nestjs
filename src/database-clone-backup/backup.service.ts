import { Connection, Model, createConnection } from 'mongoose';

import { Book, BookSchema } from '@catalog/schema/book.schema';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class BackupService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,

    private readonly config: ConfigService,
  ) {}
  private backUpDataBase = this.config.get<string>('backUpDataBase');
  logger = new Logger('Backup');
  @Cron('0 0 */5 * *')
  async handleCron() {
    this.logger.log('Запуск клонирования базы данных...');
    let backupConnection: Connection;

    try {
      // Динамическое подключение к резервной базе данных
      backupConnection = await createConnection(
        this.backUpDataBase,
      ).asPromise();
      this.logger.log('Соединение с резервной базой данных установлено.');

      const BackupBookModel = backupConnection.model(Book.name, BookSchema); // Модель для резервной базы данных
      const books = await this.bookModel.find().lean(); // Получение всех записей из текущей базы данных

      for (const book of books) {
        await BackupBookModel.updateOne(
          { _id: book._id }, // Поиск по идентификатору
          { $set: book }, // Обновление всех полей
          { upsert: true }, // Вставка, если запись не найдена
        );
      }
      this.logger.log('Резервное копирование завершено успешно.');

      return { success: true };
    } catch (error) {
      this.logger.error('Ошибка при выполнении резервного копирования:', error);

      return { success: false };
    } finally {
      if (backupConnection) {
        await backupConnection.close();
        this.logger.log('Соединение с резервной базой данных закрыто.');
      }
    }
  }
}
