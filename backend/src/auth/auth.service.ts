import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './schemas/user.schema';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Role } from './schemas/user.schema';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async onModuleInit() {
    // Check for the specific admin user instead of an empty database
    const adminExists = await this.userModel.findOne({
      email: 'admin@test.com',
    });

    if (!adminExists) {
      this.logger.log('Seeding database with default users...');

      const salt = await bcrypt.genSalt();
      const defaultPassword = await bcrypt.hash('Password123!', salt);

      await this.userModel.insertMany([
        {
          email: 'admin@test.com',
          password: defaultPassword,
          role: Role.ADMIN,
        },
        {
          email: 'member1@test.com',
          password: defaultPassword,
          role: Role.MEMBER,
        },
        {
          email: 'member2@test.com',
          password: defaultPassword,
          role: Role.MEMBER,
        },
      ]);

      this.logger.log(
        '✅ Seeded 1 Admin and 2 Members (Password for all: Password123!)',
      );
    } else {
      this.logger.log('ℹ️ Default admin already exists. Skipping seed.');
    }
  }

  async register(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ message: string }> {
    const { email, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new this.userModel({ email, password: hashedPassword });

    try {
      await user.save();
      return { message: 'User successfully registered' };
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async login(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = authCredentialsDto;
    const user = await this.userModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { email: user.email, sub: user._id };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
