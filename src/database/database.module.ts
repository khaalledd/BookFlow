import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                url: configService.get<string>('DATABASE_URL'),
                ssl: true, // Typically required for Neon
                autoLoadEntities: true,
                synchronize: process.env.NODE_ENV !== 'production', // Caution: Don't use true in production
            }),
        }),
    ],
})
export class DatabaseModule { }