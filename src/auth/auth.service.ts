import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { Role } from '@prisma/client';
import type { User } from '@prisma/client';
import type { StringValue } from 'ms';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

type RefreshTokenPayload = {
  sub: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // ─── Registration ────────────────────────────────────────────
  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);

    if (existingUser) {
      throw new ConflictException('Email already in use!');
    }

    const hashedPassword = await this.hashPassword(registerDto.password);

    const savedUser = await this.usersService.create({
      email: registerDto.email,
      name: registerDto.name,
      password: hashedPassword,
      phone: registerDto.phone,
      role: registerDto.role || Role.CUSTOMER,
    });

    const result = this.excludePassword(savedUser);

    this.eventEmitter.emit('user.registered', { email: savedUser.email });

    return {
      user: result,
      message: 'Registration successful! Please login to continue.',
    };
  }

  // ─── Login ───────────────────────────────────────────────────
  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (
      !user ||
      !(await this.verifyPassword(loginDto.password, user.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = this.generateTokens(user);
    const result = this.excludePassword(user);

    return { user: result, ...tokens };
  }

  // ─── Refresh Token ───────────────────────────────────────────
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<RefreshTokenPayload>(
        refreshToken,
        {
          secret: this.configService.get<string>('app.jwt.refreshSecret'),
        },
      );

      const user = await this.usersService.findById(payload.sub);
      const accessToken = this.generateAccessToken(user);

      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  // ─── Get User by ID (for JWT Strategy) ──────────────────────
  async getUserById(id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  // ─── Create Admin ──────────────────────────────────────────
  async createAdmin(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);

    if (existingUser) {
      throw new ConflictException('Email already in use!');
    }

    const hashedPassword = await this.hashPassword(registerDto.password);

    const savedUser = await this.usersService.create({
      email: registerDto.email,
      name: registerDto.name,
      password: hashedPassword,
      role: Role.ADMIN,
    });

    const result = this.excludePassword(savedUser);
    return {
      user: result,
      message: 'Admin created successfully.',
    };
  }

  // ─── Private Helpers ─────────────────────────────────────────
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  private generateTokens(user: User) {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
    };
  }

  private generateAccessToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const expiresIn =
      (this.configService.get<string>('app.jwt.expiry') as StringValue) ??
      '15m';

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('app.jwt.secret')!,
      expiresIn,
    });
  }

  private generateRefreshToken(user: User): string {
    const payload = { sub: user.id };

    const expiresIn =
      (this.configService.get<string>(
        'app.jwt.refreshExpiry',
      ) as StringValue) ?? '7d';

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('app.jwt.refreshSecret')!,
      expiresIn,
    });
  }

  private excludePassword<T extends { password: string }>(
    user: T,
  ): Omit<T, 'password'> {
    const safeUser: Partial<T> = { ...user };
    delete safeUser.password;
    return safeUser as Omit<T, 'password'>;
  }
}
