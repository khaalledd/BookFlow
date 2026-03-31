import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const { method, originalUrl } = req;
        const { statusCode } = res;
        const duration = Date.now() - startTime;
        const requestId = req['id'] || req.headers['x-request-id'] || 'unknown';

        this.logger.log(`[${method}] ${originalUrl} ${statusCode} - ${duration}ms (ID: ${requestId})`);
      }),
    );
  }
}
