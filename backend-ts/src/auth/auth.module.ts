import { Module } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { getSecret } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/User';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: getSecret(),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [JwtStrategy],
})
export class AuthModule {
  constructor(private jwtService: JwtService) {}
}
