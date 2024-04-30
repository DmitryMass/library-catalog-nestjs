import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalErrorCatcher implements ExceptionFilter {
  private readonly logger = new Logger(GlobalErrorCatcher.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = 500;
    let errorMessage = 'Внутрішня помилка серверу.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      errorMessage = exception.message;
    }

    this.logger.error(
      `HTTP Status: ${status}, Error Message: ${errorMessage}, Path: ${request.url}, Method: ${request.method}`,
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: errorMessage,
    });
  }
}
