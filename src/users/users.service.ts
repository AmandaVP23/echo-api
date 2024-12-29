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
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UsersService {
    private verificationTokenExpirationHours: number;
    private webAppBaseUrl: string;

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly mailService: MailService,
        private readonly configService: ConfigService,
    ) {
        this.verificationTokenExpirationHours =
            configService.get<number>('VERIFICATION_TOKEN_DURATION_HOURS') ||
            24;

        this.webAppBaseUrl = configService.get<string>('WEB_APP_URL');
    }

    async create(
        createUserDto: CreateUserDto,
        avatar: Express.Multer.File | null,
    ) {
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
        const verificationToken = uuidv4();

        let avatarPath: string | null = null;

        const expirationTime = new Date();
        expirationTime.setHours(
            expirationTime.getHours() + this.verificationTokenExpirationHours,
        );

        if (avatar) {
            const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(avatar.originalname)}`;
            avatarPath = path.join('./storage/avatars', fileName);

            fs.writeFileSync(avatarPath, avatar.buffer);
        }

        const user = this.userRepository.create({
            name: createUserDto.name,
            email: createUserDto.email,
            username: createUserDto.username,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpires: expirationTime,
            avatar: avatarPath,
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
        const user = await this.userRepository.findOne({
            where: { verificationToken: token },
        });

        if (!user) {
            throw new BadRequestException('Invalid token');
        }

        if (new Date() > user.verificationTokenExpires) {
            throw new BadRequestException('Token expired');
        }

        await this.userRepository.update(user.id, {
            verificationToken: null,
            verificationTokenExpires: null,
            verified: true,
        });

        return true;
    }

    private async sendVerificationEmail(
        name: string,
        email: string,
        token: string,
    ) {
        console.log(`Send verification email to ${email} with token: ${token}`);

        const verificationUrl = `${this.webAppBaseUrl}/verify-account/${token}`;

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
