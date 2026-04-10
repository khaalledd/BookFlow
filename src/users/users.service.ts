import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Role } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/types/paginated.type';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Omit<User, 'password'>>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          avatarUrl: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return new PaginatedResult(data as any[], total, page, limit);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id); // ensure exists
    await this.prisma.user.delete({ where: { id } });
  }

  async create(userData: {
    email: string;
    name: string;
    password: string;
    role?: Role;
    phone?: string;
  }): Promise<User> {
    return this.prisma.user.create({ data: userData });
  }

  async updateAvatarUrl(id: string, avatarUrl: string): Promise<User> {
    await this.findById(id); // ensure exists
    return this.prisma.user.update({
      where: { id },
      data: { avatarUrl },
    });
  }
}
