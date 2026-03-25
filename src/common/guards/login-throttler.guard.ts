import { Injectable } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';

@Injectable()
export class LoginThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const email = req.body?.email || 'anonymous';
    return `login-${email}`;
  }

  protected getLimit(): Promise<number> {
    return Promise.resolve(5);
  }

  protected getTtl(): Promise<number> {
    return Promise.resolve(60000); // 1 minute
  }

  protected async throwThrottlingException(): Promise<void> {
    throw new ThrottlerException(
      'Too many login attempts. Please try again after 1 minute.',
    );
  }
}
