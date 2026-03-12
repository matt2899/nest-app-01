import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

function cookieExtractor(req: Request) {
    return req?.cookies?.access_token;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: cookieExtractor,
            secretOrKey: config.get('JWT_SECRET'),
        });
    }

    async validate(payload: any) {
        return payload;
    }
}