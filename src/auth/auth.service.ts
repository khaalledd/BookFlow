import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User, Role } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

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
      role: Role.ATTENDEE,
    });

    const { password, ...result } = savedUser;
    return {
      user: result,
      message: 'Registration successful! Please login to continue.',
    };
  }

  // ─── Login ───────────────────────────────────────────────────
  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user || !(await this.verifyPassword(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = this.generateTokens(user);
    const { password, ...result } = user;

    return { user: result, ...tokens };
  }

  // ─── Refresh Token ───────────────────────────────────────────
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('app.jwt.refreshSecret'),
      });

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

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('app.jwt.secret')!,
      expiresIn: this.configService.get<string>('app.jwt.expiry') as any,
    });
  }

  private generateRefreshToken(user: User): string {
    const payload = { sub: user.id };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('app.jwt.refreshSecret')!,
      expiresIn: this.configService.get<string>('app.jwt.refreshExpiry') as any,
    });
  }
}
