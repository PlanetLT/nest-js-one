import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';

type HttpExceptionResponse =
  | string
  | {
      message?: string | string[];
      error?: string;
      title?: string;
      statusCode?: number;
    };

type ApiErrorResponse = {
  message: string | string[];
  title: string;
  statusCode: number;
};

const httpStatusTitles: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: 'Bad Request',
  [HttpStatus.UNAUTHORIZED]: 'Unauthorized',
  [HttpStatus.FORBIDDEN]: 'Forbidden',
  [HttpStatus.NOT_FOUND]: 'Not Found',
  [HttpStatus.CONFLICT]: 'Conflict',
  [HttpStatus.TOO_MANY_REQUESTS]: 'Too Many Requests',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
};

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const body = this.buildResponse(exception);

    response.status(body.statusCode).json(body);
  }

  private buildResponse(exception: unknown): ApiErrorResponse {
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const exceptionResponse =
        exception.getResponse() as HttpExceptionResponse;

      if (typeof exceptionResponse === 'string') {
        return {
          message: exceptionResponse,
          title: this.getTitle(statusCode, exception.name),
          statusCode,
        };
      }

      return {
        message: exceptionResponse.message ?? exception.message,
        title:
          exceptionResponse.title ??
          exceptionResponse.error ??
          this.getTitle(statusCode, exception.name),
        statusCode,
      };
    }

    return {
      message: 'Internal server error',
      title: 'Internal Server Error',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }

  private getTitle(statusCode: number, fallback: string): string {
    return httpStatusTitles[statusCode] ?? fallback;
  }
}
