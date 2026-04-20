import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as crypto from 'crypto';
import type { Request, Response } from 'express';

@Injectable()
export class EtagInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();

    if (request.url.includes('/events')) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data: unknown) => {
        const response = context.switchToHttp().getResponse<Response>();

        if (data === undefined || response.headersSent) {
          return data;
        }

        const responseBody = JSON.stringify(data);
        const etag = `W/"${crypto.createHash('sha256').update(responseBody).digest('hex')}"`;

        if (request.headers['if-none-match'] === etag) {
          response.status(304);
          return null;
        }

        response.setHeader('ETag', etag);
        response.setHeader(
          'Cache-Control',
          'public, max-age=0, must-revalidate',
        );

        return data;
      }),
    );
  }
}
