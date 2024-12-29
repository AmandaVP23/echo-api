import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    BadRequestException,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { avatarUploadMulterOptions } from 'src/helpers/upload-avatar-config';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('registration')
    @UseInterceptors(FileInterceptor('avatar', avatarUploadMulterOptions))
    @ApiOperation({ summary: 'Create a new user account' })
    create(
        @Body() createUserDto: CreateUserDto,
        @UploadedFile() avatar: Express.Multer.File,
    ) {
        const avatarPath = avatar ? avatar.path : null;

        return this.usersService.create(createUserDto, avatar);
    }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }

    @Post('verify/:token')
    async verifyUser(@Param('token') token: string) {
        await this.usersService.verifyAccount(token);

        return 'Account successfully verified!';
    }
}
