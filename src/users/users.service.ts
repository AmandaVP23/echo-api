import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import sharp from 'sharp';

@Injectable()
export class UsersService {
    private verificationTokenExpirationHours: number;
    private webAppBaseUrl: string;
    private backendUrl: string;
    private avatarUploadPath: string;

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly mailService: MailService,
        private readonly configService: ConfigService,
    ) {
        this.verificationTokenExpirationHours = configService.get<number>('VERIFICATION_TOKEN_DURATION_HOURS') || 24;
        this.webAppBaseUrl = configService.get<string>('WEB_APP_URL');
        this.backendUrl = configService.get<string>('BACKEND_URL');
        this.avatarUploadPath = configService.get<string>('AVATAR_UPLOAD_PATH');
    }

    async create(createUserDto: CreateUserDto, avatar: Express.Multer.File | null) {
        const existingUser = await this.userRepository.findOne({
            where: [{ email: createUserDto.email }, { username: createUserDto.username }],
        });

        if (existingUser) {
            throw new ConflictException('Conflict - duplicated email or username');
        }

        const hashedPassword = await this.getHashedPassword(createUserDto.password);
        const verificationToken = uuidv4();

        let avatarPath: string | null = null;
        let avatarUrl: string | null = null;

        const expirationTime = new Date();
        expirationTime.setHours(expirationTime.getHours() + this.verificationTokenExpirationHours);

        if (avatar) {
            const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(avatar.originalname)}`;
            avatarPath = path.resolve(this.avatarUploadPath, fileName);
            avatarUrl = `${this.backendUrl}/avatars/${fileName}`;
            try {
                await sharp(avatar.buffer)
                    .resize(300, null, {
                        fit: 'inside',
                        withoutEnlargement: true,
                    })
                    .toFile(avatarPath);
                // resize width to 300, keeping ratio
            } catch (e) {
                console.log('Error processing the image:', e);
                throw new HttpException('Error processing image', HttpStatus.INTERNAL_SERVER_ERROR);
            }

            console.log(avatar);
        }

        const user = this.userRepository.create({
            name: createUserDto.name,
            email: createUserDto.email,
            username: createUserDto.username,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpires: expirationTime,
            avatarPath: avatarPath,
            avatarUrl,
        });

        const savedUser = await this.userRepository.save(user);

        await this.sendVerificationEmail(createUserDto.name, createUserDto.email, verificationToken);

        return savedUser;
    }

    async findOne(id: number) {
        return this.userRepository.findOne({
            where: { id },
        });
    }

    async update(userId: number, updateData: Partial<User>): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new Error('User not found');
        }

        const updatedUser = this.userRepository.merge(user, updateData);
        return this.userRepository.save(updatedUser);
    }

    async getHashedPassword(password: string) {
        return bcrypt.hash(password, 10);
    }

    async validatePassword(plainPassword: string, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    async findByEmailOrUsername(identifier: string): Promise<User | undefined> {
        return this.userRepository.findOne({
            where: [{ email: identifier }, { username: identifier }],
        });
    }

    async verifyAccount(token: string) {
        const user = await this.userRepository.findOne({
            where: { verificationToken: token },
        });

        if (!user || new Date() > user.verificationTokenExpires) {
            throw new BadRequestException('Token expired');
        }

        await this.userRepository.update(user.id, {
            verificationToken: null,
            verificationTokenExpires: null,
            verified: true,
        });

        return true;
    }

    async searchUser(query: string, loggedUserEmail: string): Promise<User | null> {
        const userFound = await this.userRepository.createQueryBuilder('user')
            .where('(user.username = :query OR user.email = :query)', { query })
            .andWhere('user.email != :loggedUserEmail', { loggedUserEmail })
            .getOne();

        if (!userFound) {
            throw new NotFoundException();
        }

        return userFound;
    }

    private async sendVerificationEmail(name: string, email: string, token: string) {
        console.log(`Send verification email to ${email} with token: ${token}`);

        const verificationUrl = `${this.webAppBaseUrl}/verify-account/${token}`;

        await this.mailService.sendEmail(email, 'Verify Your Account', 'verify-account', {
            name,
            verificationUrl,
        });

        console.log(`Verification email sent to ${email}`);
    }
}
