import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as crypto from 'crypto';

@Injectable()
export class EtagInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (context.getType() === 'http') {
          const response = context.switchToHttp().getResponse();
          const request = context.switchToHttp().getRequest();

          const responseBody = JSON.stringify(data);

          const etag = `W/"${crypto.createHash('sha256').update(responseBody).digest('hex')}"`;

          if (request.headers['if-none-match'] === etag) {
            response.status(304);
            return null;
          }

          response.setHeader('ETag', etag);
          response.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        }

        return data;
      }),
    );
  }
}
