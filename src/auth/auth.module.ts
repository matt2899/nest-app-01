import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from 'src/database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { StringValue } from 'ms';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [DatabaseModule,
    ConfigModule.forRoot(), // load .env file
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) throw new Error('JWT_SECRET is not defined');

        return {
          secret,
          signOptions: {
            expiresIn: (configService.get<string>('JWT_EXPIRES_IN') ?? '1h') as StringValue,
          },
        };
      }
    })

  ],
})
export class AuthModule { }
