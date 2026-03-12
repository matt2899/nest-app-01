import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { EmployeesModule } from './employees/employees.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MyLoggerModule } from './my_logger/my_logger.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule,
    EmployeesModule,
    ThrottlerModule.forRoot([{
      name: 'short',
      ttl: 1000,
      limit: 3,
    }, {
      name: 'long',
      ttl: 60000,
      limit: 100,
    }]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MyLoggerModule,
    AuthModule,],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  }],
})
export class AppModule { }
