import {
    BadRequestException,
    ConflictException,
    Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { WEB_APP_URL } from 'src/main';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../mail/mail.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly mailService: MailService,
    ) {}

    async create(createUserDto: CreateUserDto) {
        const existingUser = await this.userRepository.findOne({
            where: [
                { email: createUserDto.email },
                { username: createUserDto.username },
            ],
        });

        if (existingUser) {
            throw new ConflictException(
                'Conflict - duplicated email or username',
            );
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const verificationToken = this.generateVerificationToken(
            createUserDto.email,
        );

        const user = this.userRepository.create({
            name: createUserDto.name,
            email: createUserDto.email,
            username: createUserDto.username,
            password: hashedPassword,
            verificationToken,
        });

        const savedUser = await this.userRepository.save(user);

        await this.sendVerificationEmail(
            createUserDto.name,
            createUserDto.email,
            verificationToken,
        );

        return savedUser;
    }

    findAll() {
        return `This action returns all users`;
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }

    async verifyAccount(token: string) {
        try {
            const secretKey = '123amanda987'; // todo - put in .env
            jwt.verify(token, secretKey) as { email: string };

            const user = await this.userRepository.findOne({
                where: { verificationToken: token },
            });

            if (!user) {
                return false;
            }

            user.verified = true;
            user.verificationToken = null;

            await this.userRepository.save(user);

            return true;
        } catch {
            throw new BadRequestException('Token expired');
        }
    }

    private generateVerificationToken(email: string) {
        const payload = { email };
        const secretKey = '123amanda987';
        const expirationTime = '24h';

        return jwt.sign(payload, secretKey, {
            expiresIn: expirationTime,
        });
    }

    private async sendVerificationEmail(
        name: string,
        email: string,
        token: string,
    ) {
        console.log(`Send verification email to ${email} with token: ${token}`);

        const verificationUrl = `${WEB_APP_URL}/verify-account/${token}`;

        await this.mailService.sendVerificationEmail(
            email,
            'Verify Your Account',
            {
                name,
                verificationUrl,
            },
        );

        console.log(`Verification email sent to ${email}`);
    }
}
