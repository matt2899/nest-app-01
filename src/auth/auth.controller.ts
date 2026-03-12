import { Controller, Post, Body, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from "express";
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    async profile(@Req() req) {
        return req.user;
    }

    @Post('signup')
    async signUp(@Body() body: { email: string; password: string }) {
        return this.authService.signup(body.email, body.password);
    }

    @Post('signin')
    async signIn(@Body() body: { email: string; password: string }, @Res({ passthrough: true }) res: Response) {
        const tokens = await this.authService.signin(body.email, body.password);

        res.cookie('access_token', tokens.accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60, // 1 hour
        })

        res.cookie('refresh_token', tokens.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        })

        return { message: 'Signed in successfully' };
    }

}
