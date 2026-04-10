import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const endTime = Date.now();
        const duration = endTime - startTime;

        const ctxType = context.getType<'http' | 'graphql'>();

        if (ctxType === 'http') {
          const response = context.switchToHttp().getResponse();
          response.header('X-Elapsed-Time', `${duration}ms`);
        } else if (ctxType === 'graphql') {
          const gqlCtx = GqlExecutionContext.create(context);
          const response = gqlCtx.getContext().res;
          if (response && response.header) {
            response.header('X-Elapsed-Time', `${duration}ms`);
          }
        }

        console.log(`[TimingInterceptor] Request processed in ${duration}ms`);
      }),
    );
  }
}
