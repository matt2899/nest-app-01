import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from 'src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

    constructor(private configService: ConfigService) {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        console.log('DATABASE_URL:', databaseUrl);

        const pool = new Pool({
            connectionString: databaseUrl,
        });
        const adapter = new PrismaPg(pool);

        super({ adapter });
    }

    async onModuleInit() {
        await this.$connect();
        console.log('Database connected successfully');
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}