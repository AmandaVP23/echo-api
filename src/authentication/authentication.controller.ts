import { Body, Controller, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LogoutDto } from './dto/logout.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('authentication')
export class AuthenticationController {
    constructor(private readonly authenticationService: AuthenticationService) {}

    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authenticationService.login(loginDto);
    }

    @Post('/forgot-password')
    forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.authenticationService.forgotPassword(forgotPasswordDto);
    }

    @Post('reset-password')
    resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authenticationService.resetPassword(resetPasswordDto);
    }

    @Post('refresh')
    refresh(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authenticationService.refreshTokens(refreshTokenDto.refreshToken);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    logout(@Req() req: Request, @Body() logoutDto: LogoutDto) {
        const accessToken = req.headers['authorization']?.split(' ')[1];
        return this.authenticationService.logout(accessToken, logoutDto.refreshToken);
    }
}
