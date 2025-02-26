import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    UseInterceptors,
    UploadedFile,
    ClassSerializerInterceptor,
    UseGuards,
    Request,
    Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/authentication/jwt-auth.guard';
import { User } from './entities/user.entity';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('registration')
    @UseInterceptors(FileInterceptor('avatar'))
    @ApiOperation({ summary: 'Create a new user account' })
    create(@Body() createUserDto: CreateUserDto, @UploadedFile() avatar: Express.Multer.File | null) {
        return this.usersService.create(createUserDto, avatar);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Request logged user information' })
    getLoggedUserInformation(@Request() req) {
        console.log(req.user)
        return this.usersService.findByEmailOrUsername(req.user.email);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }

    @Get('search')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Search user by exact username or email' })
    @ApiResponse({ status: 200, description: 'User found', type: User })
    async searchUser(@Request() req, @Query('search') query: string) {
        console.log(req.user);
        return await this.usersService.searchUser(query, req.user.email);
    }

    @Get('verify/:token')
    async verifyUser(@Param('token') token: string) {
        await this.usersService.verifyAccount(token);

        return 'Account successfully verified!';
    }
}
