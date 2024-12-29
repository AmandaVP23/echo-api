import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFile,
    ClassSerializerInterceptor,
    UseGuards,
    Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/authentication/jwt-auth.guard';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('registration')
    @UseInterceptors(FileInterceptor('avatar'))
    @ApiOperation({ summary: 'Create a new user account' })
    create(
        @Body() createUserDto: CreateUserDto,
        @UploadedFile() avatar: Express.Multer.File | null,
    ) {
        return this.usersService.create(createUserDto, avatar);
    }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Request logged user information' })
    getLoggedUserInformation(@Request() req) {
        console.log(req.user);
        return 'hello!';
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
