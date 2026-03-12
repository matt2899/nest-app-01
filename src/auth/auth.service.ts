import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly databaseService: DatabaseService, private readonly jwtService: JwtService) { }

    async signin(email: string, password: string) {
        const user = await this.databaseService.user.findUnique({
            where: { email },
        })

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw new Error('Invalid credentials');
        }

        // Generate JWT token
        const payload = { id: user.id, email: user.email, message: "Authenticated..." };

        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: '15m', // Token expires in 15 minutes
        });

        const refreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: '7d', // Refresh token expires in 7 days
        });

        return { accessToken, refreshToken };


    }

    async signup(email: string, password: string) {
        const existingUser = await this.databaseService.user.findUnique({
            where: { email },
        })

        const hanshedPassword = await bcrypt.hash(password, 10);

        const user = await this.databaseService.user.create({
            data: {
                email,
                password: hanshedPassword,
            }
        })
        return user;
    }




}
