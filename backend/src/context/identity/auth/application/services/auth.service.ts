import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../../users/application/services/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from '../../../users/infrastructure/database/models/user.entity';
import { RegisterInput, LoginInput } from '../dto/auth.inputs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password_hash))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role, name: user.name };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }

  async register(input: RegisterInput) {
    const existingUser = await this.usersService.findByEmail(input.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const user = await this.usersService.create({
      ...input,
      password_hash: hashedPassword,
    });

    return this.login(user);
  }
}
