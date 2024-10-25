import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import axios from 'axios';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    if (status == 500) {
      // send notify
      const DISCORD_URL = process.env.DISCODE_WEBHOOK
      if (!!DISCORD_URL) {
        console.log(DISCORD_URL);

        axios.post(DISCORD_URL, {
          content: JSON.stringify(exception)
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}

import {
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    console.error(exception);
    
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (httpStatus == 500) {
      const DISCORD_URL = process.env.DISCODE_WEBHOOK
      if (!!DISCORD_URL) {
        axios.post(DISCORD_URL, {
          content: exception['detail']
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
