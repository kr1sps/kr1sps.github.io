import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Request, Response } from 'express';

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<unknown> {
    const ctxType = context.getType<'http' | 'graphql'>();

    if (ctxType === 'http') {
      const request = context.switchToHttp().getRequest<Request>();

      if (request.url.includes('/events')) {
        return next.handle();
      }
    }

    const startTime = Date.now();
    return next.handle().pipe(
      tap(() => {
        const endTime = Date.now();
        const duration = endTime - startTime;

        if (ctxType === 'http') {
          const response = context.switchToHttp().getResponse<Response>();
          if (!response.headersSent) {
            response.setHeader('X-Elapsed-Time', `${duration}ms`);
          }
        } else if (ctxType === 'graphql') {
          const gqlCtx = GqlExecutionContext.create(context);
          const response = gqlCtx.getContext<{ res: Response }>().res;

          if (response && response.setHeader && !response.headersSent) {
            response.setHeader('X-Elapsed-Time', `${duration}ms`);
          }
        }

        console.log(`[TimingInterceptor] Request processed in ${duration}ms`);
      }),
    );
  }
}
