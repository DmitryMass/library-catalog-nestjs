import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { MessageResponse } from 'types/generalTypes';

import { RegistrationDto } from './dto/registration-user.dto';
import { User } from './schema/admin.schema';

import { ERROR_MSG, SUCCESS_MSG } from '@utils/responses';

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async registration(
    registrationDto: RegistrationDto,
  ): Promise<MessageResponse> {
    const { email, password, role } = registrationDto;
    const user = await this.userModel.findOne({ email });

    if (user) {
      throw new BadRequestException(ERROR_MSG.userExist);
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, salt);
      await this.userModel.create({
        email,
        password: hashedPass,
        role,
      });
      return { message: SUCCESS_MSG.signUp };
    } catch (err) {
      throw new InternalServerErrorException(ERROR_MSG.server);
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (user) {
      const passwordIsMatch = await bcrypt.compare(password, user.password);
      if (passwordIsMatch) {
        return user;
      } else {
        throw new UnauthorizedException(ERROR_MSG.wrongData);
      }
    } else {
      throw new NotFoundException(ERROR_MSG.userNotFound);
    }
  }

  async login(user) {
    const { id, email, role } = user;
    return {
      token: this.jwtService.sign({
        id: id,
        email: email,
        role,
      }),
    };
  }
}
