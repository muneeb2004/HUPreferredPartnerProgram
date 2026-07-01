import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exception.message.replace(/\n/g, '');

    if (exception.code === 'P2002') {
      status = HttpStatus.CONFLICT;
      message = `Unique constraint failed on field(s): ${exception.meta?.target}`;
    }

    if (exception.code === 'P2025') {
      status = HttpStatus.NOT_FOUND;
      message = `Record not found`;
    }

    response.status(status).json({
      data: null,
      meta: {},
      errors: [
        {
          code: exception.code,
          message,
        },
      ],
    });
  }
}
