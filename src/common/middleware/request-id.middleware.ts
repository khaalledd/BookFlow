import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const reqId = uuidv4();
    req['id'] = reqId; // Store for internal use (like logger, interceptors)
    req.headers['x-request-id'] = reqId; // Also add to headers if missing

    // Attach to response headers
    res.setHeader('x-request-id', reqId);

    next();
  }
}
