import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import type { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let msg: object | string | any[] | null = null;

    if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
      msg = (exceptionResponse as any).message;
    } else {
      msg = exceptionResponse;
    }

    response.status(status).json({ status: 'failed', msg });
  }
}
