import { ConflictException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

export const filesUploadInterceptor = FilesInterceptor('files', 10, {
  fileFilter: (req, file, callback) => {
    const allowedMimeTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'image/svg+xml',
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new ConflictException(
          'Невірний формат. Оберіть один з: (png | jpg | webp | jpeg | svg)',
        ),
        false,
      );
    }
  },
});
